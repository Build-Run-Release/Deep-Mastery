export interface PaymentRequest {
  email: string;
  amount: number; // in kobo (Naira * 100)
  userId: string;
  planId: string;
}

export interface PaymentResponse {
  status: boolean;
  authorizationUrl: string;
  reference: string;
}

export async function initializePayment(request: PaymentRequest): Promise<PaymentResponse> {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
     throw new Error("PAYSTACK_SECRET_KEY is not defined");
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: request.email,
      amount: request.amount,
      metadata: {
         userId: request.userId,
         planId: request.planId
      }
    }),
  });

  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message || "Failed to initialize payment");
  }

  return {
    status: data.status,
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
  };
}

export async function verifyPayment(reference: string): Promise<boolean> {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
     throw new Error("PAYSTACK_SECRET_KEY is not defined");
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  const data = await response.json();

  if (data.status && data.data && data.data.status === "success") {
      return true;
  }

  return false;
}
