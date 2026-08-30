// src/lib/queryKeys.ts
import type { MembershipStatus } from '../types/api';

export const queryKeys = {
  user: () => ['user'] as const,
  onboardingDraft: () => ['onboarding', 'draft'] as const,
  memberProfile: () => ['members', 'profile'] as const,
  joinRequests: (filters?: { status?: MembershipStatus; churchId?: string }) =>
    ['join-requests', filters ?? {}] as const,
};
