import { Router } from "express";
import { insertLeadSchema, insertBlogPostSchema } from "../shared/schema";
import { storage } from "./storage";
import { createPayment, handleWebhookEvent } from "./services/mollie";
import { apifyClient } from "./services/apify";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { searches, leads, users } from "@shared/schema";
import { cacheService } from "./services/cache";

export async function registerRoutes(router: Router) {
  // Get user info with additional verification and caching
  router.get("/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    try {
      // Try to get from cache first
      const cachedUser = await cacheService.getUser(req.user.id);
      if (cachedUser) {
        return res.json(cachedUser);
      }

      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Benutzer nicht gefunden" });
      }

      // Cache the user data
      await cacheService.setUser(req.user.id, user);
      res.json(user);
    } catch (error: any) {
      console.error('Error fetching user info:', error);
      res.status(500).json({ message: "Fehler beim Abrufen der Benutzerinformationen" });
    }
  });


  // Business information and payment routes
  router.post("/payments/create", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }
    try {
      const amount = parseFloat(req.body.amount);
      const creditAmount = parseInt(req.body.creditAmount);

      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Gültiger Betrag ist erforderlich" });
      }

      const description = req.body.description || `${creditAmount} Credits auf LeadScraper`;

      const checkoutUrl = await createPayment(
        req.user.id,
        amount,
        description,
      );

      if (!checkoutUrl) {
        throw new Error('Keine Checkout-URL von Mollie erhalten');
      }

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

    const amount = parseInt(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid credit amount:', amount);
      return res.status(400).json({ message: "Invalid credit amount" });
    }

    try {
      const user = await storage.addCredits(req.user.id, amount);
      res.json(user);
    } catch (error) {
      console.error('Error adding credits:', error);
      res.status(500).json({ message: "Failed to add credits" });
    }
  });

  // Lead management with caching
  router.get("/leads", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    try {
      // Try to get from cache first
      const cachedLeads = await cacheService.getLeads(req.user.id);
      if (cachedLeads) {
        return res.json(cachedLeads);
      }

      const leads = await storage.getLeadsByUserId(req.user.id);
      // Cache the leads
      await cacheService.setLeads(req.user.id, leads);
      res.json(leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
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
      const userSearches = await db.select().from(searches)
        .where(eq(searches.userId, req.user.id))
        .orderBy(desc(searches.createdAt));
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

  // Lead generation endpoint
  router.post("/scrape", async (req, res) => {

    if (!req.user) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }
    
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
      const startTime = Date.now();
      
      const [search] = await db.insert(searches)
        .values({
          userId: req.user.id,
          query,
          location,
          count
        })
        .returning();
        
      const apifyStartTime = Date.now();
      
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
      // We've already checked that req.user exists above, but TypeScript needs reassurance
      if (!req.user) {
        throw new Error('User authentication lost during scraping');
      }
      
      await storage.addCredits(req.user.id, -count);
  
      // We already checked req.user above, but need to do it again for TypeScript
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User authentication lost during lead processing');
      }
      
      
      const savedLeads = await Promise.all(items.map(async (data: any, index: number) => {
        try {
          const leadData = {
            userId,
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
          
          const lead = await storage.createLead(leadData);
          return lead;
        } catch (error) {
          console.error(`Error saving lead ${index + 1}:`, error);
          throw error;
        }
      }));
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