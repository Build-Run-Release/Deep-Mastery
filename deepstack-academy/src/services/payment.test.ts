import { test, describe, before } from 'node:test';
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

  before(() => {
    process.env.PAYSTACK_SECRET_KEY = 'mock_secret_key';

    // Mock global fetch for testing
    global.fetch = async (url: string | URL | globalThis.Request) => {
        if (url.toString().includes('initialize')) {
            return {
                json: async () => ({
                    status: true,
                    data: {
                        authorization_url: 'https://checkout.paystack.com/mock-url',
                        reference: 'mock-ref-' + Math.random().toString(36).substring(7)
                    }
                })
            } as unknown as Response;
        }
        if (url.toString().includes('verify')) {
             return {
                json: async () => ({
                    status: true,
                    data: {
                        status: 'success'
                    }
                })
            } as unknown as Response;
        }
        throw new Error('Unknown URL mocked');
    };
  });

  test('initializePayment should return a successful response with correct structure', async () => {
    const response = await initializePayment(mockRequest);

    assert.strictEqual(response.status, true);
    assert.ok(response.reference.startsWith('mock-ref-'));
    assert.ok(response.authorizationUrl.includes('mock-url'));
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
