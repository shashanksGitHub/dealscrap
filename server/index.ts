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

// Basic middleware
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
    "default-src 'self' https://*.stripe.com https://*.stripe.network *.replit.dev *.replit.app; " +
    "frame-src 'self' https://*.stripe.com https://*.stripe.network *.replit.dev *.replit.app; " +
    "script-src 'self' 'unsafe-inline' https://*.stripe.com https://*.stripe.network *.replit.dev *.replit.app; " +
    "connect-src 'self' https://*.stripe.com https://*.stripe.network *.replit.dev *.replit.app wss://*.replit.dev wss://*.replit.app; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: http:; " +
    "font-src 'self' data:;"
  );
  next();
});

// Enhanced CORS middleware with support for custom domains
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://replit.com',
    'https://*.replit.dev',
    'http://localhost:3000',
    'http://localhost:5000',
    'https://leadscraper.de',
    'https://www.leadscraper.de',
    'https://lead-harvester-1-scalingup.replit.app'
  ];

  const origin = req.headers.origin;
  if (origin) {
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const pattern = new RegExp(allowedOrigin.replace('*', '.*'));
        return pattern.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, stripe-signature");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
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

    // Set environment based on NODE_ENV
    const isProduction = process.env.NODE_ENV === "production";
    log(`Starting server in ${isProduction ? 'production' : 'development'} mode`);

    // Check all services before proceeding
    const serviceStatus = await recoveryService.checkServices();
    if (!Object.values(serviceStatus).every(status => status)) {
      throw new Error("Critical services are not available");
    }

    // First set up auth as it's needed for protected routes
    log("Setting up authentication...");
    setupAuth(app);

    // Then register API routes before any static middleware
    log("Registering API routes...");
    const apiRouter = express.Router();
    await registerRoutes(apiRouter);

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

    if (isProduction) {
      log("Setting up production static file serving...");
      // Updated path to serve static files from the correct build directory
      const publicDir = path.resolve(__dirname, '../dist/public');
      log(`Serving static files from: ${publicDir}`);
      log(`Production environment detected:
NODE_ENV: ${process.env.NODE_ENV}
PORT: ${process.env.PORT}
PWD: ${process.cwd()}
BUILD_DIR: ${publicDir}`);

      // Verify build directory exists
      if (!fs.existsSync(publicDir)) {
        log(`⚠️ Warning: Build directory ${publicDir} does not exist!`);
        throw new Error(`Build directory ${publicDir} does not exist`);
      } else {
        log(`✓ Build directory ${publicDir} exists`);
        // List contents of build directory
        const files = fs.readdirSync(publicDir);
        log(`Build directory contents: ${files.join(', ')}`);
      }

      // Serve static files with proper MIME types
      app.use(express.static(publicDir, {
        index: false, // Disable directory indexing
        extensions: ['html', 'htm'], // Try these extensions for extensionless URLs
        setHeaders: (res, path) => {
          // Set proper caching headers
          if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          } else {
            // Cache static assets for 1 year
            res.setHeader('Cache-Control', 'public, max-age=31536000');
          }
          // Log static file requests in production
          log(`Serving static file: ${path}`);
        }
      }));

      // Serve index.html for all routes in production
      app.get('*', (_req, res) => {
        const indexPath = path.resolve(publicDir, 'index.html');
        log(`Attempting to serve index.html from: ${indexPath}`);

        if (!fs.existsSync(indexPath)) {
          log(`❌ Error: index.html not found at ${indexPath}`);
          return res.status(500).send('Server configuration error: index.html not found');
        }

        log(`✓ Serving index.html from ${indexPath}`);
        res.sendFile(indexPath);
      });
    } else {
      log("Setting up development Vite middleware...");
      await setupVite(app, server);
    }

    // Add error handler last
    app.use(errorHandler);

    const port = Number(process.env.PORT || 3000);

    server.listen(port, "0.0.0.0", () => {
      log(`Server running at http://0.0.0.0:${port} in ${process.env.NODE_ENV} mode`);
    });

    server.on('error', async (error: any) => {
      if (error.code === 'EADDRINUSE') {
        log(`Error: Port ${port} is already in use`);
      } else {
        log(`Server error: ${error.message}`);
        // Attempt recovery for server errors
        await recoveryService.handleDeploymentError(error);
      }
      process.exit(1);
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