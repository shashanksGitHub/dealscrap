import "../shim.js";
import "tsconfig-paths/register.js";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";
import path from "path";
import { recoveryService } from "./services/recovery";
import fs from 'fs';
import { createServer } from 'http';
import { AddressInfo } from 'net';

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
    "img-src 'self' data: blob: https: http: *; " +
    "font-src 'self' data:;"
  );
  next();
});

// Enhanced CORS middleware with support for all Replit domains
app.use((req, res, next) => {
  // Accept all origins in development mode
  if (process.env.NODE_ENV === 'development') {
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, stripe-signature');
      res.header('Access-Control-Allow-Credentials', 'true');
    }
  } else {
    const allowedOrigins = [
      'https://replit.com',
      'https://*.replit.dev',
      'https://*.replit.app',
      'https://*.repl.co',
      'http://localhost:3000',
      'http://localhost:5000',
      'https://leadscraper.de',
      'https://www.leadscraper.de'
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
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, stripe-signature');
        res.header('Access-Control-Allow-Credentials', 'true');
      }
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
    const server = createServer(app);
    const PORT = 5000; // Fixed port for Replit

    // Force development mode when VITE_FORCE_DEV_SERVER is true
    const isProduction = process.env.VITE_FORCE_DEV_SERVER !== 'true' && process.env.NODE_ENV === 'production';
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
      log("Setting up Vite development server...");
      await setupVite(app, server);
      log("Vite development server setup complete");
    }

    // Attempt to start server on port 5000
    server.listen(PORT, "0.0.0.0", () => {
      const address = server.address() as AddressInfo;
      log(`Server running at http://0.0.0.0:${PORT} in ${isProduction ? 'production' : 'development'} mode`);
    });

    // Handle server errors
    server.on('error', async (error: any) => {
      if (error.code === 'EADDRINUSE') {
        log(`ERROR: Port ${PORT} is already in use. The application must run on port ${PORT}.`);
        log(`Please ensure no other processes are using port ${PORT} and try again.`);
        process.exit(1);
      } else {
        log(`Server error: ${error.message}`);
        await recoveryService.handleDeploymentError(error);
      }
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