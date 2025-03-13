import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

const CREDIT_PACKAGES = {
  "100": { credits: 100, amount: 10000 }, // 100 EUR in cents
  "250": { credits: 250, amount: 20000 }, // 200 EUR in cents
  "500": { credits: 500, amount: 35000 }, // 350 EUR in cents
  "1000": { credits: 1000, amount: 60000 }, // 600 EUR in cents
};

export async function createPayment(userId: number, packageId: "100" | "250" | "500" | "1000") {
  const creditPackage = CREDIT_PACKAGES[packageId];
  if (!creditPackage) throw new Error("Invalid package");

  // Get the base URL from environment or default to localhost for development
  const baseUrl = process.env.REPL_SLUG 
    ? `https://${process.env.REPL_SLUG}.replit.dev`
    : 'http://localhost:5000';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${creditPackage.credits} Credits`,
            description: `${creditPackage.credits} Credits for LeadScraper`,
          },
          unit_amount: creditPackage.amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${baseUrl}/dashboard?payment=success`,
    cancel_url: `${baseUrl}/dashboard?payment=cancelled`,
    metadata: {
      userId,
      credits: creditPackage.credits,
    },
  });

  return session;
}

export async function handleWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        userId: Number(session.metadata?.userId),
        credits: Number(session.metadata?.credits),
      };
    }
    default:
      throw new Error(`Unhandled event type: ${event.type}`);
  }
}