import { FiscommApiError } from './types/common.js';

export interface FiscommClientOptions {
  /** Your Fiscomm API key */
  apiKey: string;
  /** Override the base URL (default: https://api.fiscomm.rs) */
  baseUrl?: string;
}

/**
 * Internal HTTP client — shared across all resource classes.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(options: FiscommClientOptions) {
    this.baseUrl = (options.baseUrl ?? 'https://api.fiscomm.rs').replace(/\/$/, '');
    this.headers = {
      'Authorization': `Bearer ${options.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  async request<T>(
    method: string,
    path: string,
    options: { body?: unknown; query?: Record<string, unknown> } = {},
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;

    if (options.query && Object.keys(options.query).length > 0) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options.query)) {
        if (value === undefined || value === null) continue;
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)));
        } else if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method,
      headers: this.headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    let responseBody: unknown;
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    if (!response.ok) {
      const message =
        responseBody !== null &&
        typeof responseBody === 'object' &&
        'message' in (responseBody as object)
          ? String((responseBody as { message: unknown }).message)
          : `HTTP ${response.status}`;
      throw new FiscommApiError(response.status, responseBody, message);
    }

    return responseBody as T;
  }

  get<T>(path: string, query?: Record<string, unknown>): Promise<T> {
    return this.request<T>('GET', path, { query });
  }

  post<T>(path: string, body?: unknown, query?: Record<string, unknown>): Promise<T> {
    return this.request<T>('POST', path, { body, query });
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, { body });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}
