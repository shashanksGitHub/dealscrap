import { Router } from "express";
import { insertLeadSchema, insertBlogPostSchema } from "../shared/schema";
import { storage } from "./storage";
import { createPayment, handleWebhookEvent } from "./services/mollie";
import { apifyClient } from "./services/apify";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { searches, leads } from "@shared/schema";

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
  
  // Neuer Endpunkt für Mollie-Zahlungen
  router.post("/payments/create", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    try {
      console.log('Processing Mollie payment request:', {
        userId: req.user.id,
        amount: req.body.amount,
        method: req.body.method
      });

      const amount = parseFloat(req.body.amount);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Gültiger Betrag ist erforderlich" });
      }

      const description = req.body.description || `${amount} Guthaben auf LeadScraper`;

      const checkoutUrl = await createPayment(
        req.user.id,
        amount,
        description
      );

      if (!checkoutUrl) {
        throw new Error('Keine Checkout-URL von Mollie erhalten');
      }

      console.log('Mollie payment created, redirecting to:', checkoutUrl);

      res.json({
        success: true,
        checkoutUrl
      });
    } catch (error: any) {
      console.error('Error creating Mollie payment:', error);
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

  router.get("/searches", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Nicht authentifiziert" });

    try {
      console.log('Fetching searches for user:', req.user.id);
      const userSearches = await db.select().from(searches)
        .where(eq(searches.userId, req.user.id))
        .orderBy(desc(searches.createdAt));
      console.log('Found searches:', userSearches);
      res.json(userSearches);
    } catch (error) {
      console.error('Error fetching searches:', error);
      res.status(500).json({ message: "Fehler beim Abrufen der Suchen" });
    }
  });

  router.get("/searches/:id/leads", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Nicht authentifiziert" });

    try {
      const searchLeads = await db.select().from(leads)
        .where(and(
          eq(leads.userId, req.user.id),
          eq(leads.searchId, parseInt(req.params.id))
        ));
      res.json(searchLeads);
    } catch (error) {
      console.error('Error fetching leads for search:', error);
      res.status(500).json({ message: "Fehler beim Abrufen der Leads" });
    }
  });

  router.patch("/searches/:id/mark-read", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Nicht authentifiziert" });

    try {
      const [search] = await db
        .update(searches)
        .set({ isRead: true })
        .where(and(
          eq(searches.id, parseInt(req.params.id)),
          eq(searches.userId, req.user.id)
        ))
        .returning();

      if (!search) {
        return res.status(404).json({ message: "Suche nicht gefunden" });
      }

      res.json(search);
    } catch (error) {
      console.error('Error marking search as read:', error);
      res.status(500).json({ message: "Fehler beim Markieren der Suche als gelesen" });
    }
  });

  router.post("/scrape", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Nicht authentifiziert" });
    const { query, location, count } = req.body;

    if (!query || !location || !count) {
      return res.status(400).json({ message: "Query, location, and count are required" });
    }

    if (count < 1 || count > 100) {
      return res.status(400).json({ message: "Lead count must be between 1 and 100" });
    }

    const user = await storage.getUser(req.user.id);
    if (!user || user.credits < count) {
      return res.status(403).json({ message: "Insufficient credits" });
    }

    try {
      console.log('Creating new search record');
      const [search] = await db.insert(searches)
        .values({
          userId: req.user.id,
          query,
          location,
          count
        })
        .returning();
      console.log('Created search:', search);

      console.log(`Starting scrape for ${count} leads with query: ${query}, location: ${location}`);

      const run = await apifyClient.actor("nwua9Gu5YrADL7ZDj").call({
        searchStringsArray: [query],
        locationQuery: `${location}, Deutschland`,
        language: "de",
        maxCrawledPlacesPerSearch: count,
        includeWebResults: false,
        maxQuestions: 0,
        onlyDataFromSearchPage: false,
        scrapeDirectories: false,
        scrapeImageAuthors: false,
        scrapeReviewsPersonalData: true,
        scrapeTableReservationProvider: false,
        skipClosedPlaces: false
      });

      const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
      console.log(`Received ${items.length} leads from Apify`);

      await storage.addCredits(req.user.id, -count);

      console.log('Raw Apify data:', JSON.stringify(items, null, 2));

      const savedLeads = await Promise.all(items.map(async (data: any) => {
        try {
          const leadData = {
            userId: req.user.id,
            searchId: search.id,
            businessName: data.title || data.name || "",
            address: data.address || "",
            phone: data.phone || data.phoneNumber || "",
            email: data.email || "",
            website: data.website || "",
            category: query,
            metadata: {
              rating: data.rating,
              totalScore: data.reviewsCount,
              placeId: data.placeId
            }
          };
          console.log('Trying to save lead with data:', leadData);
          const lead = await storage.createLead(leadData);
          console.log('Successfully saved lead:', lead);
          return lead;
        } catch (error) {
          console.error('Error saving lead:', error);
          throw error;
        }
      }));

      console.log(`Successfully saved ${savedLeads.length} leads to database`);
      res.json({ search, leads: savedLeads });
    } catch (error: any) {
      console.error('Error during scraping:', error);
      res.status(500).json({ 
        message: "Failed to scrape data", 
        error: error.message 
      });
    }
  });
}