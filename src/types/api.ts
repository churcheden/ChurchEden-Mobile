// ChurchEden Unified API & Domain Types
// Generated from prisma/schema.prisma & backend routes

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

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  googleId?: string | null;
  loginProvider: LoginProvider;
  isVerified: boolean;
  isPremium: boolean;
  premiumSince?: string | null;
  premiumExpiry?: string | null;
  subscriptionProcessor?: string | null;
  subscriptionRef?: string | null;
  subscriptionStatus?: SubscriptionStatus | null;
  createdAt: string;
  updatedAt: string;
}

export interface MemberProfile {
  id: string;
  userId: string;
  profilePhotoUrl?: string | null;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  contactEmail: string;
  city: string;
  address: string;
  maritalStatus: MaritalStatus;
  occupation?: string | null;
  completedAt: string;
  updatedAt: string;
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

export interface ServiceTime {
  id: string;
  churchId: string;
  label: string;
  dayOfWeek: number;
  time: string;
  createdAt: string;
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

export interface ChurchMembership {
  id: string;
  userId: string;
  churchId: string;
  role: ChurchRole;
  status: MembershipStatus;
  rejectionReason?: string | null;
  joinedAt: string;
  church?: Church;
  user?: User;
}

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
  customMinistries?: Array<{
    name: string;
    type: 'MINISTRY' | 'DEPARTMENT';
    description?: string;
    icon?: string;
  }>;
}

export interface ClientError {
  status: 'error';
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ServerError {
  status: 'fail';
  error: string;
  message?: string;
}

export type ApiErrorShape = ClientError | ServerError;

export interface AuthSuccessResponse {
  status: 'success';
  message: string;
  accessToken: string;
  refreshToken?: string;
  user: Pick<User, 'id' | 'email' | 'fullName' | 'isVerified' | 'loginProvider'>;
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
