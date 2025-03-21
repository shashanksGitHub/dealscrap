import "../shim.js";
import "tsconfig-paths/register.js";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { setupAuth } from "./auth";
import path from "path";
import { recoveryService } from "./services/recovery";
import fs from 'fs';
import { createServer } from 'http';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic middleware
app.use(express.json({
  verify: (req, res, buf) => {
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Enhanced Security headers including CSP
app.use((req, res, next) => {
  // Benutzerdefinierte Domains aus der Umgebung auslesen
  const customDomain = process.env.CUSTOM_DOMAIN;
  
  // CSP-Teile definieren
  const defaultSrc = ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.mollie.com", "https://*.googletagmanager.com", "*.replit.dev", "*.replit.app", "*.repl.co", "data:", "blob:"];
  const frameSrc = ["'self'", "https://*.mollie.com", "https://*.googletagmanager.com", "*.replit.dev", "*.replit.app", "*.repl.co"];
  const scriptSrc = ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.mollie.com", "https://*.googletagmanager.com", "*.replit.dev", "*.replit.app", "*.repl.co"];
  const connectSrc = ["'self'", "https://*.mollie.com", "https://*.googletagmanager.com", "*.replit.dev", "*.replit.app", "*.repl.co", "wss://*.replit.dev", "wss://*.replit.app", "wss://*.repl.co"];
  
  // Benutzerdefinierte Domain hinzufügen, wenn vorhanden
  if (customDomain) {
    const domainEntries = [`https://*.${customDomain}`, `https://${customDomain}`];
    const wssDomainEntries = [`wss://*.${customDomain}`, `wss://${customDomain}`];
    
    defaultSrc.push(...domainEntries);
    frameSrc.push(...domainEntries);
    scriptSrc.push(...domainEntries);
    connectSrc.push(...domainEntries, ...wssDomainEntries);
  }
  
  // CSP-Header zusammenstellen
  const cspValue = [
    `default-src ${defaultSrc.join(' ')};`,
    `frame-src ${frameSrc.join(' ')};`,
    `script-src ${scriptSrc.join(' ')};`,
    `connect-src ${connectSrc.join(' ')};`,
    "style-src 'self' 'unsafe-inline';",
    "img-src 'self' data: blob: https: http: *;",
    "font-src 'self' data:;"
  ].join(' ');
  
  res.setHeader('Content-Security-Policy', cspValue);
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

// Set up auth
log("Setting up authentication...");
setupAuth(app);

// Register API routes
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

    // Set up Vite in development mode
    if (process.env.NODE_ENV !== 'production') {
      log("Setting up Vite development server...");
      await setupVite(app, server);
      log("Vite development server setup complete");
    } else {
      // In production, serve static files
      log("Setting up static file serving...");
      const publicDir = path.resolve(__dirname, '../dist/public');
      if (!fs.existsSync(publicDir)) {
        log(`Production build directory not found at ${publicDir}, falling back to dist directory`);
        const fallbackDir = path.resolve(__dirname, '../dist');
        if (!fs.existsSync(fallbackDir)) {
          throw new Error('No production build directory found. Please build the project first.');
        }
        app.use(express.static(fallbackDir));
        app.get('*', (_req, res) => {
          log('Serving index.html for client-side routing');
          res.sendFile(path.join(fallbackDir, 'index.html'));
        });
      } else {
        app.use(express.static(publicDir));
        app.get('*', (_req, res) => {
          log('Serving index.html for client-side routing');
          res.sendFile(path.join(publicDir, 'index.html'));
        });
      }
      log("Static file serving setup complete");
    }

    // Start the server
    const portNumber = typeof PORT === 'string' ? parseInt(PORT) : PORT;
    server.listen(portNumber, "0.0.0.0", () => {
      log(`Server running on port ${portNumber} in ${process.env.NODE_ENV} mode`);
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