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
app.use('/api', apiRouter);

async function startServer() {
  try {
    log("Starting server initialization...");
    const server = await import('http').then(({ createServer }) => createServer(app));

    // Set to development mode for Vite dev server
    const isProduction = process.env.NODE_ENV === 'production';
    log(`Starting server in ${isProduction ? 'production' : 'development'} mode`);

    // Check all services before proceeding
    const serviceStatus = await recoveryService.checkServices();
    if (!Object.values(serviceStatus).every(status => status)) {
      throw new Error("Critical services are not available");
    }

    if (isProduction) {
      // In production, serve the built client files
      const publicDir = path.join(process.cwd(), 'dist/public');
      if (!fs.existsSync(publicDir)) {
        throw new Error(`Production build directory not found: ${publicDir}`);
      }
      serveStatic(app);
    } else {
      // In development, set up Vite dev server
      await setupVite(app, server);
    }

    const port = Number(process.env.PORT || 5000);
    server.listen(port, "0.0.0.0", () => {
      log(`Server running at http://0.0.0.0:${port} in ${isProduction ? 'production' : 'development'} mode`);
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