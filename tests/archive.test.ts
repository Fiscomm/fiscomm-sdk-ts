import { describe, it, expect } from 'vitest';
import { FiscommClient, FiscommApiError } from '../src/index.js';

const validClient = new FiscommClient({ apiKey: 'valid-key' });
const invalidClient = new FiscommClient({ apiKey: 'invalid' });
const forbiddenClient = new FiscommClient({ apiKey: 'forbidden' });

// ─── GET /archive/receipts ────────────────────────────────────────────────────

describe('ArchiveResource.listReceipts()', () => {
  it('returns paginated receipts on 200', async () => {
    const result = await validClient.archive.listReceipts();
    expect(result.page).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].invoiceNumber).toBe('RX-123');
  });

  it('supports optional filters', async () => {
    const result = await validClient.archive.listReceipts({
      page: 1,
      limit: 10,
      sortBy: 'sdcDateTime',
      sortOrder: 'DESC',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      shopId: 1,
      companyId: 1,
    });
    expect(result.data).toBeDefined();
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.archive.listReceipts())
      .rejects.toThrowError(FiscommApiError);
    await expect(invalidClient.archive.listReceipts())
      .rejects.toMatchObject({ status: 401 });
  });

  it('throws FiscommApiError with status 403 when forbidden', async () => {
    await expect(forbiddenClient.archive.listReceipts())
      .rejects.toMatchObject({ status: 403 });
  });
});

// ─── GET /archive/receipts/{invoiceNumber} ────────────────────────────────────

describe('ArchiveResource.getReceipt()', () => {
  it('returns receipt details on 200', async () => {
    const result = await validClient.archive.getReceipt('RX-123');
    expect(result.invoiceNumber).toBe('RX-123');
    expect(result.totalAmount).toBe(100);
    expect(result.items).toHaveLength(1);
  });

  it('supports include parameter', async () => {
    const result = await validClient.archive.getReceipt('RX-123', 'items,payments');
    expect(result).toBeDefined();
  });

  it('throws FiscommApiError with status 404 for missing invoice', async () => {
    await expect(validClient.archive.getReceipt('NOT-FOUND'))
      .rejects.toMatchObject({ status: 404 });
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.archive.getReceipt('RX-123'))
      .rejects.toMatchObject({ status: 401 });
  });
});

