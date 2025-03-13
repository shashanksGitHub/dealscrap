import { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { createPayment, handleWebhook } from "./services/stripe";
import Stripe from "stripe";
import * as express from 'express';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

interface PaymentMetadata {
  userId: number;
  credits: number;
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Configure express.raw() middleware only for the webhook route
  app.post("/api/payments/webhook", express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
      if (!sig) {
        throw new Error('No Stripe signature found');
      }

      const event = stripe.webhooks.constructEvent(
        req.body,
        sig as string | Buffer,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );

      const result = await handleWebhook(event);
      if (result) {
        await storage.addCredits(result.userId, result.credits);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).send(`Webhook Error: ${(error as Error).message}`);
    }
  });

  // Credit management
  app.post("/api/credits/purchase", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      if (!["100", "250", "500", "1000"].includes(req.body.packageId)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }

      const session = await createPayment(
        req.user.id, 
        req.body.packageId as "100" | "250" | "500" | "1000"
      );

      if (!session.url) {
        throw new Error("No checkout URL received from Stripe");
      }

      res.json({ checkoutUrl: session.url });
    } catch (error) {
      console.error("Payment creation error:", error);
      res.status(500).json({ message: "Failed to create payment", error: (error as Error).message });
    }
  });

  app.post("/api/credits/add", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const amount = parseInt(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid credit amount" });
    }

    const user = await storage.addCredits(req.user.id, amount);
    res.json(user);
  });

  // Lead management
  app.get("/api/leads", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const leads = await storage.getLeadsByUserId(req.user.id);
    res.json(leads);
  });

  app.post("/api/scrape", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { query, location } = req.body;

    if (!query || !location) {
      return res.status(400).json({ message: "Query and location are required" });
    }

    const user = await storage.getUser(req.user.id);
    if (!user || user.credits <= 0) {
      return res.status(403).json({ message: "Insufficient credits" });
    }

    try {
      const response = await fetch(`https://api.apify.com/v2/acts/drobnikj~google-maps-scraper/runs?token=${process.env.APIFY_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startUrls: [{
            url: `https://www.google.com/maps/search/${encodeURIComponent(query)}+${encodeURIComponent(location)}`
          }],
          maxCrawledPlaces: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to scrape data');
      }

      await storage.addCredits(req.user.id, -1);
      const lead = await storage.createLead({
        userId: req.user.id,
        businessName: "Example Business",
        address: "123 Example St",
        phone: "+1234567890",
        email: "example@business.com",
        website: "www.example.com",
        category: "Business",
        metadata: {}
      });

      res.json(lead);
    } catch (error) {
      res.status(500).json({ message: "Failed to scrape data", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}