import "../shim.js";
import "tsconfig-paths/register.js";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite,  log } from "./vite";
import { setupAuth } from "./auth";
import path from "path";
import { recoveryService } from "./services/recovery";
import fs from 'fs';
import { createServer } from 'http';

const app = express();

// Basic middleware with raw body parsing for Stripe webhooks
app.use(express.json({
  verify: (req, res, buf) => {
    // Raw body needed for Stripe webhook verification
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Enhanced Security headers including CSP
app.use((req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://*.stripe.network https://*.googletagmanager.com *.replit.dev *.replit.app *.repl.co data: blob:; " +
      "frame-src 'self' https://*.stripe.com https://*.stripe.network https://*.googletagmanager.com *.replit.dev *.replit.app *.repl.co; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://*.stripe.network https://*.googletagmanager.com *.replit.dev *.replit.app *.repl.co; " +
      "connect-src 'self' https://*.stripe.com https://*.stripe.network https://*.googletagmanager.com *.replit.dev *.replit.app *.repl.co wss://*.replit.dev wss://*.replit.app wss://*.repl.co; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: blob: https: http: *; " +
      "font-src 'self' data:;"
    );
  } else {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' https://*.stripe.com https://*.stripe.network https://*.googletagmanager.com; " +
      "frame-src 'self' https://*.stripe.com https://*.stripe.network https://*.googletagmanager.com; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://*.stripe.network https://*.googletagmanager.com; " +
      "connect-src 'self' https://*.stripe.com https://*.stripe.network https://*.googletagmanager.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: blob: https://*.stripe.com; " +
      "font-src 'self' data:;"
    );
  }
  next();
});

// CORS middleware for development and production
app.use((req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // In development, accept all Replit domains
    const origin = req.headers.origin;
    if (origin && (
      origin.endsWith('.replit.dev') ||
      origin.endsWith('.replit.app') ||
      origin.endsWith('.repl.co') ||
      origin === 'https://replit.com'
    )) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, stripe-signature');
      res.header('Access-Control-Allow-Credentials', 'true');
    }
  } else {
    // In production, only accept your domain
    const origin = req.headers.origin;
    if (origin === process.env.PRODUCTION_URL) {
      res.header('Access-Control-Allow-Origin', origin);
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

// Request logging
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
    const server = createServer(app);
    const PORT = process.env.PORT || 5000;
    const isDev = process.env.NODE_ENV !== 'production';

    log(`Starting server in ${isDev ? 'development' : 'production'} mode`);

    // Check all services before proceeding
    log("Running service health checks...");
    const serviceStatus = await recoveryService.checkServices();
    if (!Object.values(serviceStatus).every(status => status)) {
      throw new Error("Critical services are not available");
    }
    log("Service health checks passed successfully");

    if (isDev) {
      // In development, set up Vite dev server
      log("Setting up Vite development server...");
      await setupVite(app, server);
      log("Vite development server setup complete");
    } else {
      // In production, serve the built client files
      log("Setting up static file serving for production...");
      const publicDir = path.resolve(__dirname, '../dist/public');
      if (!fs.existsSync(publicDir)) {
        throw new Error(`Production build directory not found: ${publicDir}`);
      }
      app.use(express.static(publicDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(publicDir, 'index.html'));
      });
      log("Static file serving setup complete");
    }

    // Attempt to start server with retries
    let retries = 3;
    while (retries > 0) {
      try {
        await new Promise((resolve, reject) => {
          server.listen(PORT, "0.0.0.0", () => {
            const address = server.address();
            if (address && typeof address === 'object') {
              log(`Server running at http://0.0.0.0:${PORT} in ${isDev ? 'development' : 'production'} mode`);
              resolve(undefined);
            } else {
              reject(new Error('Failed to get server address'));
            }
          });

          server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.code === 'EADDRINUSE') {
              reject(error);
            }
          });
        });
        break; // Server started successfully
      } catch (error: any) {
        if (error.code === 'EADDRINUSE') {
          if (retries > 1) {
            log(`Port ${PORT} is in use, waiting before retry...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            retries--;
          } else {
            log(`ERROR: Port ${PORT} is still in use after retries.`);
            throw error;
          }
        } else {
          throw error;
        }
      }
    }

    // Handle server errors
    server.on('error', async (error: any) => {
      log(`Server error: ${error.message}`);
      await recoveryService.handleDeploymentError(error);
    });

  } catch (error: any) {
    log(`Fatal error during server initialization: ${error.stack || error}`);
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