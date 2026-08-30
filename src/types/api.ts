// src/types/api.ts
// Derived from prisma/schema.prisma & backend routes

export type LoginProvider = 'EMAIL' | 'GOOGLE';
export type Gender = 'MALE' | 'FEMALE' | 'PREFER_NOT_TO_SAY';
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'PREFER_NOT_TO_SAY';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING';
export type ChurchRole = 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';
export type MembershipStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type CongregationSize =
  | 'RANGE_1_100'
  | 'RANGE_101_500'
  | 'RANGE_501_1000'
  | 'RANGE_1001_2000'
  | 'RANGE_2000_PLUS';
export type ChurchLanguage = 'ENGLISH' | 'FRENCH' | 'SPANISH';
export type MinistryType = 'MINISTRY' | 'DEPARTMENT';

export interface ApiResponse<T> {
  status: 'success';
  data: T;
}

export interface ClientErrorResponse {
  status: 'error';
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ServerErrorResponse {
  status: 'fail';
  error: string;
  message?: string;
}

export type ClientError = ClientErrorResponse;
export type ServerError = ServerErrorResponse;
export type ApiErrorShape = ClientErrorResponse | ServerErrorResponse;

export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  role?: ChurchRole | string;
  googleId?: string | null;
  loginProvider: LoginProvider;
  isVerified: boolean;
  isPremium?: boolean;
  premiumSince?: string | null;
  premiumExpiry?: string | null;
  subscriptionProcessor?: string | null;
  subscriptionRef?: string | null;
  subscriptionStatus?: SubscriptionStatus | null;
  avatarUrl?: string | null;
  campus?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceTime {
  id?: string;
  churchId?: string;
  label: string;
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  time: string; // "HH:MM"
  createdAt?: string;
}

export interface CustomMinistry {
  name: string;
  type: MinistryType;
  description?: string;
  icon?: string;
}

export interface ChurchMinistry {
  id: string;
  churchId: string;
  name: string;
  type: 'MINISTRY' | 'DEPARTMENT';
  description?: string | null;
  icon?: string | null;
  isCustom: boolean;
  isActive: boolean;
}

export interface MemberProfile {
  id: string;
  userId?: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  contactEmail: string;
  city: string;
  address: string;
  maritalStatus: MaritalStatus;
  occupation?: string | null;
  profilePhotoUrl?: string | null;
  completedAt?: string;
  updatedAt?: string;
}

export interface Church {
  id: string;
  name: string;
  denomination: string;
  congregationSize: CongregationSize;
  foundedYear?: number | null;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  primaryLanguage: ChurchLanguage;
  timeZone: string;
  logoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  churchId: string;
  userId: string;
  status: MembershipStatus;
  role: ChurchRole;
  rejectionReason?: string | null;
  isBanned?: boolean;
  bannedAt?: string | null;
  banReason?: string | null;
  joinedAt?: string;
  church?: Church;
  user?: User;
}

export type ChurchMembership = Membership;

export interface ChurchRequest {
  id: string;
  churchName: string;
  city: string;
  leaderName: string;
  phoneContact?: string | null;
  emailContact?: string | null;
  requestedById?: string;
  createdAt?: string;
}

export type ChurchRequestForm = {
  churchName: string;
  city: string;
  leaderName: string;
  phoneContact?: string;
  emailContact?: string;
};

export type ChurchRequestFormValues = ChurchRequestForm;

export interface ChurchOnboardingDraft {
  firstName?: string;
  lastName?: string;
  churchName?: string;
  denomination?: string;
  congregationSize?: CongregationSize;
  foundedYear?: number;
  country?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  primaryLanguage?: ChurchLanguage;
  timeZone?: string;
  serviceTimes?: Array<{ label: string; dayOfWeek: number; time: string }>;
  logoUrl?: string;
  ministryIds?: string[];
  customMinistries?: CustomMinistry[];
}

export interface AuthSuccessResponse {
  status: 'success';
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: User;
  };
  user?: User;
}

export interface TokenRefreshResponse {
  status: 'success';
  accessToken?: string;
  refreshToken?: string;
  data?: {
    accessToken?: string;
    newAccessToken?: string;
    refreshToken?: string;
    newRefreshToken?: string;
  };
}
