import { createMollieClient } from "@mollie/api-client";
import type { Payment } from "@mollie/api-client";

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });

const CREDIT_PACKAGES = {
  "100": { credits: 100, amount: "100.00" },
  "250": { credits: 250, amount: "200.00" },
};

export async function createPayment(userId: number, packageId: "100" | "250") {
  const creditPackage = CREDIT_PACKAGES[packageId];
  if (!creditPackage) throw new Error("Invalid package");

  // Get the base URL from environment or default to localhost for development
  const baseUrl = process.env.REPL_SLUG 
    ? `https://${process.env.REPL_SLUG}.replit.dev`
    : 'http://localhost:5000';

  const payment = await mollieClient.payments.create({
    amount: {
      currency: "EUR",
      value: creditPackage.amount,
    },
    description: `${creditPackage.credits} Credits for LeadScraper`,
    redirectUrl: `${baseUrl}/dashboard?payment=success`,
    webhookUrl: `${baseUrl}/api/payments/webhook`,
    metadata: {
      userId,
      credits: creditPackage.credits,
    },
  });

  return payment;
}

export async function verifyPayment(paymentId: string): Promise<Payment> {
  return await mollieClient.payments.get(paymentId);
}