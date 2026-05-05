import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

const BASE_URL = 'https://api.fiscomm.rs';

// ─── Shared fixtures ─────────────────────────────────────────────────────────

export const MOCK_RECEIPT_DETAILS = {
  id: 1,
  invoiceNumber: 'RX-123',
  invoiceCounter: '1',
  buyerId: '10:123456789',
  invoiceNumberPos: 'POS-1',
  referentDocumentNumber: '',
  referentDocumentDt: '2024-01-01T00:00:00Z',
  invoiceCounterExtension: '',
  address: 'Test Street 1',
  buyerCostCenterId: '',
  businessName: 'Test Shop',
  locationName: 'Main Branch',
  sdcDateTime: '2024-01-01T10:00:00Z',
  qrCodeFileUrl: 'https://cdn.fiscomm.rs/qr/123.png',
  invoicePdfUrl: 'https://cdn.fiscomm.rs/pdf/123.pdf',
  verificationUrl: 'https://suf.purs.gov.rs/v/?vl=1234',
  totalAmount: 100,
  invoiceType: 'normal',
  transactionType: 'sale',
  cashier: 'cashier1',
  items: [{ name: 'Item 1', gtin: '1234567890', quantity: 1, unitPrice: 100, totalAmount: 100, labels: ['A'] }],
  metaFields: {},
  payments: [{ type: 'Cash', amount: 100 }],
  taxItems: [{ categoryType: 0, label: 'A', amount: 16.67, rate: 20, categoryName: 'PDV-A' }],
  additional: {},
};

export const MOCK_DRAFT = {
  id: 42,
  draftName: 'Test Draft',
  orderNumber: 'ORD-001',
  buyerId: '10:123456789',
  referentDocumentNumber: '',
  referentDocumentDt: '2024-01-01T00:00:00Z',
  buyerCostCenterId: '',
  cashier: '',
  dateTimeOfIssue: '2024-01-01T10:00:00Z',
  invoiceType: 'normal',
  transactionType: 'sale',
  invoiceNumber: '',
  invoiceCounter: '',
  invoiceCounterExtension: '',
  address: '',
  businessName: '',
  locationName: '',
  sdcDateTime: '',
  qrCodeFileUrl: '',
  invoicePdfUrl: '',
  verificationUrl: '',
  totalAmount: 0,
  advanceItems: [],
  creationType: 'api',
  storagePath: '',
  filename: '',
  correlationId: '',
  items: [],
  metaFields: {},
  payments: [],
  settings: {},
  companyId: 1,
  shopId: 1,
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-01T10:00:00Z',
};

const UNAUTHORIZED = { message: 'Unauthorized' };
const FORBIDDEN = { message: 'Forbidden' };
const NOT_FOUND = { message: 'Not Found' };
const BAD_REQUEST = { message: 'Validation failed' };

// ─── MSW handlers ─────────────────────────────────────────────────────────────

export const handlers = [
  // Receipt endpoints
  http.post(`${BASE_URL}/receipt/advance/finalize`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    if (auth === 'Bearer forbidden') return HttpResponse.json(FORBIDDEN, { status: 403 });
    return HttpResponse.json({ correlationId: 'corr-1', refundReceipt: MOCK_RECEIPT_DETAILS, finalReceipt: MOCK_RECEIPT_DETAILS }, { status: 201 });
  }),

  http.post(`${BASE_URL}/receipt/:invoiceType/:transactionType`, ({ request, params }) => {
    const { transactionType } = params;
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    if (auth === 'Bearer forbidden') return HttpResponse.json(FORBIDDEN, { status: 403 });
    if (transactionType === 'bad') return HttpResponse.json(BAD_REQUEST, { status: 400 });
    return HttpResponse.json({ correlationId: 'corr-1', receipt: MOCK_RECEIPT_DETAILS }, { status: 201 });
  }),

  http.post(`${BASE_URL}/receipt/:invoiceType/:transactionType/async`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    return HttpResponse.json({ correlationId: 'corr-async', receipt: MOCK_RECEIPT_DETAILS }, { status: 201 });
  }),

  http.post(`${BASE_URL}/receipt/:invoiceType/:transactionType/bulk`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    return HttpResponse.json({
      receipts: [{ invoiceNumber: 'RX-1', buyerCostCenterId: '', businessName: 'B', locationName: 'L', sdcDateTime: '2024-01-01T10:00:00Z', invoicePdfUrl: '', verificationUrl: '', totalAmount: 100, invoiceType: 'normal', transactionType: 'sale', taxItems: [], orderNumber: 'ORD-1', journal: '' }],
      failedReceipts: [],
      totalProcessed: 1,
      successful: 1,
      failed: 0,
    }, { status: 201 });
  }),

  http.post(`${BASE_URL}/receipt/send-email`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    return HttpResponse.json({}, { status: 200 });
  }),

  http.get(`${BASE_URL}/receipt/tax-rates`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    return HttpResponse.json([{ label: 'A', rate: 20 }, { label: 'E', rate: 10 }]);
  }),

  http.post(`${BASE_URL}/receipt/drafts`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    return HttpResponse.json({ id: 42, draftName: 'Test Draft', message: 'Draft created' }, { status: 201 });
  }),

  http.get(`${BASE_URL}/receipt/drafts`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    return HttpResponse.json({ page: 1, limit: 10, total: 1, totalPages: 1, isTotalCapped: false, data: [MOCK_DRAFT] });
  }),

  http.get(`${BASE_URL}/receipt/drafts/:id`, ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    if (params.id === '999') return HttpResponse.json(NOT_FOUND, { status: 404 });
    return HttpResponse.json(MOCK_DRAFT);
  }),

  http.put(`${BASE_URL}/receipt/drafts/:id`, ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    if (params.id === '999') return HttpResponse.json(NOT_FOUND, { status: 404 });
    return HttpResponse.json({ ...MOCK_DRAFT, draftName: 'Updated Draft' });
  }),

  http.delete(`${BASE_URL}/receipt/drafts/:id`, ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    if (params.id === '999') return HttpResponse.json(NOT_FOUND, { status: 404 });
    return HttpResponse.json({ success: true, message: 'Draft deleted' });
  }),

  // Archive endpoints
  http.get(`${BASE_URL}/archive/receipts`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    if (auth === 'Bearer forbidden') return HttpResponse.json(FORBIDDEN, { status: 403 });
    return HttpResponse.json({ page: 1, limit: 10, total: 1, totalPages: 1, isTotalCapped: false, data: [MOCK_RECEIPT_DETAILS] });
  }),

  http.get(`${BASE_URL}/archive/receipts/:invoiceNumber`, ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    if (params.invoiceNumber === 'NOT-FOUND') return HttpResponse.json(NOT_FOUND, { status: 404 });
    return HttpResponse.json(MOCK_RECEIPT_DETAILS);
  }),

  // Auth endpoints
  http.post(`${BASE_URL}/auth/verify-api-token`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer invalid') return HttpResponse.json(UNAUTHORIZED, { status: 401 });
    if (auth === 'Bearer forbidden') return HttpResponse.json(FORBIDDEN, { status: 403 });
    return HttpResponse.json({ isValid: true });
  }),
];

// ─── Server setup ─────────────────────────────────────────────────────────────

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
