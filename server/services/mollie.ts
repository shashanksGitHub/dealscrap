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
  console.log('Error initializing Mollie client:', error instanceof Error ? error.message : String(error));
  log('Error initializing Mollie client:', error instanceof Error ? error.message : String(error));
}

export async function createPayment(
  userId: number,
  amount: number,
  description: string,
) {
  let creditAmount = 0;
  if (amount === 100) {
    creditAmount = 100;
  } else if (amount === 200) {
    creditAmount = 250;
  } else if (amount === 350) {
    creditAmount = 500;
  } else if (amount === 600) {
    creditAmount = 1000;
  }
  if (!mollieClient) {
    throw new Error('Payment service is not available');
  }

  const user = await storage.getUser(userId);
  if (!user) throw new Error("User not found");

  console.log('Creating Mollie payment for user:', userId, 'amount:', amount);

  // Check if we're in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let redirectUrl, webhookUrl;
  
  if (isDevelopment) {
    // In development, use a dummy webhook URL that Mollie accepts
    redirectUrl = 'https://38ab-103-214-63-108.ngrok-free.app/dashboard';
    webhookUrl = 'https://38ab-103-214-63-108.ngrok-free.app/api/mollie-webhook';
    console.log('Development mode: Using dummy URLs');
  } else {
    // Production logic
    const baseUrl = process.env.BASE_URL || process.env.VITE_BASE_URL;
    
    if (!baseUrl) {
      throw new Error('BASE_URL is not configured');
    }
    
    redirectUrl = `${baseUrl}/dashboard`;
    webhookUrl = `${baseUrl}/api/mollie-webhook`;
  }

  console.log('Using URLs:', { redirectUrl, webhookUrl });

  try {
    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: amount.toFixed(2)
      },
      description: `${creditAmount} Credits auf LeadScraper`,
      redirectUrl,
      webhookUrl,
      metadata: {
        userId: userId.toString(),
        creditAmount: creditAmount.toString()
      },
      billingEmail: user.email
    });

    console.log('Mollie payment created:', {
      id: payment.id,
      status: payment.status,
      checkoutUrl: payment._links?.checkout?.href,
      amount: amount,
      creditAmount: creditAmount
    });

    return payment._links?.checkout?.href;
  } catch (error) {
    console.error('Error creating Mollie payment:', error);
    throw error;
  }
}

// Typdefinitionen für Mollie-Rückgabewerte
interface MolliePaymentMetadata {
  userId: string;
  creditAmount: string;
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
      // Sichere Typumwandlung für payment.metadata
      const metadata = payment.metadata as unknown as MolliePaymentMetadata;
      
      if (!metadata || !metadata.userId || !metadata.creditAmount) {
        console.error('Invalid payment metadata:', metadata);
        throw new Error('Invalid payment metadata');
      }
      
      const userId = parseInt(metadata.userId);
      const creditAmount = parseInt(metadata.creditAmount);

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