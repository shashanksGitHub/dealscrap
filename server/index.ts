import "../shim.js";
import "tsconfig-paths/register.js";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { log } from "./vite";
import { setupAuth } from "./auth";
import path from "path";
import { recoveryService } from "./services/recovery";
import fs from 'fs';
import { createServer } from 'http';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force production mode always
process.env.NODE_ENV = 'production';

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
  next();
});

// Request logging with detailed error reporting
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

    log("Running service health checks...");
    const serviceStatus = await recoveryService.checkServices();
    if (!Object.values(serviceStatus).every(status => status)) {
      throw new Error("Critical services are not available");
    }
    log("Service health checks passed successfully");

    // Serve static files from the production build
    log("Setting up static file serving...");
    const publicDir = path.resolve(__dirname, '../dist/public');
    if (!fs.existsSync(publicDir)) {
      log(`Production build directory not found at ${publicDir}, falling back to dist directory`);
      const fallbackDir = path.resolve(__dirname, '../dist');
      if (!fs.existsSync(fallbackDir)) {
        throw new Error('No production build directory found. Please build the project first.');
      }
      app.use(express.static(fallbackDir));
      // Serve index.html for all routes to support client-side routing
      app.get('*', (_req, res) => {
        log('Serving index.html for client-side routing');
        res.sendFile(path.join(fallbackDir, 'index.html'));
      });
    } else {
      app.use(express.static(publicDir));
      // Serve index.html for all routes to support client-side routing
      app.get('*', (_req, res) => {
        log('Serving index.html for client-side routing');
        res.sendFile(path.join(publicDir, 'index.html'));
      });
    }
    log("Static file serving setup complete");

    // Start the server
    server.listen(PORT, () => {
      log(`Server running in production mode on port ${PORT}`);
    });

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