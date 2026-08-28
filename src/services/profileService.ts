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

function statusLabel(status: Member['status'] | undefined): string {
  switch (status) {
    case 'active':
      return 'Active Member';
    case 'pending':
      return 'Pending Approval';
    case 'inactive':
      return 'Inactive';
    default:
      return 'Visitor';
  }
}

function normalize(member: Member | null, church: Church | null, userAvatarUrl?: string | null): ProfileOverview {
  return {
    fullName: member?.fullName || 'Church Member',
    email: member?.email || '',
    phone: member?.phone || '',
    role: member?.role || 'member',
    campus: member?.campus || church?.name || '',
    avatarUrl: userAvatarUrl || member?.profileImageUrl || null,
    membershipStatus: statusLabel(member?.status),
    membershipDate: member?.membershipDate || '',
    churchName: church?.name || member?.campus || '',
    churchLocation:
      church?.city && church?.country ? `${church.city}, ${church.country}` : '', 
  };
}

/**
 * Loads the member's unified profile data (member + church).
 * Avatar is taken from the authenticated session when available.
 */
export async function loadMemberProfile(
  userAvatarUrl?: string | null
): Promise<ApiResponse<MemberProfile>> {
  const [memberRes, churchRes] = await Promise.all([
    memberDashboardService.getCurrentMember(),
    memberDashboardService.getCurrentChurch(),
  ]);

  if (!memberRes.success) {
    return {
      success: false,
      data: { member: null, church: null },
      error: memberRes.error,
    };
  }

  return {
    success: true,
    data: {
      member: memberRes.data,
      church: churchRes.success ? churchRes.data : null,
    },
  };
}

export function toOverview(
  profile: MemberProfile,
  userAvatarUrl?: string | null
): ProfileOverview {
  return normalize(profile.member, profile.church, userAvatarUrl);
}

export default {
  loadMemberProfile,
  toOverview,
};
