// src/lib/schemas.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const verifyEmailSchema = z.object({
  email: z.string().email('Enter a valid email'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export const step1Schema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(60),
  lastName: z.string().trim().min(1, 'Last name is required').max(60),
  churchName: z.string().trim().min(1, 'Church name is required').max(150),
  denomination: z.string().trim().min(1, 'Denomination is required').max(100),
  congregationSize: z.enum([
    'RANGE_1_100',
    'RANGE_101_500',
    'RANGE_501_1000',
    'RANGE_1001_2000',
    'RANGE_2000_PLUS',
  ]),
  foundedYear: z.coerce.number().int().min(1500).max(new Date().getFullYear()).optional(),
});

export const step2Schema = z.object({
  country: z.string().trim().min(1, 'Country is required'),
  city: z.string().trim().min(1, 'City is required').max(100),
  address: z.string().trim().min(1, 'Address is required').max(255),
  phone: z.string().trim().min(1, 'Phone is required'),
  email: z.string().email('Enter a valid email').max(255),
  primaryLanguage: z.enum(['ENGLISH', 'FRENCH', 'SPANISH']),
  timeZone: z.string().min(1, 'Time zone is required'),
});

export const serviceTimeSchema = z.object({
  label: z.string().trim().min(1, 'Label is required').max(60),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format must be HH:MM'),
});

export const customMinistryItemSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  type: z.enum(['MINISTRY', 'DEPARTMENT']),
  description: z.string().trim().max(255).optional(),
  icon: z.string().optional(),
});

export const step4Schema = z.object({
  ministryIds: z.array(z.string()).default([]),
  customMinistries: z.array(customMinistryItemSchema).default([]),
});

export const memberProfileSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(120),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'PREFER_NOT_TO_SAY']),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  contactEmail: z.string().email('Enter a valid email').max(255),
  city: z.string().trim().min(1, 'City is required').max(100),
  address: z.string().trim().min(1, 'Address is required').max(255),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'PREFER_NOT_TO_SAY']),
  occupation: z.string().trim().max(100).optional(),
});

export const joinRequestSchema = z.object({
  churchId: z.string().min(1, 'Church ID is required'),
});

export const approveJoinRequestSchema = z.object({
  membershipId: z.string().min(1, 'Membership ID is required'),
});

export const rejectMemberSchema = z.object({
  membershipId: z.string().min(1, 'Membership ID is required'),
  rejectionReason: z.string().trim().max(500, 'Rejection reason must be 500 characters or less.').optional(),
});

export const banMemberSchema = z.object({
  membershipId: z.string().min(1, 'Membership ID is required'),
  banReason: z.string().trim().max(500, 'Ban reason must be 500 characters or less.').optional(),
});

export const unbanMemberSchema = z.object({
  membershipId: z.string().min(1, 'Membership ID is required'),
});

export const churchRequestSchema = z.object({
  churchName: z.string().trim().min(1, 'Church name is required').max(150),
  city: z.string().trim().min(1, 'City is required').max(100),
  leaderName: z.string().trim().min(1, 'Leader name is required').max(100),
  phoneContact: z.string().trim().max(20).optional(),
  emailContact: z.string().email('Enter a valid email').max(255).optional(),
}).refine(
  (data) => {
    const hasPhone = !!data.phoneContact && data.phoneContact.length > 0;
    const hasEmail = !!data.emailContact && data.emailContact.length > 0;
    return hasPhone !== hasEmail; // XOR: exactly one must be present
  },
  { message: 'Provide either a phone number or an email — not both, and not neither.', path: ['phoneContact'] }
);

export const ChurchRequestFormSchema = churchRequestSchema;
