import { createMollieClient } from "@mollie/api-client";
import { storage } from "../storage";

if (!process.env.MOLLIE_API_KEY) {
  throw new Error('Missing required Mollie secret: MOLLIE_API_KEY');
}

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

export async function createPayment(
  userId: number,
  amount: number,
  description: string
) {
  const user = await storage.getUser(userId);
  if (!user) throw new Error("User not found");

  console.log('Creating Mollie payment for user:', userId, 'amount:', amount);

  const payment = await mollieClient.payments.create({
    amount: {
      currency: "EUR",
      value: amount.toFixed(2) // Mollie erwartet einen String mit 2 Dezimalstellen
    },
    description,
    redirectUrl: `${process.env.REPLIT_DOMAINS?.replace('0.0.0.0', 'replit.dev')}/dashboard`,
    webhookUrl: `${process.env.REPLIT_DOMAINS?.replace('0.0.0.0', 'replit.dev')}/api/mollie-webhook`,
    metadata: {
      userId: userId.toString(),
      creditAmount: amount.toString()
    }
  });

  console.log('Mollie payment created:', {
    id: payment.id,
    status: payment.status,
    checkoutUrl: payment.getCheckoutUrl()
  });

  return payment;
}

export async function handleWebhookEvent(paymentId: string): Promise<void> {
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