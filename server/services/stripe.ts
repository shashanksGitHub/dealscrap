// Placeholder for future Stripe integration
export async function createPayment(userId: number, packageId: string) {
  console.log("Payment creation disabled");
  return { url: "/dashboard" };
}

export async function handleWebhook(event: any) {
  console.log("Webhook handling disabled");
  return null;
}