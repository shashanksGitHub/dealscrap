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
  router.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Nicht authentifiziert" });
      }

      const { amount } = req.body;
      if (!CREDIT_PACKAGES[amount]) {
        return res.status(400).json({ message: "Ungültiger Betrag" });
      }

      // Create or get Stripe customer
      let user = await storage.getUser(req.user.id);
      let customerId = user.stripeCustomerId;

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
        metadata: {
          userId: user.id.toString(),
          credits: CREDIT_PACKAGES[amount].credits.toString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ message: error.message || "Interner Serverfehler" });
    }
  });

  // Stripe webhook for handling successful payments
  router.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const userId = parseInt(paymentIntent.metadata.userId);
        const credits = parseInt(paymentIntent.metadata.credits);

        await storage.addCredits(userId, credits);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook Error:', error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  // Credit management
  router.post("/credits/add", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const amount = parseInt(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid credit amount" });
    }

    const user = await storage.addCredits(req.user.id, amount);
    res.json(user);
  });

  // Lead management
  router.get("/leads", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
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

  // Protected route for authenticated users
  router.post("/blog-posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

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

  // Webhook route for Zapier integration with Form data support
  router.post("/webhook/blog-posts", validateApiKey, async (req, res) => {
    console.log('Received webhook request for blog post creation');
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));

    try {
      const data = req.body;
      console.log('Processing data:', data);

      const validatedData = insertBlogPostSchema.parse({
        title: data.title,
        content: data.content,
        authorId: parseInt(process.env.DEFAULT_AUTHOR_ID || "1")
      });

      console.log('Data validation successful:', validatedData);

      const post = await storage.createBlogPost(validatedData);

      console.log('Blog post created successfully:', post.id);
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(400).json({ message: "Invalid blog post data", error: (error as Error).message });
    }
  });

  router.post("/scrape", async (req, res) => {
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