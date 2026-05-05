import type { HttpClient } from '../HttpClient.js';
import type { VerifyTokenResponseDto } from '../types/auth.js';

/**
 * Handles all `/auth/*` endpoints.
 */
export class AuthResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * POST /auth/verify-api-token
   * Verify the validity of the current API key.
   */
  verifyToken(): Promise<VerifyTokenResponseDto> {
    return this.http.post<VerifyTokenResponseDto>('/auth/verify-api-token');
  }
}
