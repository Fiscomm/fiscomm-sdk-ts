import type { HttpClient } from '../HttpClient.js';
import type {
  InvoiceType,
  TransactionType,
  PaginatedResponse,
} from '../types/common.js';
import type {
  CreateReceiptRequestDto,
  CreateReceiptResponseDto,
  CreateReceiptAsyncRequestDto,
  CreateBulkReceiptRequestDto,
  CreateBulkReceiptResponseDto,
  AdvanceFinalizeRequestDto,
  AdvanceFinalizeResponseDto,
  SendReceiptEmailRequestDto,
  CreateReceiptDraftRequestDto,
  CreateDraftResponseDto,
  UpdateReceiptDraftRequestDto,
  ReceiptDraftResponseDto,
  DeleteDraftResponseDto,
  TaxRateDto,
  ListDraftsParams,
} from '../types/receipt.js';

/**
 * Handles all `/receipt/*` endpoints.
 */
export class ReceiptResource {
  constructor(private readonly http: HttpClient) {}

  // ─── Core receipt operations ───────────────────────────────────────────────

  /**
   * POST /receipt/{invoiceType}/{transactionType}
   * Create a fiscal receipt synchronously.
   */
  create(
    invoiceType: InvoiceType,
    transactionType: TransactionType,
    payload: CreateReceiptRequestDto,
  ): Promise<CreateReceiptResponseDto> {
    return this.http.post<CreateReceiptResponseDto>(
      `/receipt/${invoiceType}/${transactionType}`,
      payload,
    );
  }

  /**
   * POST /receipt/{invoiceType}/{transactionType}/async
   * Create a fiscal receipt asynchronously (fire-and-forget, result sent to webhook).
   */
  createAsync(
    invoiceType: InvoiceType,
    transactionType: TransactionType,
    payload: CreateReceiptAsyncRequestDto,
  ): Promise<CreateReceiptResponseDto> {
    return this.http.post<CreateReceiptResponseDto>(
      `/receipt/${invoiceType}/${transactionType}/async`,
      payload,
    );
  }

  /**
   * POST /receipt/{invoiceType}/{transactionType}/bulk
   * Create up to 30 fiscal receipts in a single request.
   */
  createBulk(
    invoiceType: InvoiceType,
    transactionType: TransactionType,
    payload: CreateBulkReceiptRequestDto,
  ): Promise<CreateBulkReceiptResponseDto> {
    return this.http.post<CreateBulkReceiptResponseDto>(
      `/receipt/${invoiceType}/${transactionType}/bulk`,
      payload,
    );
  }

  /**
   * POST /receipt/advance/finalize
   * Finalize an advance receipt in one request (creates ADVANCE/REFUND + NORMAL/SALE internally).
   */
  finalizeAdvance(payload: AdvanceFinalizeRequestDto): Promise<AdvanceFinalizeResponseDto> {
    return this.http.post<AdvanceFinalizeResponseDto>('/receipt/advance/finalize', payload);
  }

  /**
   * POST /receipt/send-email
   * Send a previously issued receipt to an email address.
   */
  sendEmail(payload: SendReceiptEmailRequestDto): Promise<Record<string, never>> {
    return this.http.post<Record<string, never>>('/receipt/send-email', payload);
  }

  // ─── Tax rates ─────────────────────────────────────────────────────────────

  /**
   * GET /receipt/tax-rates
   * Get the VAT tax rates configured for a specific shop.
   */
  getTaxRates(shopId: number): Promise<TaxRateDto[]> {
    return this.http.get<TaxRateDto[]>('/receipt/tax-rates', { shopId });
  }

  // ─── Drafts ────────────────────────────────────────────────────────────────

  /**
   * POST /receipt/drafts
   * Create a receipt draft for later finalization.
   */
  createDraft(payload: CreateReceiptDraftRequestDto): Promise<CreateDraftResponseDto> {
    return this.http.post<CreateDraftResponseDto>('/receipt/drafts', payload);
  }

  /**
   * GET /receipt/drafts
   * List receipt drafts with optional filters.
   */
  listDrafts(params?: ListDraftsParams): Promise<PaginatedResponse<ReceiptDraftResponseDto>> {
    return this.http.get<PaginatedResponse<ReceiptDraftResponseDto>>(
      '/receipt/drafts',
      params as Record<string, unknown>,
    );
  }

  /**
   * GET /receipt/drafts/{id}
   * Get a specific receipt draft by its ID.
   */
  getDraft(id: number): Promise<ReceiptDraftResponseDto> {
    return this.http.get<ReceiptDraftResponseDto>(`/receipt/drafts/${id}`);
  }

  /**
   * PUT /receipt/drafts/{id}
   * Update an existing receipt draft.
   */
  updateDraft(id: number, payload: UpdateReceiptDraftRequestDto): Promise<ReceiptDraftResponseDto> {
    return this.http.put<ReceiptDraftResponseDto>(`/receipt/drafts/${id}`, payload);
  }

  /**
   * DELETE /receipt/drafts/{id}
   * Permanently delete a receipt draft.
   */
  deleteDraft(id: number): Promise<DeleteDraftResponseDto> {
    return this.http.delete<DeleteDraftResponseDto>(`/receipt/drafts/${id}`);
  }
}
