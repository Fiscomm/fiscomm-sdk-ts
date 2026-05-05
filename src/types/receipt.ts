import type { InvoiceType, TransactionType, PaymentType, PaginationParams } from './common.js';

// ─── Shared sub-DTOs ──────────────────────────────────────────────────────────

export interface ItemDto {
  name: string;
  gtin: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  /** Tax labels, e.g. ["A"], ["F"] */
  labels: string[];
}

export interface PaymentDto {
  type: PaymentType;
  amount: number;
}

export interface CreateReceiptSettingsDto {
  skipOrderNumberValidation?: boolean;
  skipInvoiceNumberValidation?: boolean;
  skipAmountValidation?: boolean;
  /** Email to send the receipt to immediately on creation */
  sendToEmail?: string;
  orderNumberUnderReceipt?: boolean;
}

export interface WebhookConfigDto {
  /** Webhook URL to POST the receipt result to */
  url: string;
  headers?: Record<string, string>;
  apiKey?: string;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateReceiptRequestDto {
  orderNumber: string;
  buyerId: string;
  items: ItemDto[];
  metaFields: Record<string, unknown>;
  payments: PaymentDto[];
  referentDocumentNumber?: string | null;
  referentDocumentDt?: string | null;
  buyerCostCenterId?: string | null;
  cashier?: string | null;
  dateTimeOfIssue?: string | null;
  settings?: CreateReceiptSettingsDto;
  familyId?: number;
}

export interface CreateReceiptAsyncRequestDto {
  orderNumber: string;
  buyerId: string;
  items: ItemDto[];
  metaFields: Record<string, unknown>;
  payments: PaymentDto[];
  /** Required: webhook to receive async result */
  webhook: WebhookConfigDto;
  referentDocumentNumber?: string | null;
  referentDocumentDt?: string | null;
  buyerCostCenterId?: string | null;
  cashier?: string | null;
  dateTimeOfIssue?: string | null;
  settings?: CreateReceiptSettingsDto;
  familyId?: number;
}

/** Individual receipt payload in a bulk request */
export interface BulkReceiptItemDto {
  orderNumber: string;
  buyerId: string;
  items: ItemDto[];
  metaFields: Record<string, unknown>;
  payments: PaymentDto[];
  referentDocumentNumber?: string | null;
  referentDocumentDt?: string | null;
  buyerCostCenterId?: string | null;
  cashier?: string | null;
  dateTimeOfIssue?: string | null;
  settings?: CreateReceiptSettingsDto;
  familyId?: number;
}

export interface CreateBulkReceiptRequestDto {
  /** Array of receipts — max 30 */
  receipts: BulkReceiptItemDto[];
}

export interface AdvanceFinalizeRequestDto {
  orderNumber: string;
  buyerId: string;
  items: ItemDto[];
  metaFields: Record<string, unknown>;
  payments: PaymentDto[];
  referentDocumentNumber?: string | null;
  referentDocumentDt?: string | null;
  buyerCostCenterId?: string | null;
  cashier?: string | null;
  dateTimeOfIssue?: string | null;
  settings?: CreateReceiptSettingsDto;
  familyId?: number;
}

export interface RefundReceiptRequestDto {
  buyerId: string;
  orderNumber?: string;
  toEmail?: string;
  textHeader?: string;
  textFooter?: string;
  buyerCostCenterId?: string | null;
  cashier?: string | null;
  dateTimeOfIssue?: string | null;
  settings?: CreateReceiptSettingsDto;
  familyId?: number;
}

export interface CreateReceiptDraftRequestDto {
  orderNumber: string;
  buyerId: string;
  items: ItemDto[];
  metaFields: Record<string, unknown>;
  draftName: string;
  payments?: PaymentDto[];
  invoiceType?: InvoiceType;
  transactionType?: TransactionType;
  referentDocumentNumber?: string | null;
  referentDocumentDt?: string | null;
  buyerCostCenterId?: string | null;
  cashier?: string | null;
  dateTimeOfIssue?: string | null;
  settings?: CreateReceiptSettingsDto;
  familyId?: number;
  invoiceNumber?: string;
  invoiceCounter?: string;
  invoiceCounterExtension?: string;
  address?: string;
  businessName?: string;
  locationName?: string;
  sdcDateTime?: string;
  qrCodeFileUrl?: string;
  invoicePdfUrl?: string;
  verificationUrl?: string;
  totalAmount?: number;
  correlationId?: string;
}

export type UpdateReceiptDraftRequestDto = Partial<CreateReceiptDraftRequestDto>;

export interface SendReceiptEmailRequestDto {
  invoiceNumber: string;
  email: string;
  cc?: string[];
  bcc?: string[];
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface TaxItemDto {
  categoryType: number;
  label: string;
  amount: number;
  rate: number;
  categoryName: string;
}

export interface ReceiptDetailsDto {
  id: number;
  invoiceNumber: string;
  invoiceCounter: string;
  buyerId: string;
  invoiceNumberPos: string;
  referentDocumentNumber: string;
  referentDocumentDt: string;
  invoiceCounterExtension: string;
  address: string;
  buyerCostCenterId: string;
  businessName: string;
  locationName: string;
  sdcDateTime: string;
  qrCodeFileUrl: string;
  invoicePdfUrl: string;
  verificationUrl: string;
  totalAmount: number;
  invoiceType: string;
  transactionType: string;
  cashier: string;
  items: ItemDto[];
  metaFields: Record<string, unknown>;
  payments: PaymentDto[];
  taxItems: TaxItemDto[];
  additional: Record<string, unknown>;
}

export interface CreateReceiptResponseDto {
  correlationId: string;
  receipt: ReceiptDetailsDto;
}

export interface AdvanceFinalizeResponseDto {
  correlationId: string;
  refundReceipt: ReceiptDetailsDto;
  finalReceipt: ReceiptDetailsDto;
}

export interface BulkReceiptResultDto {
  invoiceNumber: string;
  buyerCostCenterId: string;
  businessName: string;
  locationName: string;
  sdcDateTime: string;
  invoicePdfUrl: string;
  verificationUrl: string;
  totalAmount: number;
  invoiceType: string;
  transactionType: string;
  taxItems: TaxItemDto[];
  orderNumber: string;
  journal: string;
}

export interface CreateBulkReceiptResponseDto {
  receipts: BulkReceiptResultDto[];
  failedReceipts: string[];
  totalProcessed: number;
  successful: number;
  failed: number;
}

export interface ReceiptDraftResponseDto {
  id: number;
  draftName: string;
  orderNumber: string;
  buyerId: string;
  referentDocumentNumber: string;
  referentDocumentDt: string;
  buyerCostCenterId: string;
  cashier: string;
  dateTimeOfIssue: string;
  invoiceType: unknown;
  transactionType: unknown;
  invoiceNumber: string;
  invoiceCounter: string;
  invoiceCounterExtension: string;
  address: string;
  businessName: string;
  locationName: string;
  sdcDateTime: string;
  qrCodeFileUrl: string;
  invoicePdfUrl: string;
  verificationUrl: string;
  totalAmount: number;
  items: ItemDto[];
  metaFields: Record<string, unknown>;
  payments: PaymentDto[];
  settings: CreateReceiptSettingsDto;
  companyId: number;
  shopId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDraftResponseDto {
  id: number;
  draftName: string;
  message: string;
}

export interface DeleteDraftResponseDto {
  success: boolean;
  message: string;
}

/** Tax rate shape — the API returns an open object */
export type TaxRateDto = Record<string, unknown>;

// ─── Query params ─────────────────────────────────────────────────────────────

export interface ListDraftsParams extends PaginationParams {
  startDate?: string;
  endDate?: string;
  invoiceNumber?: string;
  buyerId?: string;
  shopId?: number;
  invoiceType?: InvoiceType;
  transactionType?: TransactionType;
  paymentType?: PaymentType;
  orderNumber?: string;
  cashier?: string;
  companyId?: number;
  userId?: number;
  metaFields?: Record<string, unknown>;
  include?: string[];
  draftName?: string;
}
