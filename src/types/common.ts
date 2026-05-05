// ─── Enums ────────────────────────────────────────────────────────────────────

export type InvoiceType = 'normal' | 'training' | 'advance' | 'proforma' | 'copy';
export type TransactionType = 'sale' | 'refund' | 'finalize';
export type SortOrder = 'ASC' | 'DESC';

/**
 * Payment type. Accepts both PascalCase and lowercase variants.
 * PascalCase: Cash, Card, WireTransfer, Check, Voucher, MobileMoney, Virman, Mobile, Factoring, Account, Other
 * Lowercase:  cash, card, wire_transfer, wiretransfer, check, voucher, mobile_money, mobilemoney, virman, mobile, factoring, account, other
 */
export type PaymentType =
  | 'Cash' | 'Card' | 'WireTransfer' | 'Check' | 'Voucher' | 'MobileMoney'
  | 'Virman' | 'Mobile' | 'Factoring' | 'Account' | 'Other'
  | 'cash' | 'card' | 'wire_transfer' | 'wiretransfer' | 'check' | 'voucher'
  | 'mobile_money' | 'mobilemoney' | 'virman' | 'mobile' | 'factoring' | 'account' | 'other';

// ─── Error ────────────────────────────────────────────────────────────────────

export class FiscommApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message?: string,
  ) {
    super(message ?? `Fiscomm API error: HTTP ${status}`);
    this.name = 'FiscommApiError';
  }
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isTotalCapped: boolean;
  data: T[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

// ─── Error response ───────────────────────────────────────────────────────────

export interface ErrorResponse {
  message: string;
}
