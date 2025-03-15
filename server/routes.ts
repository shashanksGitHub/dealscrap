import { Router } from "express";
import { insertLeadSchema, insertBlogPostSchema } from "../shared/schema";
import { storage } from "./storage";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

// Credit package mapping
const CREDIT_PACKAGES = {
  100: { credits: 100, price: 100 },
  200: { credits: 250, price: 200 },
  350: { credits: 500, price: 350 },
  600: { credits: 1000, price: 600 }
};

export async function registerRoutes(router: Router) {
  // Payment intent creation
  router.post("/create-payment-intent", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Nicht authentifiziert" });
      }

      const { amount } = req.body;
      console.log('Creating payment intent for amount:', amount);
      console.log('User ID:', req.user.id);

      if (!CREDIT_PACKAGES[amount]) {
        return res.status(400).json({ message: "Ungültiger Betrag" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userId: req.user.id.toString(),
          credits: CREDIT_PACKAGES[amount].credits.toString()
        },
      });

      console.log('Payment intent created:', paymentIntent.id);
      console.log('Payment intent metadata:', paymentIntent.metadata);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ 
        message: "Fehler bei der Zahlungsinitialisierung",
        details: error.message 
      });
    }
  });

  // Stripe webhook handler
  router.post("/stripe-webhook", async (req, res) => {
    let event;
    try {
      const signature = req.headers['stripe-signature'];

      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('Missing Stripe webhook secret');
      }

      try {
        event = stripe.webhooks.constructEvent(
          (req as any).rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }

      console.log('Webhook event received:', event.type);

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log('💰 Payment succeeded:', paymentIntent.id);
        console.log('Payment metadata:', paymentIntent.metadata);

        try {
          // Ensure credits and userId are numbers
          const credits = parseInt(paymentIntent.metadata.credits);
          const userId = parseInt(paymentIntent.metadata.userId);

          if (isNaN(credits) || isNaN(userId)) {
            throw new Error(`Invalid metadata - credits: ${credits}, userId: ${userId}`);
          }

          console.log(`Processing payment for user ${userId}`);
          console.log(`Adding ${credits} credits from payment ${paymentIntent.id}`);

          // Get current user and verify existence
          const user = await storage.getUser(userId);
          if (!user) {
            throw new Error(`User ${userId} not found`);
          }

          console.log(`Current credits for user ${userId}: ${user.credits}`);

          // Add credits
          const updatedUser = await storage.addCredits(userId, credits);
          console.log(`Successfully updated credits for user ${userId}. New balance: ${updatedUser.credits}`);

          // Immediately verify the update
          const verifiedUser = await storage.getUser(userId);
          if (!verifiedUser || verifiedUser.credits !== updatedUser.credits) {
            throw new Error('Credit update verification failed');
          }

          // Send success response with updated information
          return res.json({ 
            received: true,
            userId: userId,
            credits: updatedUser.credits,
            message: 'Credits added successfully'
          });
        } catch (error: any) {
          console.error('Failed to add credits:', error);
          return res.status(500).json({
            received: true,
            error: true,
            message: `Failed to process credits: ${error.message}`
          });
        }
      }

      return res.json({ received: true });
    } catch (err: any) {
      console.error('❌ Webhook Error:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
  });

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

  // Get saved payment methods
  router.get("/payment-methods", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Nicht authentifiziert" });
      }

      const user = await storage.getUser(req.user.id);
      if (!user?.stripeCustomerId) {
        return res.json({ paymentMethods: [] });
      }

      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card',
      });

      res.json({ paymentMethods: paymentMethods.data });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Fehler beim Abrufen der Zahlungsmethoden",
        details: error.message 
      });
    }
  });

  // Update customer billing details
  router.post("/update-billing-details", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Nicht authentifiziert" });
      }

      const { company, vatId } = req.body;

      const user = await storage.getUser(req.user.id);
      if (!user?.stripeCustomerId) {
        return res.status(400).json({ message: "Kein Stripe-Kunde gefunden" });
      }

      await stripe.customers.update(user.stripeCustomerId, {
        metadata: {
          company,
          vatId
        }
      });

      res.json({ status: "success" });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Fehler beim Aktualisieren der Rechnungsdaten",
        details: error.message 
      });
    }
  });

  // Pay with saved payment method
  router.post("/pay-with-saved-method", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Nicht authentifiziert" });
      }

      const { amount, paymentMethodId } = req.body;

      if (!CREDIT_PACKAGES[amount]) {
        return res.status(400).json({ message: "Ungültiger Betrag" });
      }

      const user = await storage.getUser(req.user.id);
      if (!user?.stripeCustomerId) {
        return res.status(400).json({ message: "Kein Stripe-Kunde gefunden" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "eur",
        customer: user.stripeCustomerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        metadata: {
          userId: user.id.toString(),
          credits: CREDIT_PACKAGES[amount].credits.toString()
        }
      });

      res.json({ status: "success", paymentIntent });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Fehler bei der Zahlung",
        details: error.message 
      });
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

function validateApiKey(req: any, res: any, next: any) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.BLOG_API_KEY) {
    console.log('Invalid API key provided:', apiKey);
    return res.status(401).json({ message: "Invalid API key" });
  }
  console.log('API key validation successful');
  next();
}