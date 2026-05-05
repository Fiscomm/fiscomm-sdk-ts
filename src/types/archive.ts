import type { InvoiceType, PaymentType, PaginationParams, PaginatedResponse } from './common.js';
import type { ReceiptDetailsDto } from './receipt.js';

// ─── Query params ─────────────────────────────────────────────────────────────

export interface ListReceiptsParams extends PaginationParams {
  startDate?: string;
  endDate?: string;
  invoiceNumber?: string;
  buyerId?: string;
  shopId?: number;
  invoiceType?: InvoiceType;
  transactionType?: string;
  paymentType?: PaymentType;
  orderNumber?: string;
  cashier?: string;
  companyId?: number;
  userId?: number;
  metaFields?: Record<string, unknown>;
  include?: string[];
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export type GetReceiptsResponseDto = PaginatedResponse<ReceiptDetailsDto>;

export type ArchiveReceiptResponseDto = ReceiptDetailsDto;
