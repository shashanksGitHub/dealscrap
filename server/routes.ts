import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { createPayment, verifyPayment } from "./services/mollie";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Credit management
  app.post("/api/credits/purchase", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const payment = await createPayment(req.user.id, req.body.packageId);
      res.json({ checkoutUrl: payment.getCheckoutUrl() });
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment" });
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

  app.post("/api/payments/webhook", async (req, res) => {
    try {
      const payment = await verifyPayment(req.body.id);

      if (payment.isPaid()) {
        const { userId, credits } = payment.metadata;
        await storage.addCredits(userId, credits);
      }

      res.status(200).send("OK");
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).send("Error processing webhook");
    }
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
    if (user.credits <= 0) {
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
      res.status(500).json({ message: "Failed to scrape data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}