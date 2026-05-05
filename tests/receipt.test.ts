import { describe, it, expect } from 'vitest';
import { FiscommClient, FiscommApiError } from '../src/index.js';

const validClient = new FiscommClient({ apiKey: 'valid-key' });
const invalidClient = new FiscommClient({ apiKey: 'invalid' });
const forbiddenClient = new FiscommClient({ apiKey: 'forbidden' });

const BASE_RECEIPT_PAYLOAD = {
  orderNumber: 'ORD-001',
  buyerId: '10:123456789',
  items: [{ name: 'Item 1', gtin: '1234567890', quantity: 1, unitPrice: 100, totalAmount: 100, labels: ['A'] as string[] }],
  metaFields: {},
  payments: [{ type: 'Cash' as const, amount: 100 }],
};

// ─── POST /receipt/{invoiceType}/{transactionType} ────────────────────────────

describe('ReceiptResource.create()', () => {
  it('returns receipt details on 201', async () => {
    const result = await validClient.receipts.create('normal', 'sale', BASE_RECEIPT_PAYLOAD);
    expect(result.correlationId).toBe('corr-1');
    expect(result.receipt.invoiceNumber).toBe('RX-123');
    expect(result.receipt.totalAmount).toBe(100);
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.receipts.create('normal', 'sale', BASE_RECEIPT_PAYLOAD))
      .rejects.toThrowError(FiscommApiError);
    await expect(invalidClient.receipts.create('normal', 'sale', BASE_RECEIPT_PAYLOAD))
      .rejects.toMatchObject({ status: 401 });
  });

  it('throws FiscommApiError with status 403 when forbidden', async () => {
    await expect(forbiddenClient.receipts.create('normal', 'sale', BASE_RECEIPT_PAYLOAD))
      .rejects.toMatchObject({ status: 403 });
  });
});

// ─── POST /receipt/{invoiceType}/{transactionType}/async ──────────────────────

describe('ReceiptResource.createAsync()', () => {
  const ASYNC_PAYLOAD = {
    ...BASE_RECEIPT_PAYLOAD,
    webhook: { url: 'https://webhook.example.com/receipt' },
  };

  it('returns receipt details on 201', async () => {
    const result = await validClient.receipts.createAsync('normal', 'sale', ASYNC_PAYLOAD);
    expect(result.correlationId).toBe('corr-async');
    expect(result.receipt).toBeDefined();
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.receipts.createAsync('normal', 'sale', ASYNC_PAYLOAD))
      .rejects.toMatchObject({ status: 401 });
  });
});

// ─── POST /receipt/{invoiceType}/{transactionType}/bulk ───────────────────────

describe('ReceiptResource.createBulk()', () => {
  const BULK_PAYLOAD = {
    receipts: [{
      orderNumber: 'ORD-001',
      buyerId: '10:123456789',
      items: [{ name: 'Item 1', gtin: '1234567890', quantity: 1, unitPrice: 100, totalAmount: 100, labels: ['A'] as string[] }],
      metaFields: {},
      payments: [{ type: 'Cash' as const, amount: 100 }],
    }],
  };

  it('returns bulk result on 201', async () => {
    const result = await validClient.receipts.createBulk('normal', 'sale', BULK_PAYLOAD);
    expect(result.totalProcessed).toBe(1);
    expect(result.successful).toBe(1);
    expect(result.failed).toBe(0);
    expect(result.receipts).toHaveLength(1);
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.receipts.createBulk('normal', 'sale', BULK_PAYLOAD))
      .rejects.toMatchObject({ status: 401 });
  });
});

// ─── POST /receipt/advance/finalize ──────────────────────────────────────────

describe('ReceiptResource.finalizeAdvance()', () => {
  it('returns refundReceipt and finalReceipt on 201', async () => {
    const result = await validClient.receipts.finalizeAdvance(BASE_RECEIPT_PAYLOAD);
    expect(result.correlationId).toBe('corr-1');
    expect(result.refundReceipt).toBeDefined();
    expect(result.finalReceipt).toBeDefined();
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.receipts.finalizeAdvance(BASE_RECEIPT_PAYLOAD))
      .rejects.toMatchObject({ status: 401 });
  });

  it('throws FiscommApiError with status 403 when forbidden', async () => {
    await expect(forbiddenClient.receipts.finalizeAdvance(BASE_RECEIPT_PAYLOAD))
      .rejects.toMatchObject({ status: 403 });
  });
});

// ─── POST /receipt/send-email ─────────────────────────────────────────────────

describe('ReceiptResource.sendEmail()', () => {
  it('returns 200 on success', async () => {
    const result = await validClient.receipts.sendEmail({ invoiceNumber: 'RX-123', email: 'test@example.com' });
    expect(result).toBeDefined();
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.receipts.sendEmail({ invoiceNumber: 'RX-123', email: 'test@example.com' }))
      .rejects.toMatchObject({ status: 401 });
  });
});

// ─── GET /receipt/tax-rates ───────────────────────────────────────────────────

describe('ReceiptResource.getTaxRates()', () => {
  it('returns array of tax rates on 200', async () => {
    const result = await validClient.receipts.getTaxRates(1);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.receipts.getTaxRates(1))
      .rejects.toMatchObject({ status: 401 });
  });
});

// ─── POST /receipt/drafts ─────────────────────────────────────────────────────

describe('ReceiptResource.createDraft()', () => {
  it('returns draft id and message on 201', async () => {
    const result = await validClient.receipts.createDraft({
      orderNumber: 'ORD-001',
      buyerId: '10:123456789',
      items: [],
      metaFields: {},
      draftName: 'Test Draft',
    });
    expect(result.id).toBe(42);
    expect(result.draftName).toBe('Test Draft');
    expect(result.message).toBeDefined();
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.receipts.createDraft({
      orderNumber: 'ORD-001', buyerId: '10:123456789', items: [], metaFields: {}, draftName: 'D',
    })).rejects.toMatchObject({ status: 401 });
  });
});

// ─── GET /receipt/drafts ──────────────────────────────────────────────────────

describe('ReceiptResource.listDrafts()', () => {
  it('returns paginated drafts on 200', async () => {
    const result = await validClient.receipts.listDrafts();
    expect(result.page).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe(42);
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.receipts.listDrafts())
      .rejects.toMatchObject({ status: 401 });
  });
});

// ─── GET /receipt/drafts/{id} ─────────────────────────────────────────────────

describe('ReceiptResource.getDraft()', () => {
  it('returns draft details on 200', async () => {
    const result = await validClient.receipts.getDraft(42);
    expect(result.id).toBe(42);
    expect(result.draftName).toBe('Test Draft');
  });

  it('throws FiscommApiError with status 404 for missing draft', async () => {
    await expect(validClient.receipts.getDraft(999))
      .rejects.toMatchObject({ status: 404 });
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.receipts.getDraft(42))
      .rejects.toMatchObject({ status: 401 });
  });
});

// ─── PUT /receipt/drafts/{id} ─────────────────────────────────────────────────

describe('ReceiptResource.updateDraft()', () => {
  it('returns updated draft on 200', async () => {
    const result = await validClient.receipts.updateDraft(42, { draftName: 'Updated Draft' });
    expect(result.draftName).toBe('Updated Draft');
  });

  it('throws FiscommApiError with status 404 for missing draft', async () => {
    await expect(validClient.receipts.updateDraft(999, { draftName: 'X' }))
      .rejects.toMatchObject({ status: 404 });
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.receipts.updateDraft(42, {}))
      .rejects.toMatchObject({ status: 401 });
  });
});

// ─── DELETE /receipt/drafts/{id} ──────────────────────────────────────────────

describe('ReceiptResource.deleteDraft()', () => {
  it('returns success response on 200', async () => {
    const result = await validClient.receipts.deleteDraft(42);
    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
  });

  it('throws FiscommApiError with status 404 for missing draft', async () => {
    await expect(validClient.receipts.deleteDraft(999))
      .rejects.toMatchObject({ status: 404 });
  });

  it('throws FiscommApiError with status 401 for invalid API key', async () => {
    await expect(invalidClient.receipts.deleteDraft(42))
      .rejects.toMatchObject({ status: 401 });
  });
});
