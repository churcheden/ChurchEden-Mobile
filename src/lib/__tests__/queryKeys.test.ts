import { describe, expect, it } from 'vitest';
import { queryKeys } from '@/lib/queryKeys';

describe('queryKeys', () => {
  it('returns stable keys for user/onboarding/profile', () => {
    expect(queryKeys.user()).toEqual(['user']);
    expect(queryKeys.onboardingDraft()).toEqual(['onboarding', 'draft']);
    expect(queryKeys.memberProfile()).toEqual(['members', 'profile']);
  });

  it('builds a join-requests key with no filters', () => {
    expect(queryKeys.joinRequests()).toEqual(['join-requests', {}]);
  });

  it('includes a filter when provided', () => {
    expect(queryKeys.joinRequests({ status: 'APPROVED' })).toEqual([
      'join-requests',
      { status: 'APPROVED' },
    ]);
  });
});
