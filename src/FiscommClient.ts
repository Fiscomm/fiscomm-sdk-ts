import { HttpClient, type FiscommClientOptions } from './HttpClient.js';
import { ReceiptResource } from './resources/ReceiptResource.js';
import { ArchiveResource } from './resources/ArchiveResource.js';
import { AuthResource } from './resources/AuthResource.js';

export { FiscommClientOptions };

/**
 * The main entry point for the Fiscomm SDK.
 *
 * @example
 * ```ts
 * import { FiscommClient } from 'fiscomm-sdk';
 *
 * const client = new FiscommClient({ apiKey: 'your-api-key' });
 *
 * // Create a receipt
 * const result = await client.receipts.create('normal', 'sale', {
 *   orderNumber: 'ORD-001',
 *   buyerId: '10:123456789',
 *   items: [{ name: 'Item 1', gtin: '1234567890', quantity: 1, unitPrice: 100, totalAmount: 100, labels: ['A'] }],
 *   metaFields: {},
 *   payments: [{ type: 'Cash', amount: 100 }],
 * });
 *
 * // Verify token
 * const { isValid } = await client.auth.verifyToken();
 * ```
 */
export class FiscommClient {
  /** Receipt and draft operations */
  readonly receipts: ReceiptResource;
  /** Archive operations */
  readonly archive: ArchiveResource;
  /** Authentication operations */
  readonly auth: AuthResource;

  constructor(options: FiscommClientOptions) {
    const http = new HttpClient(options);
    this.receipts = new ReceiptResource(http);
    this.archive = new ArchiveResource(http);
    this.auth = new AuthResource(http);
  }
}
