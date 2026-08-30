import { apiClient, AppError } from '../lib/apiClient';
import type { MemberProfile as BackendMemberProfile, Gender, MaritalStatus } from '../types/api';
import { Member, Church, ApiResponse } from '../types';
import { memberDashboardService } from './memberDashboardService';

export interface MemberProfile {
  member: Member | null;
  church: Church | null;
}

export interface ProfileOverview {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  campus: string;
  avatarUrl: string | null;
  membershipStatus: string;
  membershipDate: string;
  churchName: string;
  churchLocation: string;
}

export interface CompleteProfilePayload {
  fullName: string;
  dateOfBirth: string; // ISO string
  gender: string;
  phoneNumber: string;
  contactEmail: string;
  city: string;
  address: string;
  maritalStatus: string;
  occupation?: string;
  photoUri?: string;
}

function normalizeGender(g?: string): Gender {
  if (!g) return 'PREFER_NOT_TO_SAY';
  const clean = g.toUpperCase().replace(/\s+/g, '_');
  if (clean === 'MALE' || clean === 'FEMALE' || clean === 'PREFER_NOT_TO_SAY') return clean;
  return 'PREFER_NOT_TO_SAY';
}

function normalizeMaritalStatus(m?: string): MaritalStatus {
  if (!m) return 'PREFER_NOT_TO_SAY';
  const clean = m.toUpperCase().replace(/\s+/g, '_');
  if (clean === 'SINGLE' || clean === 'MARRIED' || clean === 'DIVORCED' || clean === 'WIDOWED' || clean === 'PREFER_NOT_TO_SAY') {
    return clean;
  }
  return 'PREFER_NOT_TO_SAY';
}

/**
 * Submits the complete profile payload to POST /api/v1/members/profile/complete
 */
export async function submitCompleteProfile(
  payload: CompleteProfilePayload
): Promise<ApiResponse<BackendMemberProfile>> {
  try {
    const formData = new FormData();
    formData.append('fullName', payload.fullName.trim());
    
    // Ensure dateOfBirth is full ISO format
    const dob = payload.dateOfBirth.includes('T')
      ? payload.dateOfBirth
      : new Date(payload.dateOfBirth).toISOString();
    formData.append('dateOfBirth', dob);
    
    formData.append('gender', normalizeGender(payload.gender));
    
    // Normalize phone number with '+' prefix if missing
    let phone = payload.phoneNumber.trim().replace(/[\s()-]/g, '');
    if (!phone.startsWith('+')) {
      phone = '+' + phone;
    }
    formData.append('phoneNumber', phone);
    
    formData.append('contactEmail', payload.contactEmail.trim().toLowerCase());
    formData.append('city', payload.city.trim());
    formData.append('address', (payload.address || payload.city).trim());
    formData.append('maritalStatus', normalizeMaritalStatus(payload.maritalStatus));
    
    if (payload.occupation?.trim()) {
      formData.append('occupation', payload.occupation.trim());
    }

    if (payload.photoUri) {
      const filename = payload.photoUri.split('/').pop() || 'photo.jpg';
      const match = /\.([a-zA-Z0-9]+)$/.exec(filename);
      const ext = match ? match[1].toLowerCase() : 'jpg';
      const type = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      
      formData.append('profilePhoto', {
        uri: payload.photoUri,
        name: filename,
        type,
      } as unknown as Blob);
    }

    const res = await apiClient.post<BackendMemberProfile>('/members/profile/complete', formData);
    return {
      success: true,
      data: res,
      message: 'Profile completed successfully!',
    };
  } catch (err) {
    const message = err instanceof AppError ? err.message : 'Could not complete profile. Please try again.';
    return {
      success: false,
      data: null as unknown as BackendMemberProfile,
      error: message,
    };
  }
}

/**
 * Loads member profile from GET /api/v1/members/profile with fallback
 */
export async function loadMemberProfile(
  userAvatarUrl?: string | null
): Promise<ApiResponse<MemberProfile>> {
  try {
    const backendProfile = await apiClient.get<BackendMemberProfile>('/members/profile');
    if (backendProfile) {
      const member: Member = {
        id: backendProfile.id,
        fullName: backendProfile.fullName,
        email: backendProfile.contactEmail,
        phone: backendProfile.phoneNumber,
        role: 'member',
        campus: backendProfile.city,
        profileImageUrl: backendProfile.profilePhotoUrl || userAvatarUrl || undefined,
        membershipDate: backendProfile.completedAt,
        status: 'active',
      };
      return {
        success: true,
        data: { member, church: null },
      };
    }
  } catch {
    // Graceful fallback to mock dashboard data if profile is not yet created
  }

  return {
    success: true,
    data: { member: null, church: null },
  };
}

export function toOverview(
  profile: MemberProfile,
  userAvatarUrl?: string | null
): ProfileOverview {
  return {
    fullName: profile.member?.fullName || 'Church Member',
    email: profile.member?.email || '',
    phone: profile.member?.phone || '',
    role: profile.member?.role || 'member',
    campus: profile.member?.campus || '',
    avatarUrl: userAvatarUrl || profile.member?.profileImageUrl || null,
    membershipStatus: profile.member?.status === 'active' ? 'Active Member' : 'Pending Approval',
    membershipDate: profile.member?.membershipDate || '',
    churchName: profile.church?.name || profile.member?.campus || '',
    churchLocation: profile.church?.city && profile.church?.country ? `${profile.church.city}, ${profile.church.country}` : '',
  };
}

export default {
  submitCompleteProfile,
  loadMemberProfile,
  toOverview,
};
