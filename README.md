# Fiscomm TypeScript SDK

> Note: This SDK was AI-generated and has been tested, but it may still contain issues or edge cases. Please validate thoroughly in your environment before production use.

Official TypeScript SDK for the [Fiscomm Public API](https://api.fiscomm.rs). Supports all API-key accessible endpoints for fiscal receipt creation, archive querying, and authentication.

## Installation

```bash
npm install github:Fiscomm/fiscomm-sdk-ts
```

> **Node.js ≥ 18** required (uses native `fetch`).

## Quick Start

```typescript
import { FiscommClient } from 'fiscomm-sdk';

const client = new FiscommClient({ apiKey: 'your-api-key' });

// Create a fiscal receipt
const result = await client.receipts.create('normal', 'sale', {
  orderNumber: 'ORD-2024-001',
  buyerId: '10:123456789',
  items: [
    {
      name: 'Widget A',
      gtin: '3838989123456',
      quantity: 2,
      unitPrice: 500,
      totalAmount: 1000,
      labels: ['A'],
    },
  ],
  metaFields: { customer_name: 'John Doe' },
  payments: [{ type: 'Cash', amount: 1000 }],
});

console.log(result.receipt.invoiceNumber);
console.log(result.receipt.invoicePdfUrl);
```

## Configuration

```typescript
const client = new FiscommClient({
  apiKey: 'your-api-key',          // Required
  baseUrl: 'https://api.fiscomm.rs', // Optional, this is the default
});
```

## Kako Se Koristi (Produkcija)

Primeri ispod pokrivaju tipicne tokove koje ce integratori najcesce koristiti u produkciji.

### 1) Kreiranje racuna (normal/sale)

```typescript
import { FiscommClient } from 'fiscomm-sdk';

const client = new FiscommClient({
  apiKey: process.env.FISCOMM_API_KEY!,
  baseUrl: 'https://api.fiscomm.rs',
});

const created = await client.receipts.create('normal', 'sale', {
  orderNumber: `ORDER-${Date.now()}`,
  buyerId: '10:123456789',
  items: [
    {
      name: 'Proizvod A',
      gtin: '8600000000001',
      quantity: 1,
      unitPrice: 1200,
      totalAmount: 1200,
      labels: ['F'],
    },
  ],
  metaFields: {},
  payments: [{ type: 'Cash', amount: 1200 }],
});

console.log(created.receipt.invoiceNumber);
```

### 2) Advance finalize tok

```typescript
const finalized = await client.receipts.finalizeAdvance({
  orderNumber: `ADV-FIN-${Date.now()}`,
  buyerId: '10:123456789',
  items: [
    {
      name: 'Advance stavka',
      gtin: '8600000000002',
      quantity: 1,
      unitPrice: 1000,
      totalAmount: 1000,
      labels: ['E'],
    },
  ],
  metaFields: {},
  payments: [{ type: 'Cash', amount: 1000 }],
});

console.log(finalized.refundReceipt.invoiceNumber, finalized.finalReceipt.invoiceNumber);
```

### 3) Preporuke za bezbednost

- Ne upisujte API kljuceve direktno u kod.
- Koristite env varijable (npr. FISCOMM_API_KEY).
- Uvek koristite produkcioni baseUrl: https://api.fiscomm.rs.

## API Reference

### `client.receipts`

#### Create a receipt (sync)
```typescript
const result = await client.receipts.create(
  invoiceType: InvoiceType,      // 'normal' | 'training' | 'advance' | 'proforma' | 'copy'
  transactionType: TransactionType, // 'sale' | 'finalize'
  payload: CreateReceiptRequestDto,
);
// Returns: CreateReceiptResponseDto
```

#### Create a receipt (async / fire-and-forget)
```typescript
const result = await client.receipts.createAsync(
  invoiceType: InvoiceType,
  transactionType: TransactionType,
  payload: CreateReceiptAsyncRequestDto, // requires webhook.url
);
```

#### Bulk create receipts (max 30)
```typescript
const result = await client.receipts.createBulk(
  invoiceType: InvoiceType,
  transactionType: TransactionType,
  payload: CreateBulkReceiptRequestDto,
);
// Returns: CreateBulkReceiptResponseDto (receipts, failedReceipts, totalProcessed, successful, failed)
```

#### Finalize advance receipt
```typescript
const result = await client.receipts.finalizeAdvance(payload: AdvanceFinalizeRequestDto);
// Returns: AdvanceFinalizeResponseDto (refundReceipt, finalReceipt)
```

#### Send receipt via email
```typescript
await client.receipts.sendEmail({
  invoiceNumber: 'RX-123',
  email: 'customer@example.com',
  cc: ['manager@example.com'],
});
```

#### Get tax rates
```typescript
const taxRates = await client.receipts.getTaxRates(shopId: number);
```

#### Receipt Drafts
```typescript
// Create
const draft = await client.receipts.createDraft(payload: CreateReceiptDraftRequestDto);

// List (with optional filters)
const drafts = await client.receipts.listDrafts({ page: 1, limit: 10 });

// Get by ID
const draft = await client.receipts.getDraft(id: number);

// Update
const updated = await client.receipts.updateDraft(id: number, payload: UpdateReceiptDraftRequestDto);

// Delete
const result = await client.receipts.deleteDraft(id: number);
```

---

### `client.archive`

#### List archived receipts
```typescript
const receipts = await client.archive.listReceipts({
  page: 1,
  limit: 10,
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  shopId: 1,
  invoiceType: 'normal',
});
```

#### Get single receipt by invoice number
```typescript
const receipt = await client.archive.getReceipt('RX-123', 'items,payments');
```

---

### `client.auth`

#### Verify API token
```typescript
const { isValid } = await client.auth.verifyToken();
```

---

## Error Handling

All API errors throw a `FiscommApiError`:

```typescript
import { FiscommApiError } from 'fiscomm-sdk';

try {
  await client.receipts.create('normal', 'sale', payload);
} catch (err) {
  if (err instanceof FiscommApiError) {
    console.error('Status:', err.status);    // e.g. 401, 403, 404
    console.error('Message:', err.message);
    console.error('Body:', err.body);         // parsed JSON response body
  }
}
```

| Status | Meaning |
|--------|---------|
| 401 | Unauthorized — missing or invalid API key |
| 403 | Forbidden — API key lacks access to this resource |
| 404 | Not Found — the resource doesn't exist |
| 429 | Too Many Requests — rate limit exceeded (bulk endpoints) |

---

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Type check
npm run typecheck

# Build
npm run build
```
