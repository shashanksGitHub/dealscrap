import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging with improved error handling
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Debug logging
app.use((req, res, next) => {
  log(`Session ID: ${req.sessionID || 'none'}, Auth: ${req.isAuthenticated?.() || false}, Path: ${req.path}`);
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
        // Force JSON content type for API routes
        res.setHeader('Content-Type', 'application/json');
        log(`Processing API request: ${req.method} ${req.path}`);
        next();
      }, apiRouter);

      // Catch unhandled API routes
      app.use('/api', (req, res) => {
        log(`Unhandled API route: ${req.method} ${req.path}`);
        res.status(404).json({ error: 'API route not found' });
      });

      // Finally set up Vite middleware for all other routes
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