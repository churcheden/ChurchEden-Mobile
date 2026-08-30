// src/lib/errors.ts

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string[]>,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Backward-compatible alias
export const ApiError = AppError;

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

export const ERROR_CODES = {
  DRAFT_NOT_FOUND:      'DRAFT_NOT_FOUND',
  PROFILE_NOT_FOUND:    'PROFILE_NOT_FOUND',
  LOGO_TOO_LARGE:       'LOGO_TOO_LARGE',
  PHOTO_TOO_LARGE:      'PHOTO_TOO_LARGE',
  EMAIL_NOT_VERIFIED:   'EMAIL_NOT_VERIFIED',
  INVALID_CREDENTIALS:  'INVALID_CREDENTIALS',
  TOKEN_EXPIRED:        'TOKEN_EXPIRED',
  UNAUTHORIZED:         'UNAUTHORIZED',
} as const;
