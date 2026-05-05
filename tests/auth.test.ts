import { describe, it, expect } from 'vitest';
import { FiscommClient, FiscommApiError } from '../src/index.js';

const validClient = new FiscommClient({ apiKey: 'valid-key' });
const invalidClient = new FiscommClient({ apiKey: 'invalid' });
const forbiddenClient = new FiscommClient({ apiKey: 'forbidden' });

// ─── POST /auth/verify-api-token ─────────────────────────────────────────────

describe('AuthResource.verifyToken()', () => {
  it('returns { isValid: true } for valid API key', async () => {
    const result = await validClient.auth.verifyToken();
    expect(result.isValid).toBe(true);
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.auth.verifyToken())
      .rejects.toThrowError(FiscommApiError);
    await expect(invalidClient.auth.verifyToken())
      .rejects.toMatchObject({ status: 401 });
  });

  it('throws FiscommApiError with status 403 when forbidden', async () => {
    await expect(forbiddenClient.auth.verifyToken())
      .rejects.toMatchObject({ status: 403 });
  });

  it('error body contains message property', async () => {
    try {
      await invalidClient.auth.verifyToken();
    } catch (err) {
      expect(err).toBeInstanceOf(FiscommApiError);
      const apiErr = err as FiscommApiError;
      expect(apiErr.body).toMatchObject({ message: expect.any(String) });
    }
  });
});
