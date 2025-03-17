import "../shim.js";
import "tsconfig-paths/register.js";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";
import path from "path";
import { recoveryService } from "./services/recovery";
import fs from 'fs';

const app = express();

// Basic middleware with raw body parsing for Stripe webhooks
app.use(express.json({
  verify: (req, res, buf) => {
    // Raw body needed for Stripe webhook verification
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Enhanced Security headers including CSP for Stripe and static assets
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://*.stripe.com https://*.stripe.network *.replit.dev *.replit.app *.repl.co; " +
    "frame-src 'self' https://*.stripe.com https://*.stripe.network *.replit.dev *.replit.app *.repl.co; " +
    "script-src 'self' 'unsafe-inline' https://*.stripe.com https://*.stripe.network *.replit.dev *.replit.app *.repl.co; " +
    "connect-src 'self' https://*.stripe.com https://*.stripe.network *.replit.dev *.replit.app *.repl.co wss://*.replit.dev wss://*.replit.app wss://*.repl.co; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: http:; " +
    "font-src 'self' data:;"
  );
  next();
});

// Enhanced CORS middleware with support for all Replit domains
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://replit.com',
    'https://*.replit.dev',
    'https://*.replit.app',
    'https://*.repl.co',
    'http://localhost:3000',
    'http://localhost:5000',
    'https://leadscraper.de',
    'https://www.leadscraper.de',
    'https://lead-harvester-1-scalingup.replit.app',
    'https://leadscraper.replit.app'
  ];

  const origin = req.headers.origin;
  if (origin) {
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const pattern = new RegExp('^' + allowedOrigin.replace(/\./g, '\\.').replace(/\*/g, '[^.]+') + '$');
        return pattern.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      res.header('Access-Control-Allow-Origin', origin);
      // Add additional CORS headers for better browser support
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, stripe-signature');
      res.header('Access-Control-Allow-Credentials', 'true');
    }
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging with improved error handling 
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// First set up auth as it's needed for protected routes
log("Setting up authentication...");
setupAuth(app);

// Then register API routes before any static middleware
log("Registering API routes...");
const apiRouter = express.Router();
registerRoutes(apiRouter);

// Mount API router with explicit content type
app.use('/api', (req, res, next) => {
  // Special handling for Stripe webhooks
  if (req.path === '/stripe-webhook') {
    res.setHeader('Content-Type', 'application/json');
    return next();
  }
  // Force JSON content type for other API routes
  res.setHeader('Content-Type', 'application/json');
  log(`Processing API request: ${req.method} ${req.path}`);
  next();
}, apiRouter);

// Enhanced error handler middleware with recovery mechanism
const errorHandler = async (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  log(`Error: ${message}`);

  // Attempt recovery for critical errors
  if (status >= 500) {
    try {
      await recoveryService.handleDeploymentError(err);
    } catch (recoveryError) {
      log(`Recovery failed: ${recoveryError}`);
    }
  }

  res.status(status).json({ message });
};

async function startServer() {
  try {
    log("Starting server initialization...");
    const server = await import('http').then(({ createServer }) => createServer(app));

    // Force production mode for deployment
    const isProduction = true;
    log(`Starting server in production mode`);

    // Check all services before proceeding
    const serviceStatus = await recoveryService.checkServices();
    if (!Object.values(serviceStatus).every(status => status)) {
      throw new Error("Critical services are not available");
    }

    // In production, serve the built client files from dist/public
    const publicDir = path.join(process.cwd(), 'dist/public');
    log(`Serving static files from: ${publicDir}`);

    if (!fs.existsSync(publicDir)) {
      throw new Error(`Production build directory not found: ${publicDir}`);
    }

    // Serve static files with cache control
    app.use(express.static(publicDir, {
      maxAge: '1y',
      etag: true,
      lastModified: true,
    }));

    // Always return index.html for any unknown routes (SPA support)
    app.get('*', (req, res) => {
      res.sendFile(path.join(publicDir, 'index.html'));
    });

    // Add error handler last
    app.use(errorHandler);

    const port = Number(process.env.PORT || 5000);
    server.listen(port, "0.0.0.0", () => {
      log(`Server running at http://0.0.0.0:${port} in production mode`);
    });

  } catch (error: any) {
    log(`Fatal error during server initialization: ${error}`);
    await recoveryService.handleDeploymentError(error);
    process.exit(1);
  }
}

// Start the server with error handling
startServer().catch(async (error) => {
  log(`Unhandled error during server startup: ${error}`);
  await recoveryService.handleDeploymentError(error);
  process.exit(1);
});