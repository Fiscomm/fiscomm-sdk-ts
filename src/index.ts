// Main client
export { FiscommClient } from './FiscommClient.js';
export type { FiscommClientOptions } from './FiscommClient.js';

// Error
export { FiscommApiError } from './types/common.js';

// Common types
export type {
  InvoiceType,
  TransactionType,
  PaymentType,
  SortOrder,
  PaginatedResponse,
  PaginationParams,
} from './types/common.js';

// Receipt types
export type {
  ItemDto,
  PaymentDto,
  CreateReceiptSettingsDto,
  WebhookConfigDto,
  CreateReceiptRequestDto,
  CreateReceiptAsyncRequestDto,
  BulkReceiptItemDto,
  CreateBulkReceiptRequestDto,
  AdvanceFinalizeRequestDto,
  CreateReceiptDraftRequestDto,
  UpdateReceiptDraftRequestDto,
  SendReceiptEmailRequestDto,
  TaxItemDto,
  ReceiptDetailsDto,
  CreateReceiptResponseDto,
  AdvanceFinalizeResponseDto,
  BulkReceiptResultDto,
  CreateBulkReceiptResponseDto,
  ReceiptDraftResponseDto,
  CreateDraftResponseDto,
  DeleteDraftResponseDto,
  TaxRateDto,
  ListDraftsParams,
} from './types/receipt.js';

// Archive types
export type {
  ListReceiptsParams,
  GetReceiptsResponseDto,
  ArchiveReceiptResponseDto,
} from './types/archive.js';

// Auth types
export type { VerifyTokenResponseDto } from './types/auth.js';
