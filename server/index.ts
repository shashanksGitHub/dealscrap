import "../shim.js";
import "tsconfig-paths/register";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";

const app = express();

// Basic middleware
app.use(express.json({
  verify: (req, res, buf) => {
    // Raw body needed for Stripe webhook verification
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Security headers including CSP for Stripe
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://*.stripe.com https://*.stripe.network; " +
    "frame-src 'self' https://*.stripe.com https://*.stripe.network; " +
    "script-src 'self' 'unsafe-inline' https://*.stripe.com https://*.stripe.network; " +
    "style-src 'self' 'unsafe-inline';"
  );
  next();
});

// CORS middleware with proper configuration for Stripe
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, stripe-signature");
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

// Error handler middleware
const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  log(`Error: ${message}`);
  res.status(status).json({ message });
};

async function startServer() {
  try {
    log("Starting server initialization...");
    const server = await import('http').then(({ createServer }) => createServer(app));

    // Force development mode for local development
    process.env.NODE_ENV = "development";

    if (process.env.NODE_ENV === "development") {
      log("Setting up development environment...");

      // First set up auth as it's needed for protected routes
      log("Setting up authentication...");
      setupAuth(app);

      // Then register API routes before Vite middleware
      log("Registering API routes...");
      const apiRouter = express.Router();
      await registerRoutes(apiRouter);

      // Mount API router first with explicit content type
      app.use('/api', (req, res, next) => {
        // Special handling for Stripe webhooks
        if (req.path === '/stripe-webhook') {
          // Raw body needed for webhook signature verification
          res.setHeader('Content-Type', 'application/json');
          return next();
        }
        // Force JSON content type for other API routes
        res.setHeader('Content-Type', 'application/json');
        log(`Processing API request: ${req.method} ${req.path}`);
        next();
      }, apiRouter);

      // Finally set up Vite middleware
      log("Setting up Vite middleware...");
      await setupVite(app, server);

      app.use(errorHandler);
    } else {
      log("Setting up production environment...");
      setupAuth(app);
      const apiRouter = express.Router();
      await registerRoutes(apiRouter);
      app.use('/api', apiRouter);
      serveStatic(app);
      app.use(errorHandler);
    }

    const port = Number(process.env.PORT || 5000);

    server.listen(port, "0.0.0.0", () => {
      log(`Server running at http://0.0.0.0:${port} in ${process.env.NODE_ENV} mode`);
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        log(`Error: Port ${port} is already in use`);
      } else {
        log(`Server error: ${error.message}`);
      }
      process.exit(1);
    });

  } catch (error) {
    log(`Fatal error during server initialization: ${error}`);
    process.exit(1);
  }
}

// Start the server
startServer().catch((error) => {
  log(`Unhandled error during server startup: ${error}`);
  process.exit(1);
});
