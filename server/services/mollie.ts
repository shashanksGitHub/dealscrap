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
  log('Error initializing Mollie client:', error instanceof Error ? error.message : String(error));
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

  // Prüfe zuerst auf die Verwendung der BASE_URL Umgebungsvariable (für die gesamte Produktion)
  const baseUrl = process.env.BASE_URL || process.env.VITE_BASE_URL;
  
  // Falls keine BASE_URL gesetzt ist, verwende domain-basierte Konstruktion als Fallback
  let redirectUrl, webhookUrl;
  
  if (baseUrl) {
    // Verwende vorkonfigurierte BASE_URL
    redirectUrl = `${baseUrl}/dashboard`;
    webhookUrl = `${baseUrl}/api/mollie-webhook`;
  } else {
    // Fallback zur domain-basierten Konstruktion
    const domain = process.env.CUSTOM_DOMAIN || process.env.REPLIT_DOMAINS?.split(',')[0] || '';
    
    // Stelle sicher, dass eine gültige Domain existiert
    if (!domain) {
      throw new Error('Keine gültige Domain für Redirect-URL gefunden');
    }
    
    // Erstelle URLs mit der Domain
    const domainBaseUrl = `https://${domain}`;
    redirectUrl = `${domainBaseUrl}/dashboard`;
    webhookUrl = `${domainBaseUrl}/api/mollie-webhook`;
  }

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