import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'development_secret',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    name: 'sid',
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/'
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false, { message: "Ungültige Anmeldedaten" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "E-Mail und Passwort sind erforderlich" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Diese E-Mail-Adresse wird bereits verwendet" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: Express.User | false, info: { message: string } | undefined) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Ungültige Anmeldedaten" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }
    res.json(req.user);
  });

  // Password reset request
  app.post("/api/request-password-reset", async (req, res) => {
    try {
      const { email } = req.body;
      const user = await storage.getUserByEmail(email);

      if (!user) {
        // Return success even if user not found for security
        return res.json({ message: "Wenn ein Konto mit dieser E-Mail existiert, erhalten Sie eine E-Mail mit weiteren Anweisungen." });
      }

      const resetToken = randomBytes(32).toString("hex");
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1); // Token expires in 1 hour

      await storage.setResetToken(user.id, resetToken, expiry);

      // TODO: Send email with reset link
      // For now, just return the token
      res.json({ resetToken });
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Zurücksetzen des Passworts" });
    }
  });

  // Reset password
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      const user = await storage.getUserByResetToken(token);
      if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
        return res.status(400).json({ message: "Ungültiger oder abgelaufener Reset-Token" });
      }

      const hashedPassword = await hashPassword(newPassword);
      await storage.updatePassword(user.id, hashedPassword);
      await storage.clearResetToken(user.id);

      res.json({ message: "Passwort erfolgreich zurückgesetzt" });
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Zurücksetzen des Passworts" });
    }
  });
}