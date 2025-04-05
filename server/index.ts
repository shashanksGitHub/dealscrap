import "./config";  // Import config first to load environment variables
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
import compression from "compression";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { comparePasswords } from "./auth";
import { CONFIG } from "./config";
import { initializePool } from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Add compression middleware
app.use(compression());

// Optimize static file serving
app.use(express.static("dist/public", {
  maxAge: "1h",
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Cache images and videos for longer
    if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.gif') || path.endsWith('.mp4')) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
    }
    // Cache CSS and JS for a shorter time
    else if (path.endsWith('.css') || path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
    }
  }
}));

// Body parser middleware with limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Session middleware with optimized settings
app.use(session({
  store: storage.sessionStore,
  secret: CONFIG.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: "Invalid email or password" });
      }

      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Invalid email or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

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

// Serve index.html for all other routes (SPA)
app.get("*", (req, res) => {
  res.sendFile("dist/public/index.html", { root: "." });
});

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

// Initialize database pool with an IIFE
(async () => {
  try {
    await initializePool();
    // We don't need to start the server here as it's already started in the startServer function
  } catch (error) {
    console.error("Failed to initialize database pool:", error);
    process.exit(1);
  }
})();