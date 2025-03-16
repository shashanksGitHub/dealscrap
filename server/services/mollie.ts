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

  return payment;
}

export async function handleWebhookEvent(paymentId: string): Promise<void> {
  try {
    const payment = await mollieClient.payments.get(paymentId);

    if (payment.status === "paid") {
      const userId = parseInt(payment.metadata.userId);
      const creditAmount = parseInt(payment.metadata.creditAmount);

      await storage.addCredits(userId, creditAmount);
    }
  } catch (err: any) {
    console.error('Error processing Mollie webhook:', err.message);
    throw err;
  }
}