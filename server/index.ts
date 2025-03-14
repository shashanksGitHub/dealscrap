import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Debug logging for session and auth
app.use((req, res, next) => {
  log(`Session ID: ${req.sessionID}, Authenticated: ${req.isAuthenticated?.()}, Path: ${req.path}`);
  next();
});

(async () => {
  try {
    log("Starting server initialization...");

    if (app.get("env") === "development") {
      try {
        log("Creating HTTP server...");
        const server = await createServer(app);

        log("Setting up Vite middleware...");
        await setupVite(app, server);
        log("Vite middleware setup complete");

        log("Setting up authentication...");
        setupAuth(app);
        log("Authentication setup complete");

        log("Registering routes...");
        await registerRoutes(app);
        log("Routes registration complete");

        log("Setting up error handling...");
        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
          const status = err.status || err.statusCode || 500;
          const message = err.message || "Internal Server Error";
          log(`Error: ${message}`);
          res.status(status).json({ message });
        });

        const port = 5000;
        server.on('error', (error: any) => {
          if (error.code === 'EADDRINUSE') {
            log(`Error: Port ${port} is already in use. Attempting to terminate existing process...`);
            process.exit(1);
          } else {
            log(`Critical server error: ${error.message}`);
            process.exit(1);
          }
        });

        log(`Attempting to start server on port ${port}...`);
        server.listen(port, "0.0.0.0", () => {
          log(`Server successfully started and listening at http://0.0.0.0:${port}`);
        });

      } catch (error) {
        log(`Critical error during server setup: ${error}`);
        throw error;
      }
    } else {
      log("Starting production server...");
      const server = await createServer(app);
      setupAuth(app);
      await registerRoutes(app);
      serveStatic(app);

      const port = 5000;
      server.on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          log(`Error: Port ${port} is already in use in production mode`);
        } else {
          log(`Production server error: ${error.message}`);
        }
        process.exit(1);
      });

      server.listen(port, "0.0.0.0", () => {
        log(`Production server running at http://0.0.0.0:${port}`);
      });
    }
  } catch (error) {
    log(`Fatal error during server initialization: ${error}`);
    process.exit(1);
  }
})();

function createServer(app: express.Express) {
  return import('http').then(({ createServer }) => createServer(app));
}