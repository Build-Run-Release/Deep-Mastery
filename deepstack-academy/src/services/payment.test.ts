import { test, describe } from 'node:test';
import assert from 'node:assert';
import { initializePayment, verifyPayment } from './payment.ts';
import type { PaymentRequest } from './payment.ts';

describe('Payment Service', () => {
  const mockRequest: PaymentRequest = {
    email: 'test@example.com',
    amount: 50000,
    userId: 'user-123',
    planId: 'premium-plan'
  };

  test('initializePayment should return a successful response with correct structure', async () => {
    const response = await initializePayment(mockRequest);

    assert.strictEqual(response.status, true);
    assert.ok(response.reference.startsWith('mock-ref-'));
    assert.ok(response.authorizationUrl.includes(response.reference));
    assert.ok(response.authorizationUrl.startsWith('https://checkout.paystack.com/'));
  });

  test('initializePayment should generate unique references', async () => {
    const response1 = await initializePayment(mockRequest);
    const response2 = await initializePayment(mockRequest);

    assert.notStrictEqual(response1.reference, response2.reference);
  });

  test('verifyPayment should return true for any reference', async () => {
    const reference = 'mock-ref-123456789';
    const result = await verifyPayment(reference);

    assert.strictEqual(result, true);
  });
});
