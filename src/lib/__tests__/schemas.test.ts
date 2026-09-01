import { describe, expect, it } from 'vitest';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  memberProfileSchema,
  churchRequestSchema,
} from '@/lib/schemas';

describe('registerSchema', () => {
  it('accepts a valid email + 8-char password', () => {
    const result = registerSchema.safeParse({ email: 'a@b.com', password: 'password1' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({ email: 'not-an-email', password: 'password1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Enter a valid email');
    }
  });

  it('rejects a short password', () => {
    const result = registerSchema.safeParse({ email: 'a@b.com', password: 'short' });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('requires a non-empty password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true);
  });
});

describe('verifyEmailSchema', () => {
  it('requires a 6-digit OTP', () => {
    expect(verifyEmailSchema.safeParse({ email: 'a@b.com', otp: '123456' }).success).toBe(true);
    expect(verifyEmailSchema.safeParse({ email: 'a@b.com', otp: '12345' }).success).toBe(false);
    expect(verifyEmailSchema.safeParse({ email: 'a@b.com', otp: 'abcdef' }).success).toBe(false);
  });
});

describe('memberProfileSchema', () => {
  const valid = {
    fullName: 'Grace Mensah',
    dateOfBirth: '1990-01-01',
    gender: 'FEMALE',
    phoneNumber: '+233544053900',
    contactEmail: 'grace@example.com',
    city: 'Accra',
    address: '12 Ring Road',
    maritalStatus: 'SINGLE',
  };

  it('accepts a valid profile', () => {
    expect(memberProfileSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a missing full name / city / address', () => {
    expect(memberProfileSchema.safeParse({ ...valid, fullName: '' }).success).toBe(false);
    expect(memberProfileSchema.safeParse({ ...valid, city: '  ' }).success).toBe(false);
    expect(memberProfileSchema.safeParse({ ...valid, address: '' }).success).toBe(false);
  });

  it('rejects an invalid contact email and gender', () => {
    expect(memberProfileSchema.safeParse({ ...valid, contactEmail: 'nope' }).success).toBe(false);
    expect(memberProfileSchema.safeParse({ ...valid, gender: 'X' }).success).toBe(false);
  });

  it('keeps an optional occupation', () => {
    expect(memberProfileSchema.safeParse({ ...valid, occupation: 'Engineer' }).success).toBe(true);
  });
});

describe('churchRequestSchema (phone XOR email)', () => {
  const base = { churchName: 'Grace Chapel', city: 'Accra', leaderName: 'Pastor A' };

  it('accepts a phone contact only', () => {
    expect(
      churchRequestSchema.safeParse({ ...base, phoneContact: '+233544053900' }).success,
    ).toBe(true);
  });

  it('accepts an email contact only', () => {
    expect(
      churchRequestSchema.safeParse({ ...base, emailContact: 'a@b.com' }).success,
    ).toBe(true);
  });

  it('rejects neither phone nor email', () => {
    expect(churchRequestSchema.safeParse(base).success).toBe(false);
  });

  it('rejects both phone and email (XOR)', () => {
    expect(
      churchRequestSchema.safeParse({
        ...base,
        phoneContact: '+233544053900',
        emailContact: 'a@b.com',
      }).success,
    ).toBe(false);
  });
});
