import Stripe from "stripe";
import { storage } from "../storage";

let stripe: Stripe | null = null;

// Initialize Stripe only if secret key is available
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });
    console.log("Stripe initialized successfully");
  } else {
    console.warn("Stripe secret key missing - payment features will be disabled");
  }
} catch (error) {
  console.error("Failed to initialize Stripe:", error);
}

export async function createOrUpdateCustomer(userId: number, businessInfo: {
  companyName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  vatId?: string;
}) {
  if (!stripe) {
    throw new Error("Stripe is not initialized");
  }

  const user = await storage.getUser(userId);
  if (!user) throw new Error("User not found");

  const customerData = {
    name: businessInfo.companyName,
    email: user.email,
    address: {
      line1: businessInfo.street,
      city: businessInfo.city,
      postal_code: businessInfo.postalCode,
      country: businessInfo.country,
    },
    tax_id_data: businessInfo.vatId ? [{
      type: 'eu_vat',
      value: businessInfo.vatId,
    }] : undefined,
    metadata: {
      userId: userId.toString(),
    },
  };

  if (user.stripeCustomerId) {
    const customer = await stripe.customers.update(
      user.stripeCustomerId,
      customerData
    );
    return customer;
  }

  const customer = await stripe.customers.create(customerData);
  await storage.updateStripeCustomerId(userId, customer.id);
  return customer;
}

export async function createPaymentIntent(
  userId: number,
  amount: number,
  customerId: string
) {
  if (!stripe) {
    throw new Error("Stripe is not initialized");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'eur',
    customer: customerId,
    metadata: {
      userId: userId.toString(),
      creditAmount: amount.toString(),
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

export async function handleWebhookEvent(
  signature: string,
  rawBody: Buffer
): Promise<void> {
  if (!stripe) {
    throw new Error("Stripe is not initialized");
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing Stripe webhook secret');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const userId = parseInt(paymentIntent.metadata.userId);
      const creditAmount = parseInt(paymentIntent.metadata.creditAmount);

      await storage.addCredits(userId, creditAmount);
    }
  } catch (err: any) {
    console.error('Error processing webhook:', err.message);
    throw err;
  }
}

export function isStripeInitialized(): boolean {
  return stripe !== null;
}