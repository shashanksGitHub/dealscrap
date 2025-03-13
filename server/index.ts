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

(async () => {
  try {
    log("Initializing server...");

    // 1. Setup authentication with sessions
    setupAuth(app);
    log("Auth setup complete");

    // 2. Setup API routes
    const server = await registerRoutes(app);
    log("Routes setup complete");

    // 3. Setup error handling
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log(`Error: ${message}`);
      res.status(status).json({ message });
    });

    // 4. Setup Vite middleware in development
    if (app.get("env") === "development") {
      try {
        await setupVite(app, server);
        log("Vite middleware setup complete");
      } catch (error) {
        log("Vite setup failed: " + error);
        throw error;
      }
    } else {
      serveStatic(app);
    }

    // 5. Start server on port 5000
    const port = 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`Server running at http://0.0.0.0:${port}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();