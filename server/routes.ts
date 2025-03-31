import { Router } from "express";
import { insertLeadSchema, insertBlogPostSchema } from "../shared/schema";
import { storage } from "./storage";
import { createPayment, handleWebhookEvent } from "./services/mollie";
import { apifyClient } from "./services/apify";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { searches, leads } from "@shared/schema";
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
      console.log(`Sending user info - ID: ${user.id}, Credits: ${user.credits}`);
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

  // Lead generation endpoint
  router.post("/scrape", async (req, res) => {
    console.log('=== SCRAPE REQUEST ===');
    console.log('Request body:', req.body);

    if (!req.isAuthenticated()) {
      console.error('Authentication check failed');
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Nicht authentifiziert'
      });
    }

    const { searchTerm, location, maxResults = 100 } = req.body;

    if (!searchTerm?.trim() || !location?.trim()) {
      console.error('Missing required parameters:', { searchTerm, location });
      return res.status(400).json({ 
        error: 'Missing parameters',
        message: 'Suchbegriff und Standort sind erforderlich'
      });
    }

    const count = Math.min(Math.max(1, maxResults), 100);
    const user = await storage.getUser(req.user.id);
    
    if (!user) {
      console.error('User not found:', req.user.id);
      return res.status(404).json({ 
        error: 'User not found',
        message: 'Benutzer nicht gefunden'
      });
    }

    if (user.credits < count) {
      console.error('Insufficient credits:', { required: count, available: user.credits });
      return res.status(403).json({ 
        error: 'Insufficient credits',
        message: `Sie benötigen ${count} Credits für diese Suche. Sie haben ${user.credits} Credits.`
      });
    }

    try {
      console.log('Starting scraping with Apify...', { searchTerm, location, count });
      
      // Create search record
      const [search] = await db.insert(searches)
        .values({
          userId: req.user.id,
          query: searchTerm,
          location: location,
          count: count,
          isRead: false
        })
        .returning();

      // Set up streaming response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Transfer-Encoding', 'chunked');

      // Initial progress
      res.write(JSON.stringify({ 
        type: 'progress',
        current: 0,
        total: count,
        leads: []
      }));

      const run = await apifyClient.actor("apify/google-places-scraper").call({
        searchStrings: [`${searchTerm} ${location}`],
        maxCrawledPlaces: count,
        language: "de",
        maxImages: 0,
        maxReviews: 0,
        includeHistogram: false,
        includeOpeningHours: true,
        includePeopleAlsoSearch: false
      });

      console.log('Getting dataset...');
      const dataset = await apifyClient.dataset(run.defaultDatasetId);
      const { items } = await dataset.listItems();

      if (!items || items.length === 0) {
        console.error('No leads found');
        return res.status(404).json({
          error: 'No leads found',
          message: 'Keine passenden Leads gefunden'
        });
      }

      const foundLeads = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Create the lead in database
        const [lead] = await db.insert(leads)
          .values({
            userId: req.user.id,
            searchId: search.id,
            businessName: item.title,
            address: item.address,
            website: item.website || null,
            phone: item.phone || null,
            email: null,
            category: item.category || searchTerm,
            source: 'google',
            rawData: item
          })
          .returning();

        foundLeads.push(lead);

        // Send progress update
        res.write(JSON.stringify({
          type: 'progress',
          current: i + 1,
          total: items.length,
          leads: [lead]
        }));
      }

      // Deduct credits
      await db.update(users)
        .set({ credits: user.credits - count })
        .where(eq(users.id, req.user.id));

      // Clear user caches
      await cacheService.clearUserCaches(req.user.id);

      console.log('Scraping successful:', { 
        searchId: search.id, 
        leadsFound: foundLeads.length 
      });
      
      // Final response
      res.write(JSON.stringify({
        type: 'complete',
        leads: foundLeads
      }));
      res.end();

    } catch (error) {
      console.error('Scraping error:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Scraping failed',
          message: 'Es ist ein Fehler bei der Lead-Generierung aufgetreten'
        });
      } else {
        res.write(JSON.stringify({
          type: 'error',
          message: 'Es ist ein Fehler bei der Lead-Generierung aufgetreten'
        }));
        res.end();
      }
    }
  });
}