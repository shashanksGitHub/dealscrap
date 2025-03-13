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

    // 4. Setup Vite or static serving
    if (app.get("env") === "development") {
      const originalPort = process.env.PORT;
      delete process.env.PORT;
      try {
        await setupVite(app, server);
        log("Vite middleware setup complete");
      } finally {
        process.env.PORT = originalPort;
      }
    } else {
      serveStatic(app);
    }

    // 5. Start server
    const port = Number(process.env.PORT || 5000);
    server.listen({ port, host: "0.0.0.0" }, () => {
      log(`Server running at http://0.0.0.0:${port}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();