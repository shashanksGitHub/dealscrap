import { Router } from "express";
import { insertLeadSchema, insertBlogPostSchema } from "../shared/schema";
import { storage } from "./storage";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Credit package mapping
const CREDIT_PACKAGES = {
  100: { credits: 100, price: 100 },
  200: { credits: 250, price: 200 },
  350: { credits: 500, price: 350 },
  600: { credits: 1000, price: 600 }
};

export async function registerRoutes(router: Router) {
  // Stripe payment routes
  router.post("/create-payment-intent", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Nicht authentifiziert" });
      }

      const { amount } = req.body;

      if (!CREDIT_PACKAGES[amount]) {
        return res.status(400).json({ message: "Ungültiger Betrag" });
      }

      // Get or create Stripe customer
      let user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Benutzer nicht gefunden" });
      }

      let customerId = user.stripeCustomerId;

      try {
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
              userId: user.id.toString()
            }
          });
          user = await storage.setStripeCustomerId(user.id, customer.id);
          customerId = customer.id;
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Convert to cents
          currency: "eur",
          customer: customerId,
          setup_future_usage: 'off_session', // Enable saving payment method
          metadata: {
            userId: user.id.toString(),
            credits: CREDIT_PACKAGES[amount].credits.toString()
          },
          payment_method_types: ['card', 'sepa_debit', 'sofort', 'giropay', 'ideal', 'bancontact'],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (stripeError: any) {
        console.error('Stripe API error:', stripeError);
        res.status(400).json({ 
          message: "Fehler bei der Stripe-Verarbeitung",
          details: stripeError.message 
        });
      }
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ 
        message: "Fehler bei der Zahlungsinitialisierung",
        details: error.message 
      });
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

  // Stripe webhook for handling successful payments
  router.post("/stripe-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    try {
      const event = stripe.webhooks.constructEvent(
        (req as any).rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const credits = parseInt(paymentIntent.metadata.credits);
        const userId = parseInt(paymentIntent.metadata.userId);
        await storage.addCredits(userId, credits);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook Error:', error.message);
      return res.status(400).json({ error: `Webhook Error: ${error.message}` });
    }
  });

  // Credit management
  router.post("/credits/add", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Nicht authentifiziert" });
    const amount = parseInt(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid credit amount" });
    }

    const user = await storage.addCredits(req.user.id, amount);
    res.json(user);
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