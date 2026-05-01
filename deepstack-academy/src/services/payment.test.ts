import { test, describe, mock, afterEach } from 'node:test';
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

  afterEach(() => {
    mock.restoreAll();
  });

  test('initializePayment should return a successful response with correct structure', async () => {
    process.env.PAYSTACK_SECRET_KEY = "test";

    mock.method(global, 'fetch', () => {
      return Promise.resolve({
        json: () => Promise.resolve({
          status: true,
          data: {
            authorization_url: 'https://checkout.paystack.com/mock-ref-123',
            reference: 'mock-ref-123'
          }
        })
      });
    });

    const response = await initializePayment(mockRequest);

    assert.strictEqual(response.status, true);
    assert.ok(response.reference.startsWith('mock-ref-'));
    assert.ok(response.authorizationUrl.includes(response.reference));
    assert.ok(response.authorizationUrl.startsWith('https://checkout.paystack.com/'));
  });

  test('initializePayment should generate unique references', async () => {
    process.env.PAYSTACK_SECRET_KEY = "test";

    mock.method(global, 'fetch', () => {
      return Promise.resolve({
        json: () => Promise.resolve({
          status: true,
          data: {
            authorization_url: `https://checkout.paystack.com/mock-ref-${Math.random()}`,
            reference: `mock-ref-${Math.random()}`
          }
        })
      });
    });

    const response1 = await initializePayment(mockRequest);
    const response2 = await initializePayment(mockRequest);

    assert.notStrictEqual(response1.reference, response2.reference);
  });

  test('verifyPayment should return true for any reference', async () => {
    process.env.PAYSTACK_SECRET_KEY = "test";

    mock.method(global, 'fetch', () => {
      return Promise.resolve({
        json: () => Promise.resolve({
          status: true,
          data: {
            status: "success"
          }
        })
      });
    });

    const reference = 'mock-ref-123456789';
    const result = await verifyPayment(reference);

    assert.strictEqual(result, true);
  });
});
