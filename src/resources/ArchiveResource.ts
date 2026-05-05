import type { HttpClient } from '../HttpClient.js';
import type {
  ListReceiptsParams,
  GetReceiptsResponseDto,
  ArchiveReceiptResponseDto,
} from '../types/archive.js';

/**
 * Handles all `/archive/*` endpoints.
 */
export class ArchiveResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * GET /archive/receipts
   * List archived fiscal receipts with optional filters.
   */
  listReceipts(params?: ListReceiptsParams): Promise<GetReceiptsResponseDto> {
    return this.http.get<GetReceiptsResponseDto>(
      '/archive/receipts',
      params as Record<string, unknown>,
    );
  }

  /**
   * GET /archive/receipts/{invoiceNumber}
   * Get full details of a single archived receipt by invoice number.
   */
  getReceipt(invoiceNumber: string, include?: string): Promise<ArchiveReceiptResponseDto> {
    return this.http.get<ArchiveReceiptResponseDto>(
      `/archive/receipts/${encodeURIComponent(invoiceNumber)}`,
      include ? { include } : undefined,
    );
  }

}
