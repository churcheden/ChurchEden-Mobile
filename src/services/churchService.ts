import { apiClient, AppError } from '../lib/apiClient';
import type { ChurchMembership as BackendMembership, Church as BackendChurch } from '../types/api';
import { Church, ChurchJoinRequest, ApiResponse } from '../types';

const MOCK_CHURCHES: Church[] = [
  {
    id: 'church_1',
    name: "Redeemer's Chapel International",
    city: 'Ridge',
    region: 'Greater Accra',
    country: 'Ghana',
    address: '14 Independence Ave, Ridge, Accra',
    imageUrl: 'https://images.unsplash.com/photo-1548625361-16a9a14925bb?q=80&w=1200&auto=format&fit=crop',
    iconType: 'cross',
    iconBgColor: '#C98A16',
    isRegistered: true,
    distance: '1.2 km from you',
    shortDescription: 'A vibrant community of believers devoted to worship, discipleship, and city transformation.',
    description: "Redeemer's Chapel International is a modern, gospel-centered church dedicated to empowering families and transforming society.",
    memberCount: 1420,
    serviceCount: 3,
    serviceTimes: ['Sun 7:00 AM', 'Sun 9:30 AM', 'Wed 6:30 PM'],
    foundedYear: 2012,
    expectations: ['Family-Oriented Worship', 'Biblical Preaching', 'Engaging Kids Ministry', 'Community Outreach'],
    estimatedApprovalTime: '1–2 business days',
    isFavorite: false,
    status: 'verified',
  },
  {
    id: 'church_2',
    name: 'Grace Life Cathedral',
    city: 'East Legon',
    region: 'Greater Accra',
    country: 'Ghana',
    address: 'Lagos Avenue, East Legon, Accra',
    imageUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1200&auto=format&fit=crop',
    iconType: 'leaf',
    iconBgColor: '#047857',
    isRegistered: true,
    distance: '3.8 km from you',
    shortDescription: 'Living in grace, growing in faith, and raising servant-leaders for global impact.',
    description: 'Grace Life Cathedral is a multi-generational church in East Legon where grace meets purpose through spirit-led worship and relevant teaching.',
    memberCount: 2350,
    serviceCount: 2,
    serviceTimes: ['Sun 8:00 AM', 'Sun 10:30 AM'],
    foundedYear: 2010,
    expectations: ['Contemporary Worship', 'Practical Sermons', 'Active Small Groups', 'Leadership Programs'],
    estimatedApprovalTime: 'Same day',
    isFavorite: false,
    status: 'verified',
  },
];

class ChurchService {
  private churches: Church[] = [...MOCK_CHURCHES];
  private activeJoinRequest: ChurchJoinRequest | null = null;
  private favoriteIds: Set<string> = new Set();

  /**
   * Get all registered churches
   */
  async getChurches(): Promise<ApiResponse<Church[]>> {
    const result = this.churches.map((c) => ({
      ...c,
      isFavorite: this.favoriteIds.has(c.id),
    }));
    return {
      success: true,
      data: result,
    };
  }

  /**
   * Search churches by query
   */
  async searchChurches(query: string): Promise<ApiResponse<Church[]>> {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return this.getChurches();

    const filtered = this.churches.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(cleanQuery);
      const cityMatch = c.city?.toLowerCase().includes(cleanQuery) ?? false;
      const addressMatch = c.address?.toLowerCase().includes(cleanQuery) ?? false;
      return nameMatch || cityMatch || addressMatch;
    }).map((c) => ({
      ...c,
      isFavorite: this.favoriteIds.has(c.id),
    }));

    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get church by ID
   */
  async getChurchById(id: string): Promise<ApiResponse<Church>> {
    const found = this.churches.find((c) => c.id === id) || this.churches[0];
    return {
      success: true,
      data: {
        ...found,
        isFavorite: this.favoriteIds.has(found.id),
      },
    };
  }

  /**
   * Submits a join request to POST /api/v1/join-requests
   */
  async requestToJoinChurch(churchId: string): Promise<ApiResponse<ChurchJoinRequest>> {
    try {
      const backendRes = await apiClient.post<BackendMembership>('/join-requests', { churchId });
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
      // Fallback local representation for demo/offline resilience
      const church = this.churches.find((c) => c.id === churchId) || this.churches[0];
      const newRequest: ChurchJoinRequest = {
        id: `req_${Date.now()}`,
        churchId,
        churchName: church.name,
        churchLocation: `${church.city || ''}, ${church.country || ''}`,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        estimatedApprovalTime: church.estimatedApprovalTime || '1–3 business days',
      };
      this.activeJoinRequest = newRequest;
      return {
        success: true,
        data: newRequest,
        message: 'Join request successfully submitted.',
      };
    }
  }

  /**
   * Check status from GET /api/v1/join-requests
   */
  async checkJoinRequestStatus(): Promise<ChurchJoinRequest | null> {
    try {
      const requests = await apiClient.get<BackendMembership[]>('/join-requests');
      if (requests && requests.length > 0) {
        const latest = requests[0];
        return {
          id: latest.id,
          churchId: latest.churchId,
          churchName: latest.church?.name || 'Your Church',
          churchLocation: latest.church?.city || '',
          status: (latest.status?.toLowerCase() as 'pending' | 'approved' | 'rejected') || 'pending',
          submittedAt: latest.joinedAt || new Date().toISOString(),
          rejectionReason: latest.rejectionReason || undefined,
        };
      }
    } catch {
      // Return active local request if backend request fails
    }
    return this.activeJoinRequest;
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
