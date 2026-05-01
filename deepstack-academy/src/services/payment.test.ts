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

  afterEach(() => {
    // Restore env and mocks
    process.env = originalEnv;
    mock.restoreAll();
  });

  describe('initializePayment', () => {
    test('should return a successful response with correct structure', async () => {
      let fetchCallCount = 0;
      mock.method(global, 'fetch', async (url: string, options: any) => {
        fetchCallCount++;
        assert.strictEqual(url, 'https://api.paystack.co/transaction/initialize');
        assert.strictEqual(options.headers.Authorization, 'Bearer test_secret_key');
        return {
          json: async () => ({
            status: true,
            message: 'Authorization URL created',
            data: {
              authorization_url: 'https://checkout.paystack.com/mock-ref-123',
              access_code: 'mock-access-code',
              reference: 'mock-ref-123',
            }
          })
        };
      });

      const response = await initializePayment(mockRequest);

      assert.strictEqual(fetchCallCount, 1);
      assert.strictEqual(response.status, true);
      assert.strictEqual(response.reference, 'mock-ref-123');
      assert.strictEqual(response.authorizationUrl, 'https://checkout.paystack.com/mock-ref-123');
    });

    test('should generate unique references', async () => {
      let callCount = 0;
      mock.method(global, 'fetch', async () => {
        callCount++;
        return {
          json: async () => ({
            status: true,
            data: {
              authorization_url: `https://checkout.paystack.com/mock-ref-${callCount}`,
              reference: `mock-ref-${callCount}`,
            }
          })
        };
      });

      const response1 = await initializePayment(mockRequest);
      const response2 = await initializePayment(mockRequest);

      assert.notStrictEqual(response1.reference, response2.reference);
      assert.strictEqual(response1.reference, 'mock-ref-1');
      assert.strictEqual(response2.reference, 'mock-ref-2');
    });

    test('should throw an error if PAYSTACK_SECRET_KEY is not defined', async () => {
      delete process.env.PAYSTACK_SECRET_KEY;

      await assert.rejects(
        async () => {
          await initializePayment(mockRequest);
        },
        {
          name: 'Error',
          message: 'PAYSTACK_SECRET_KEY is not defined'
        }
      );
    });

    test('should throw an error if Paystack API returns unsuccessful status', async () => {
      mock.method(global, 'fetch', async () => {
        return {
          json: async () => ({
            status: false,
            message: 'Invalid amount'
          })
        };
      });

      await assert.rejects(
        async () => {
          await initializePayment(mockRequest);
        },
        {
          name: 'Error',
          message: 'Invalid amount'
        }
      );
    });
  });

  describe('verifyPayment', () => {
    test('should return true for a successful payment verification', async () => {
      const reference = 'mock-ref-success';
      let fetchCallCount = 0;

      mock.method(global, 'fetch', async (url: string, options: any) => {
        fetchCallCount++;
        assert.strictEqual(url, `https://api.paystack.co/transaction/verify/${reference}`);
        assert.strictEqual(options.headers.Authorization, 'Bearer test_secret_key');
        return {
          json: async () => ({
            status: true,
            message: 'Verification successful',
            data: {
              status: 'success',
              reference: reference
            }
          })
        };
      });

      const result = await verifyPayment(reference);

      assert.strictEqual(fetchCallCount, 1);
      assert.strictEqual(result, true);
    });

    test('should return false for an unsuccessful payment verification (data.status is not success)', async () => {
      const reference = 'mock-ref-failed';
      mock.method(global, 'fetch', async () => {
        return {
          json: async () => ({
            status: true,
            data: {
              status: 'failed',
              reference: reference
            }
          })
        };
      });

      const result = await verifyPayment(reference);

      assert.strictEqual(result, false);
    });

    test('should return false if API request fails (status is false)', async () => {
      const reference = 'mock-ref-error';
      mock.method(global, 'fetch', async () => {
        return {
          json: async () => ({
            status: false,
            message: 'Transaction not found'
          })
        };
      });

      const result = await verifyPayment(reference);

      assert.strictEqual(result, false);
    });

    test('should throw an error if PAYSTACK_SECRET_KEY is not defined', async () => {
      delete process.env.PAYSTACK_SECRET_KEY;

      await assert.rejects(
        async () => {
          await verifyPayment('some-ref');
        },
        {
          name: 'Error',
          message: 'PAYSTACK_SECRET_KEY is not defined'
        }
      );
    });
  });
});
