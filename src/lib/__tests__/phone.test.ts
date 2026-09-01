import { describe, expect, it } from 'vitest';
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  getCountry,
  isPhoneValid,
  normalizeToE164,
  phoneError,
  popularCountries,
  countryName,
  isoToFlag,
} from '@/lib/phone';

describe('phone validation (country-aware)', () => {
  it('defaults to Ghana', () => {
    expect(DEFAULT_COUNTRY).toBe('GH');
  });

  it('GH is present in the country list and popular list', () => {
    expect(getCountry('GH')?.iso).toBe('GH');
    expect(getCountry('gh')?.iso).toBe('GH'); // case-insensitive
    expect(COUNTRIES.length).toBeGreaterThan(200);
    const popular = popularCountries().map((c) => c.iso);
    expect(popular).toContain('GH');
    expect(popular).toContain('US');
    expect(popular).toContain('GB');
  });

  it('builds a deterministic, sorted country list', () => {
    const isSorted = COUNTRIES.every(
      (c, i) => i === 0 || COUNTRIES[i - 1].name.localeCompare(c.name) <= 0,
    );
    expect(isSorted).toBe(true);
  });

  describe('isoToFlag / countryName', () => {
    it('maps an ISO code to its flag emoji', () => {
      expect(isoToFlag('GH')).toBe('\u{1F1EC}\u{1F1ED}');
      expect(isoToFlag('US')).toBe('\u{1F1FA}\u{1F1F8}');
    });

    it('returns the pretty country name or falls back to the uppercased ISO', () => {
      expect(countryName('gh')).toBe('Ghana');
      expect(countryName('XX')).toBe('XX');
    });
  });

  describe('Ghana (GH)', () => {
    it('accepts local format with and without leading 0', () => {
      expect(normalizeToE164('0544053900', 'GH')).toBe('+233544053900');
      expect(normalizeToE164('544053900', 'GH')).toBe('+233544053900');
    });

    it('accepts international format', () => {
      expect(normalizeToE164('+233 54 405 3900', 'GH')).toBe('+233544053900');
      expect(phoneError('+233544053900', 'US')).toBeNull();
    });

    it('returns no error for a valid GH number', () => {
      expect(phoneError('0544053900', 'GH')).toBeNull();
    });

    it('is valid', () => {
      expect(isPhoneValid('0544053900', 'GH')).toBe(true);
    });
  });

  describe('United States (US)', () => {
    it('normalizes a national number', () => {
      expect(normalizeToE164('(415) 555-1234', 'US')).toBe('+14155551234');
      expect(normalizeToE164('4155551234', 'US')).toBe('+14155551234');
    });

    it('normalizes an international number', () => {
      expect(normalizeToE164('+1 415 555 1234', 'US')).toBe('+14155551234');
    });
  });

  describe('United Kingdom (GB)', () => {
    it('normalizes a national landline (strips the leading 0)', () => {
      expect(normalizeToE164('020 7946 0958', 'GB')).toBe('+442079460958');
    });

    it('normalizes an international number', () => {
      expect(normalizeToE164('+44 20 7946 0958', 'GB')).toBe('+442079460958');
    });
  });

  describe('invalid / edge cases', () => {
    it('rejects a number from the wrong country when no leading +', () => {
      // A US number typed while the selected country is Ghana must be rejected.
      expect(phoneError('4155551234', 'GH')).toBe(
        'Enter a valid phone number for this country.',
      );
    });

    it('rejects garbage input', () => {
      expect(phoneError('abc123', 'GH')).toBe('Enter a valid phone number.');
      expect(phoneError('12a4', 'GH')).toBe('Enter a valid phone number.');
    });

    it('returns null for empty / whitespace input', () => {
      expect(phoneError('', 'GH')).toBeNull();
      expect(phoneError('   ', 'GH')).toBeNull();
      expect(phoneError('( ) -', 'GH')).toBeNull();
    });

    it('returns null normalize for an invalid number', () => {
      expect(normalizeToE164('12345', 'US')).toBeNull();
      expect(isPhoneValid('12345', 'US')).toBe(false);
    });
  });
});
