import { apiClient } from '../lib/apiClient';
import type { ChurchMembership as BackendMembership, AuthMeUser } from '../types/api';
import { Church, ChurchJoinRequest, ApiResponse } from '../types';

interface DirectoryChurch {
  id: string;
  name: string;
  denomination?: string;
  country: string;
  city: string;
  address: string;
  logoUrl?: string | null;
  createdAt?: string;
}

// Map the backend directory church into the local Church shape used by the UI.
const toChurch = (c: DirectoryChurch): Church => ({
  id: c.id,
  name: c.name,
  city: c.city,
  country: c.country,
  address: c.address,
  imageUrl: c.logoUrl ?? undefined,
  isRegistered: true,
  status: 'verified',
  description: c.denomination,
});

const meToJoinRequest = (u: AuthMeUser): ChurchJoinRequest => ({
  id: u.id,
  churchId: u.church?.id ?? '',
  churchName: u.church?.name ?? 'Your Church',
  churchLocation: u.church?.city ?? '',
  status: (u.status?.toLowerCase() as 'pending' | 'approved' | 'rejected') || 'pending',
  submittedAt: u.joinedAt || new Date().toISOString(),
  rejectionReason: undefined,
});

class ChurchService {
  private activeJoinRequest: ChurchJoinRequest | null = null;
  private favoriteIds: Set<string> = new Set();

  /**
   * Get all registered churches from GET /api/v1/churches
   */
  async getChurches(): Promise<ApiResponse<Church[]>> {
    try {
      const res = await apiClient.get<{ status: string; churches: DirectoryChurch[] }>('/churches');
      const churches = (res?.churches ?? []).map(toChurch);
      return { success: true, data: churches };
    } catch (err) {
      return { success: false, data: [], error: err instanceof Error ? err.message : 'Unable to load churches.' };
    }
  }

  /**
   * Search churches via GET /api/v1/churches?q=...
   */
  async searchChurches(query: string): Promise<ApiResponse<Church[]>> {
    const cleanQuery = query.trim();
    try {
      const res = await apiClient.get<{ status: string; churches: DirectoryChurch[] }>('/churches', {
        params: cleanQuery ? { q: cleanQuery } : undefined,
      });
      const churches = (res?.churches ?? []).map(toChurch);
      return { success: true, data: churches };
    } catch (err) {
      return { success: false, data: [], error: err instanceof Error ? err.message : 'Unable to load churches.' };
    }
  }

  /**
   * Get a church by ID from the live directory.
   */
  async getChurchById(id: string): Promise<ApiResponse<Church>> {
    try {
      const res = await apiClient.get<{ status: string; churches: DirectoryChurch[] }>('/churches');
      const found = (res?.churches ?? []).find((c) => c.id === id);
      if (!found) {
        return { success: false, data: null as unknown as Church, error: 'Church not found.' };
      }
      return { success: true, data: toChurch(found) };
    } catch (err) {
      return { success: false, data: null as unknown as Church, error: err instanceof Error ? err.message : 'Unable to load this church.' };
    }
  }

  /**
   * Submits a join request to POST /api/v1/join-requests
   */
  async requestToJoinChurch(churchId: string): Promise<ApiResponse<ChurchJoinRequest>> {
    try {
      const res = await apiClient.post<{ status: string; message?: string; member?: BackendMembership }>('/join-requests', { churchId });
      const backendRes = res?.member ?? (res as unknown as BackendMembership);
      const joinReq: ChurchJoinRequest = {
        id: backendRes.id || `req_${Date.now()}`,
        churchId,
        churchName: backendRes.church?.name || 'Your Church',
        churchLocation: backendRes.church?.city || '',
        status: (backendRes.status?.toLowerCase() as 'pending' | 'approved' | 'rejected') || 'pending',
        submittedAt: backendRes.joinedAt || new Date().toISOString(),
        rejectionReason: backendRes.rejectionReason || undefined,
      };
      this.activeJoinRequest = joinReq;
      return {
        success: true,
        data: joinReq,
        message: 'Join request successfully submitted to church administrators.',
      };
    } catch (err) {
      // No mock fallback — surface the real error so the UI can react.
      return {
        success: false,
        data: null as unknown as ChurchJoinRequest,
        error: err instanceof Error ? err.message : 'Could not submit your join request.',
      };
    }
  }

  /**
   * Check the member's join-request status from their /auth/me response.
   * A member belongs to at most one church, so the whole membership is read
   * from `user.status` + `user.church` (there is no memberships[] array).
   */
  async checkJoinRequestStatus(): Promise<ChurchJoinRequest | null> {
    try {
      const me = await apiClient.get<{ user?: AuthMeUser }>('/auth/me');
      const user = me?.user;
      if (!user?.church?.id) {
        return this.activeJoinRequest;
      }
      const req = meToJoinRequest(user);
      this.activeJoinRequest = req;
      return req;
    } catch {
      return this.activeJoinRequest;
    }
  }

  /**
   * Leave an APPROVED church via POST /api/v1/churches/:churchId/leave
   */
  async leaveChurch(churchId: string): Promise<ApiResponse<null>> {
    try {
      await apiClient.post(`/churches/${churchId}/leave`);
      this.activeJoinRequest = null;
      return { success: true, data: null };
    } catch (err) {
      return {
        success: false,
        data: null,
        error: err instanceof Error ? err.message : 'Could not leave this church.',
      };
    }
  }

  /**
   * Cancel a PENDING join request via POST /api/v1/join-requests/cancel
   */
  async cancelJoinRequest(membershipId: string): Promise<ApiResponse<null>> {
    try {
      await apiClient.post('/join-requests/cancel', { membershipId });
      this.activeJoinRequest = null;
      return { success: true, data: null };
    } catch (err) {
      return {
        success: false,
        data: null,
        error: err instanceof Error ? err.message : 'Could not cancel the request.',
      };
    }
  }

  getActiveJoinRequest(): ChurchJoinRequest | null {
    return this.activeJoinRequest;
  }

  clearActiveJoinRequest(): void {
    this.activeJoinRequest = null;
  }

  toggleFavorite(churchId: string): boolean {
    if (this.favoriteIds.has(churchId)) {
      this.favoriteIds.delete(churchId);
      return false;
    } else {
      this.favoriteIds.add(churchId);
      return true;
    }
  }

  isFavorite(churchId: string): boolean {
    return this.favoriteIds.has(churchId);
  }
}

export const churchService = new ChurchService();
export default churchService;
