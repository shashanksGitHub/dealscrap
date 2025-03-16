import { Router } from "express";
import { insertLeadSchema, insertBlogPostSchema } from "../shared/schema";
import { storage } from "./storage";
import { createPayment, handleWebhookEvent } from "./services/mollie";
import { apifyClient } from "./services/apify"; // Added import for apifyClient


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
  router.post("/create-payment", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    try {
      console.log('Processing payment request:', {
        userId: req.user.id,
        amount: req.body.amount
      });

      const amount = parseInt(req.body.amount);
      if (!amount) {
        return res.status(400).json({ message: "Betrag ist erforderlich" });
      }

      const checkoutUrl = await createPayment(
        req.user.id,
        amount,
        `${amount} Credits`
      );

      if (!checkoutUrl) {
        throw new Error('Keine Checkout-URL von Mollie erhalten');
      }

      console.log('Payment created, redirecting to:', checkoutUrl);

      res.json({
        success: true,
        checkoutUrl
      });
    } catch (error: any) {
      console.error('Error creating payment:', error);
      res.status(400).json({ 
        message: "Fehler bei der Zahlungsvorbereitung", 
        details: error.message 
      });
    }
  });

  router.post("/mollie-webhook", async (req, res) => {
    try {
      const paymentId = req.body.id;
      if (!paymentId) {
        return res.status(400).json({ message: "Payment ID fehlt" });
      }

      console.log('Received webhook for payment:', paymentId);
      await handleWebhookEvent(paymentId);
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
    const { query, location, count } = req.body;

    if (!query || !location || !count) {
      return res.status(400).json({ message: "Query, location, and count are required" });
    }

    // Validiere die Anzahl der Leads
    if (count < 1 || count > 100) {
      return res.status(400).json({ message: "Lead count must be between 1 and 100" });
    }

    const user = await storage.getUser(req.user.id);
    if (!user || user.credits < count) {
      return res.status(403).json({ message: "Insufficient credits" });
    }

    try {
      console.log(`Starting scrape for ${count} leads with query: ${query}, location: ${location}`);

      // Verbinde mit Apify und starte den Scraper
      const leads = await apifyClient.actor("apify/google-places-scraper").call({
        searchStrings: [`${query} in ${location}`],
        maxCrawledPlaces: count,
        language: "de",
        maxReviews: 0 // Wir brauchen keine Reviews
      });

      // Verarbeite die Ergebnisse
      const scrapedData = await leads.getData();
      console.log(`Received ${scrapedData.length} leads from Apify`);

      // Reduziere die Credits
      await storage.addCredits(req.user.id, -count);

      // Speichere die Leads in der Datenbank
      const savedLeads = await Promise.all(scrapedData.map(async (data: any) => {
        return await storage.createLead({
          userId: req.user.id,
          businessName: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email || "",
          website: data.website || "",
          category: query,
          metadata: {
            rating: data.rating,
            totalScore: data.reviewsCount,
            placeId: data.placeId
          }
        });
      }));

      res.json(savedLeads);
    } catch (error) {
      console.error('Error during scraping:', error);
      res.status(500).json({ 
        message: "Failed to scrape data", 
        error: (error as Error).message 
      });
    }
  });
}