import { Router } from "express";
import { insertLeadSchema, insertBlogPostSchema, businessInfoSchema } from "../shared/schema";
import { storage } from "./storage";
import { createOrUpdateCustomer, createPaymentIntent, handleWebhookEvent, isStripeInitialized } from "./services/stripe";

export async function registerRoutes(router: Router) {
  // Get user info with additional verification
  router.get("/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Benutzer nicht gefunden" });
      }

      console.log(`Sending user info - ID: ${user.id}, Credits: ${user.credits}`);
      res.json(user);
    } catch (error: any) {
      console.error('Error fetching user info:', error);
      res.status(500).json({ message: "Fehler beim Abrufen der Benutzerinformationen" });
    }
  });

  // Business information and payment routes
  router.post("/business-info", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    try {
      if (!isStripeInitialized()) {
        return res.status(503).json({ 
          message: "Zahlungssystem temporär nicht verfügbar. Bitte versuchen Sie es später erneut." 
        });
      }

      const businessInfo = businessInfoSchema.parse(req.body);
      await storage.updateBusinessInfo(req.user.id, businessInfo);
      const customer = await createOrUpdateCustomer(req.user.id, businessInfo);

      res.json({ success: true, customerId: customer.id });
    } catch (error: any) {
      console.error('Error updating business info:', error);
      res.status(400).json({ message: error.message });
    }
  });

  router.post("/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    try {
      if (!isStripeInitialized()) {
        return res.status(503).json({ 
          message: "Zahlungssystem temporär nicht verfügbar. Bitte versuchen Sie es später erneut." 
        });
      }

      const { amount, customerId } = req.body;

      if (!amount || !customerId) {
        return res.status(400).json({ message: "Betrag und Customer ID sind erforderlich" });
      }

      const paymentIntent = await createPaymentIntent(req.user.id, amount, customerId);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ message: error.message });
    }
  });

  router.post("/stripe-webhook", async (req, res) => {
    try {
      if (!isStripeInitialized()) {
        return res.status(503).json({ message: "Stripe service not available" });
      }

      await handleWebhookEvent(
        req.headers['stripe-signature'] as string,
        req.body
      );
      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Credit management
  router.post("/credits/add", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Nicht authentifiziert" });

    console.log('Adding credits for user:', req.user.id);
    const amount = parseInt(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid credit amount:', amount);
      return res.status(400).json({ message: "Invalid credit amount" });
    }

    try {
      console.log(`Adding ${amount} credits to user ${req.user.id}`);
      const user = await storage.addCredits(req.user.id, amount);
      console.log('Updated user credits:', user.credits);
      res.json(user);
    } catch (error) {
      console.error('Error adding credits:', error);
      res.status(500).json({ message: "Failed to add credits" });
    }
  });

  // Lead management
  router.get("/leads", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Nicht authentifiziert" });
    const leads = await storage.getLeadsByUserId(req.user.id);
    res.json(leads);
  });

  // Blog routes
  router.get("/blog-posts", async (req, res) => {
    const authorId = req.query.authorId ? parseInt(req.query.authorId as string) : undefined;
    const posts = await storage.getBlogPosts(authorId);
    res.json(posts);
  });

  router.get("/blog-posts/:id", async (req, res) => {
    const post = await storage.getBlogPost(parseInt(req.params.id));
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(post);
  });

  router.post("/blog-posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Nicht authentifiziert" });

    try {
      const validatedData = insertBlogPostSchema.parse({
        ...req.body,
        authorId: req.user.id
      });

      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data", error });
    }
  });

  router.post("/scrape", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Nicht authentifiziert" });
    const { query, location } = req.body;

    if (!query || !location) {
      return res.status(400).json({ message: "Query and location are required" });
    }

    const user = await storage.getUser(req.user.id);
    if (!user || user.credits <= 0) {
      return res.status(403).json({ message: "Insufficient credits" });
    }

    try {
      // Mock scraping for now
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
}