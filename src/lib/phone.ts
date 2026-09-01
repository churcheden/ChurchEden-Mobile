// src/lib/phone.ts
// Shared, country-aware phone validation + E.164 normalization.
// Backed by libphonenumber-js (same library as the backend) so validation and
// normalization behavior is consistent across the mobile app and the API.
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

export interface PhoneCountry {
  iso: string;
  dialCode: string;
  name: string;
  flag: string;
}

// Regional indicator symbols turn an ISO-3166 alpha-2 code into a flag emoji.
// e.g. 'GH' -> '\u{1F1EC}\u{1F1ED}'
export function isoToFlag(iso: string): string {
  return String.fromCodePoint(
    ...[...iso.toUpperCase()].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65))
  );
}

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  GH: 'Ghana',
  NG: 'Nigeria',
  KE: 'Kenya',
  ZA: 'South Africa',
  CA: 'Canada',
  AU: 'Australia',
  IN: 'India',
  DE: 'Germany',
  FR: 'France',
  IT: 'Italy',
  ES: 'Spain',
  PT: 'Portugal',
  BR: 'Brazil',
  MX: 'Mexico',
  NL: 'Netherlands',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  IE: 'Ireland',
  JP: 'Japan',
  KR: 'South Korea',
  CN: 'China',
  SG: 'Singapore',
  MY: 'Malaysia',
  PH: 'Philippines',
  TH: 'Thailand',
  VN: 'Vietnam',
  ID: 'Indonesia',
  PK: 'Pakistan',
  BD: 'Bangladesh',
  LK: 'Sri Lanka',
  NP: 'Nepal',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  QA: 'Qatar',
  KW: 'Kuwait',
  IL: 'Israel',
  TR: 'Turkey',
  RU: 'Russia',
  UA: 'Ukraine',
  PL: 'Poland',
  CZ: 'Czech Republic',
  AT: 'Austria',
  CH: 'Switzerland',
  BE: 'Belgium',
  LU: 'Luxembourg',
  GR: 'Greece',
  RO: 'Romania',
  HU: 'Hungary',
  BG: 'Bulgaria',
  HR: 'Croatia',
  SI: 'Slovenia',
  SK: 'Slovakia',
  LT: 'Lithuania',
  LV: 'Latvia',
  EE: 'Estonia',
  CY: 'Cyprus',
  MT: 'Malta',
  IS: 'Iceland',
  AR: 'Argentina',
  CL: 'Chile',
  CO: 'Colombia',
  PE: 'Peru',
  VE: 'Venezuela',
  EC: 'Ecuador',
  BO: 'Bolivia',
  PY: 'Paraguay',
  UY: 'Uruguay',
  CR: 'Costa Rica',
  PA: 'Panama',
  GT: 'Guatemala',
  HN: 'Honduras',
  SV: 'El Salvador',
  NI: 'Nicaragua',
  CU: 'Cuba',
  DO: 'Dominican Republic',
  JM: 'Jamaica',
  TT: 'Trinidad and Tobago',
  TZ: 'Tanzania',
  UG: 'Uganda',
  RW: 'Rwanda',
  ET: 'Ethiopia',
  EG: 'Egypt',
  MA: 'Morocco',
  DZ: 'Algeria',
  TN: 'Tunisia',
  ZW: 'Zimbabwe',
  ZM: 'Zambia',
  MW: 'Malawi',
  CI: 'Cote d\'Ivoire',
  SN: 'Senegal',
  CM: 'Cameroon',
  PR: 'Puerto Rico',
  NZ: 'New Zealand',
  FJ: 'Fiji',
};

export function countryName(iso: string): string {
  return COUNTRY_NAMES[iso.toUpperCase()] ?? iso.toUpperCase();
}

export function buildCountries(): PhoneCountry[] {
  const result: PhoneCountry[] = [];
  for (const iso of getCountries()) {
    try {
      result.push({
        iso: iso as string,
        dialCode: `+${getCountryCallingCode(iso)}`,
        name: countryName(iso),
        flag: isoToFlag(iso),
      });
    } catch {
      // skip countries that fail to resolve a calling code
    }
  }
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

// Frequently used countries shown at the top of the picker for quick access.
const POPULAR = ['GH', 'US', 'GB', 'NG', 'KE', 'CA', 'AU', 'IN'];

export const COUNTRIES: PhoneCountry[] = buildCountries();

export function getCountry(iso: string): PhoneCountry | undefined {
  const code = iso.toUpperCase();
  return COUNTRIES.find((c) => c.iso === code);
}

export const DEFAULT_COUNTRY = 'GH';

export function popularCountries(): PhoneCountry[] {
  return POPULAR.map((iso) => getCountry(iso)).filter(
    (c): c is PhoneCountry => Boolean(c)
  );
}

/**
 * Parses a phone input against the selected country. Accepts both a local
 * format (e.g. 0544053900 or 544053900 in Ghana) and an international format
 * (e.g. +233 54 405 3900). Returns the parsed number or null when invalid.
 */
export function parsePhone(input: string, isoCountry: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    // If the user typed a leading '+', libphonenumber infers the country from
    // the country code; otherwise we parse as a national number for `isoCountry`
    // (which correctly strips the national prefix / leading 0).
    if (trimmed.startsWith('+')) {
      return parsePhoneNumberFromString(trimmed);
    }
    return parsePhoneNumberFromString(trimmed, isoCountry as never);
  } catch {
    return null;
  }
}

/**
 * Validates a phone number for the selected country. Returns an error message
 * when the number is genuinely invalid for that country, otherwise null.
 */
export function phoneError(input: string, isoCountry: string): string | null {
  const insig = input.replace(/[\s()-]/g, '');
  if (!insig) return null;
  if (!/^\+?[0-9]+$/.test(insig)) {
    return 'Enter a valid phone number.';
  }
  const parsed = parsePhone(input, isoCountry);
  if (!parsed) return 'Enter a valid phone number for this country.';
  // When the user supplies a '+'-prefixed number we intentionally ignore the
  // selected country (libphonenumber resolves it from the country code).
  if (!input.trim().startsWith('+') && parsed.country !== isoCountry.toUpperCase()) {
    return 'Enter a valid phone number for this country.';
  }
  if (!parsed.isValid()) {
    return 'Enter a valid phone number for this country.';
  }
  return null;
}

/**
 * Normalizes a phone number to E.164 for storage (e.g. +233544053900),
 * or returns null when it cannot be parsed / is invalid.
 */
export function normalizeToE164(input: string, isoCountry: string): string | null {
  const parsed = parsePhone(input, isoCountry);
  if (!parsed || !parsed.isValid()) return null;
  const e164 = parsed.format('E.164');
  return e164;
}

export function isPhoneValid(input: string, isoCountry: string): boolean {
  return normalizeToE164(input, isoCountry) !== null;
}
