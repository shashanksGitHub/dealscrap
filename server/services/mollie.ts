// Placeholder for future payment integration
export async function createPayment(userId: number, packageId: string) {
  console.log("Payment creation disabled");
  return { url: "/dashboard" };
}

export async function verifyPayment(paymentId: string) {
  console.log("Payment verification disabled");
  return null;
}