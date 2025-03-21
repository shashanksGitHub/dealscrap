import { createMollieClient } from "@mollie/api-client";
import { storage } from "../storage";
import { log } from "../vite";

let mollieClient: ReturnType<typeof createMollieClient> | null = null;

try {
  if (!process.env.MOLLIE_API_KEY) {
    log('Warning: MOLLIE_API_KEY not found');
  } else {
    mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
    log('Mollie client initialized successfully');
  }
} catch (error) {
  log('Error initializing Mollie client:', error);
}

export async function createPayment(
  userId: number,
  amount: number,
  description: string
) {
  if (!mollieClient) {
    throw new Error('Payment service is not available');
  }

  const user = await storage.getUser(userId);
  if (!user) throw new Error("User not found");

  console.log('Creating Mollie payment for user:', userId, 'amount:', amount);

  // Get the domain from REPLIT_DOMAINS or custom domain, fallback to a default if not available
  const domain = process.env.CUSTOM_DOMAIN || process.env.REPLIT_DOMAINS?.split(',')[0] || '';

  // Ensure we have a valid domain
  if (!domain) {
    throw new Error('No valid domain found for redirect URL');
  }

  // Create proper URLs using the domain
  const baseUrl = `https://${domain}`;
  const redirectUrl = `${baseUrl}/dashboard`;
  const webhookUrl = `${baseUrl}/api/mollie-webhook`;

  console.log('Using URLs:', { redirectUrl, webhookUrl });

  try {
    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: amount.toFixed(2) // Mollie erwartet einen String mit 2 Dezimalstellen
      },
      description,
      redirectUrl,
      webhookUrl,
      metadata: {
        userId: userId.toString(),
        creditAmount: amount.toString()
      },
      billingEmail: user.email
    });

    console.log('Mollie payment created:', {
      id: payment.id,
      status: payment.status,
      checkoutUrl: payment._links?.checkout?.href
    });

    return payment._links?.checkout?.href;
  } catch (error) {
    console.error('Error creating Mollie payment:', error);
    throw error;
  }
}

export async function handleWebhookEvent(paymentId: string): Promise<void> {
  if (!mollieClient) {
    throw new Error('Payment service is not available');
  }

  try {
    console.log('Processing Mollie webhook for payment:', paymentId);
    const payment = await mollieClient.payments.get(paymentId);
    console.log('Payment status:', payment.status);

    if (payment.status === "paid") {
      const userId = parseInt(payment.metadata.userId);
      const creditAmount = parseInt(payment.metadata.creditAmount);

      console.log('Adding credits for payment:', {
        userId,
        creditAmount,
        paymentId: payment.id
      });

      await storage.addCredits(userId, creditAmount);
    }
  } catch (err: any) {
    console.error('Error processing Mollie webhook:', err.message);
    throw err;
  }
}