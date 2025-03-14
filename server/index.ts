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
    const server = await createServer(app);

    // Force development mode for local development
    process.env.NODE_ENV = "development";

    if (process.env.NODE_ENV === "development") {
      log("Setting up development environment...");

      log("Setting up authentication...");
      setupAuth(app);

      log("Setting up Vite middleware...");
      await setupVite(app, server);

      log("Registering routes...");
      await registerRoutes(app);

      app.use(errorHandler);
    } else {
      log("Setting up production environment...");
      setupAuth(app);
      await registerRoutes(app);
      serveStatic(app);
      app.use(errorHandler);
    }

    const port = Number(process.env.PORT || 5000);

    server.listen(port, () => {
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

function createServer(app: express.Express) {
  return import('http').then(({ createServer }) => createServer(app));
}

// Start the server
startServer().catch((error) => {
  log(`Unhandled error during server startup: ${error}`);
  process.exit(1);
});