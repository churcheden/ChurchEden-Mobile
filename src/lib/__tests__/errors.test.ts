import { describe, expect, it } from 'vitest';
import {
  AppError,
  ApiError,
  isAppError,
  ERROR_CODES,
} from '@/lib/errors';

describe('AppError', () => {
  it('is an AppError and Error with the AppError name', () => {
    const err = new AppError('CODE', 'boom');
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('AppError');
  });

  it('captures code, message, details and statusCode', () => {
    const err = new AppError('VALIDATION', 'Bad input', { email: ['Required'] }, 422);
    expect(err.code).toBe('VALIDATION');
    expect(err.message).toBe('Bad input');
    expect(err.details).toEqual({ email: ['Required'] });
    expect(err.statusCode).toBe(422);
  });

  it('defaults details/statusCode to undefined', () => {
    const err = new AppError('X', 'y');
    expect(err.details).toBeUndefined();
    expect(err.statusCode).toBeUndefined();
  });

  it('keeps the correct prototype chain', () => {
    const err = new AppError('X', 'y');
    expect(Object.getPrototypeOf(err)).toBe(AppError.prototype);
  });
});

describe('ApiError alias', () => {
  it('aliases AppError', () => {
    expect(ApiError).toBe(AppError);
  });
});

describe('isAppError', () => {
  it('returns true for AppError instances', () => {
    expect(isAppError(new AppError('X', 'y'))).toBe(true);
  });

  it('returns false for other values', () => {
    expect(isAppError(new Error('nope'))).toBe(false);
    expect(isAppError({ code: 'X' })).toBe(false);
    expect(isAppError(null)).toBe(false);
    expect(isAppError(undefined)).toBe(false);
  });
});

describe('ERROR_CODES', () => {
  it('exposes expected semantic codes', () => {
    expect(ERROR_CODES.TOKEN_EXPIRED).toBe('TOKEN_EXPIRED');
    expect(ERROR_CODES.INVALID_CREDENTIALS).toBe('INVALID_CREDENTIALS');
    expect(ERROR_CODES.EMAIL_NOT_VERIFIED).toBe('EMAIL_NOT_VERIFIED');
  });
});
