// ChurchEden Client Validation Patterns & Helpers for Mobile
// Custom type-safe validators (zero-dependency / React Native compatible)

export const Validators = {
  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  },
  isValidPassword(password: string): boolean {
    return password.length >= 8;
  },
  isValidOtp(otp: string): boolean {
    return /^\d{6}$/.test(otp.trim());
  },
  isValidPhone(phone: string): boolean {
    return phone.trim().length >= 8;
  },
  isValid24hTime(time: string): boolean {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(time.trim());
  },
};

export interface FormErrorResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateLoginForm(values: { email?: string; password?: string }): FormErrorResult {
  const errors: Record<string, string> = {};
  if (!values.email || !Validators.isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.password || values.password.length === 0) {
    errors.password = 'Password is required.';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateRegisterForm(values: { email?: string; password?: string }): FormErrorResult {
  const errors: Record<string, string> = {};
  if (!values.email || !Validators.isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.password || !Validators.isValidPassword(values.password)) {
    errors.password = 'Password must be at least 8 characters.';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateOtpForm(values: { email?: string; otp?: string }): FormErrorResult {
  const errors: Record<string, string> = {};
  if (!values.email || !Validators.isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.otp || !Validators.isValidOtp(values.otp)) {
    errors.otp = 'OTP must be exactly 6 digits.';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}
