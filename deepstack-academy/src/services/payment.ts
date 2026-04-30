// Mock Paystack integration for Phase 1 (Nigerian Market)

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

/**
 * Mocks initializing a transaction with Paystack.
 */
export async function initializePayment(request: PaymentRequest): Promise<PaymentResponse> {
  console.log(`[Mock Paystack] Initializing payment for ${request.email} (${request.amount} kobo)`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockReference = `mock-ref-${Date.now()}`;

  return {
    status: true,
    authorizationUrl: `https://checkout.paystack.com/${mockReference}`,
    reference: mockReference,
  };
}

/**
 * Mocks verifying a transaction with Paystack.
 */
export async function verifyPayment(reference: string): Promise<boolean> {
  console.log(`[Mock Paystack] Verifying payment reference: ${reference}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app, this would check with the Paystack API
  // For the mock, we assume the payment was successful
  return true;
}
