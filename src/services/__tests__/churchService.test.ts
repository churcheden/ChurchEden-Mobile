import { beforeEach, describe, expect, it, vi } from 'vitest';
import { churchService } from '@/services/churchService';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    get: mocks.get,
    post: mocks.post,
  },
}));

beforeEach(() => {
  mocks.get.mockReset();
  mocks.post.mockReset();
  churchService.clearActiveJoinRequest();
});

describe('churchService.getChurches', () => {
  it('maps the backend directory into the local Church shape', async () => {
    mocks.get.mockResolvedValue({
      status: 'success',
      churches: [{ id: 'c1', name: 'Grace', city: 'Accra', country: 'GH', address: 'Ring Rd' }],
    });

    const res = await churchService.getChurches();
    expect(res.success).toBe(true);
    expect(res.data).toEqual([
      {
        id: 'c1',
        name: 'Grace',
        city: 'Accra',
        country: 'GH',
        address: 'Ring Rd',
        imageUrl: undefined,
        isRegistered: true,
        status: 'verified',
        description: undefined,
      },
    ]);
    expect(mocks.get).toHaveBeenCalledWith('/churches');
  });

  it('returns an empty list on error', async () => {
    mocks.get.mockRejectedValue(new Error('network down'));
    const res = await churchService.getChurches();
    expect(res.success).toBe(false);
    expect(res.data).toEqual([]);
    expect(res.error).toBe('network down');
  });
});

describe('churchService.searchChurches', () => {
  it('passes the query as a q param', async () => {
    mocks.get.mockResolvedValue({ status: 'success', churches: [] });
    await churchService.searchChurches('  Accra  ');
    expect(mocks.get).toHaveBeenCalledWith('/churches', { params: { q: 'Accra' } });
  });

  it('omits the q param when the query is empty', async () => {
    mocks.get.mockResolvedValue({ status: 'success', churches: [] });
    await churchService.searchChurches('   ');
    expect(mocks.get).toHaveBeenCalledWith('/churches', { params: undefined });
  });
});

describe('churchService.requestToJoinChurch', () => {
  it('submits a join request and tracks it as active', async () => {
    mocks.post.mockResolvedValue({
      id: 'm1',
      church: { id: 'c1', name: 'Grace', city: 'Accra' },
      status: 'PENDING',
      joinedAt: '2026-01-01T00:00:00Z',
    });

    const res = await churchService.requestToJoinChurch('c1');
    expect(res.success).toBe(true);
    expect(res.data?.churchId).toBe('c1');
    expect(churchService.getActiveJoinRequest()?.id).toBe('m1');
    expect(mocks.post).toHaveBeenCalledWith('/join-requests', { churchId: 'c1' });
  });

  it('surfaces the error without a mock fallback', async () => {
    mocks.post.mockRejectedValue(new Error('forbidden'));
    const res = await churchService.requestToJoinChurch('c1');
    expect(res.success).toBe(false);
    expect(res.error).toBe('forbidden');
  });
});

describe('churchService.checkJoinRequestStatus', () => {
  it('picks the most recent membership from /auth/me', async () => {
    mocks.get.mockResolvedValue({
      user: {
        memberships: [
          { id: 'old', church: { id: 'c1', name: 'Old', city: 'X' }, status: 'APPROVED', joinedAt: '2020-01-01' },
          { id: 'new', church: { id: 'c2', name: 'New', city: 'Y' }, status: 'PENDING', joinedAt: '2026-01-01' },
        ],
      },
    });

    const req = await churchService.checkJoinRequestStatus();
    expect(req?.id).toBe('new');
  });

  it('falls back to the active request when there are no memberships', async () => {
    mocks.get.mockResolvedValue({ user: { memberships: [] } });
    mocks.post.mockResolvedValue({ id: 'm9', church: { id: 'c9', name: 'Nine' }, status: 'PENDING' });
    await churchService.requestToJoinChurch('c9');

    const req = await churchService.checkJoinRequestStatus();
    expect(req?.id).toBe('m9');
  });

  it('returns the active request when /auth/me fails', async () => {
    mocks.get.mockRejectedValue(new Error('offline'));
    churchService.clearActiveJoinRequest();
    const req = await churchService.checkJoinRequestStatus();
    expect(req).toBeNull();
  });
});

describe('churchService.leaveChurch', () => {
  it('POSTs to /churches/:id/leave and clears the active request on success', async () => {
    mocks.get.mockResolvedValue({ user: { memberships: [{ id: 'm1', church: null, status: 'APPROVED', joinedAt: '2026' }] } });
    await churchService.checkJoinRequestStatus(); // set an active request

    mocks.post.mockResolvedValue({});
    const res = await churchService.leaveChurch('c1');
    expect(res.success).toBe(true);
    expect(mocks.post).toHaveBeenCalledWith('/churches/c1/leave');
    expect(churchService.getActiveJoinRequest()).toBeNull();
  });

  it('returns an error on failure', async () => {
    mocks.post.mockRejectedValue(new Error('cannot leave'));
    const res = await churchService.leaveChurch('c1');
    expect(res.success).toBe(false);
    expect(res.error).toBe('cannot leave');
  });
});

describe('churchService.cancelJoinRequest', () => {
  it('POSTs to /join-requests/cancel with the membershipId', async () => {
    mocks.post.mockResolvedValue({});
    const res = await churchService.cancelJoinRequest('m1');
    expect(res.success).toBe(true);
    expect(mocks.post).toHaveBeenCalledWith('/join-requests/cancel', { membershipId: 'm1' });
  });

  it('returns an error on failure', async () => {
    mocks.post.mockRejectedValue(new Error('nope'));
    const res = await churchService.cancelJoinRequest('m1');
    expect(res.success).toBe(false);
    expect(res.error).toBe('nope');
  });
});

describe('churchService favorites', () => {
  it('toggles and reports favorites', () => {
    expect(churchService.isFavorite('c1')).toBe(false);
    expect(churchService.toggleFavorite('c1')).toBe(true);
    expect(churchService.isFavorite('c1')).toBe(true);
    expect(churchService.toggleFavorite('c1')).toBe(false);
    expect(churchService.isFavorite('c1')).toBe(false);
  });
});
