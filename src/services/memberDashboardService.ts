import {
  Announcement,
  Church,
  ChurchEvent,
  Member,
  MemberDashboardData,
  NextService,
  ApiResponse,
} from '../types';
import { apiClient } from '../lib/apiClient';

/**
 * Member dashboard data, conceptually sourced from backend endpoints such as:
 *   getCurrentMember()
 *   getCurrentChurch()
 *   getMembershipStatus()
 *   getNextService()
 *   getUpcomingEvents()
 *   getRecentAnnouncements()
 *   getNotificationSummary()
 *
 * Backed by realistic mock data with simulated network latency, mirroring the
 * existing repository pattern used across ChurchEden services.
 */

// Removed hardcoded CURRENT_CHURCH_ID — now read dynamically from selectedChurchStore

/**
 * Member dashboard data, conceptually sourced from backend endpoints such as:
 *   getCurrentMember()
 *   getCurrentChurch()
 *   getMembershipStatus()
 *   getNextService()
 *   getUpcomingEvents()
 *   getRecentAnnouncements()
 *   getNotificationSummary()
 *
 * Backed by realistic mock data with simulated network latency, mirroring the
 * existing repository pattern used across ChurchEden services.
 */
const MOCK_MEMBER: Member = {
  id: 'mbr_102',
  fullName: 'Tega Samuel',
  email: 'tega.samuel@example.com',
  phone: '+233 20 000 0000',
  role: 'member',
  campus: 'Ridge, Accra',
  profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  membershipDate: '2025-05-10T00:00:00.000Z',
  status: 'active',
};

const MOCK_UPCOMING_EVENTS: ChurchEvent[] = [
  {
    id: 'upcoming_1',
    title: 'Sunday Worship Service',
    description: 'Join us for worship and the Word.',
    location: 'Main Auditorium',
    startDate: '2026-09-01T09:00:00.000Z',
    endDate: '2026-09-01T12:00:00.000Z',
    category: 'Sunday Service',
    bannerImageUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1200&auto=format&fit=crop',
    isRSVPRequired: false,
    rsvpCount: 0,
  },
  {
    id: 'upcoming_2',
    title: 'Midweek Service',
    description: 'Midweek teaching and prayer.',
    location: 'Main Auditorium',
    startDate: '2026-09-03T18:30:00.000Z',
    endDate: '2026-09-03T20:30:00.000Z',
    category: 'Midweek Service',
    bannerImageUrl: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=1200&auto=format&fit=crop',
    isRSVPRequired: false,
    rsvpCount: 0,
  },
  {
    id: 'upcoming_3',
    title: 'Youth Fire Night',
    description: 'A vibrant gathering for young adults.',
    location: 'Youth Center',
    startDate: '2026-09-05T18:00:00.000Z',
    endDate: '2026-09-05T21:00:00.000Z',
    category: 'Youth',
    bannerImageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop',
    isRSVPRequired: true,
    rsvpCount: 185,
  },
  {
    id: 'upcoming_4',
    title: 'Kingdom Leadership Summit',
    description: 'Equipping leaders for extraordinary impact.',
    location: 'Conference Pavilion',
    startDate: '2026-09-13T08:30:00.000Z',
    endDate: '2026-09-13T16:00:00.000Z',
    category: 'Conference',
    bannerImageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
    isRSVPRequired: true,
    rsvpCount: 310,
  },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'New Sermon Series: Faith in Action',
    description: 'Join us each Sunday as we explore living out our faith in everyday life.',
    type: 'sermon',
    date: '2026-05-18T00:00:00.000Z',
    author: 'Pastor Daniel',
  },
  {
    id: 'ann_2',
    title: 'Volunteer Interest Gathering',
    description: 'Discover ways to serve across our Sunday teams and community outreach.',
    type: 'community',
    date: '2026-05-12T00:00:00.000Z',
    author: 'Church Office',
  },
  {
    id: 'ann_3',
    title: 'Youth Camp Save the Date',
    description: 'Mark your calendar for our annual youth camp coming up this summer.',
    type: 'calendar',
    date: '2026-05-05T00:00:00.000Z',
    author: 'Youth Team',
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class MemberDashboardService {
  async getCurrentMember(): Promise<ApiResponse<Member>> {
    await delay(300);
    return { success: true, data: { ...MOCK_MEMBER } };
  }

  async getCurrentChurch(): Promise<ApiResponse<Church>> {
    // Resolve the member's real church from their /auth/me response. A member
    // belongs to at most one church, exposed as `user.church` (single object).
    try {
      const me = await apiClient.get<{ user?: { church?: { id: string; name: string; logoUrl: string | null; city?: string | null } | null } }>('/auth/me');
      const church = me?.user?.church;

      if (church?.id && church?.name) {
        return {
          success: true,
          data: {
            id: church.id,
            name: church.name,
            imageUrl: church.logoUrl ?? undefined,
            city: church.city ?? undefined,
            isRegistered: true,
            status: 'verified',
          },
        };
      }

      return {
        success: false,
        data: null as unknown as Church,
        error: 'You are not a member of any church yet.',
      };
    } catch (err) {
      return {
        success: false,
        data: null as unknown as Church,
        error: err instanceof Error ? err.message : 'Unable to load your church.',
      };
    }
  }

  async getMembershipStatus(): Promise<ApiResponse<{ status: Member['status']; memberSince: string }>> {
    await delay(200);
    return {
      success: true,
      data: { status: MOCK_MEMBER.status, memberSince: MOCK_MEMBER.membershipDate },
    };
  }

  async getNextService(): Promise<ApiResponse<NextService>> {
    await delay(250);
    const next: NextService = {
      dayLabel: 'Sunday',
      dateLabel: 'Sep 06',
      time: '9:00 AM',
      location: 'Main Auditorium',
    };
    return { success: true, data: next };
  }

  async getUpcomingEvents(): Promise<ApiResponse<ChurchEvent[]>> {
    await delay(400);
    const now = Date.now();
    const upcoming = MOCK_UPCOMING_EVENTS.filter(
      (e) => new Date(e.startDate).getTime() >= now
    ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return { success: true, data: upcoming };
  }

  async getRecentAnnouncements(): Promise<ApiResponse<Announcement[]>> {
    await delay(350);
    const sorted = [...MOCK_ANNOUNCEMENTS].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return { success: true, data: sorted.slice(0, 2) };
  }

  async getNotificationSummary(): Promise<ApiResponse<{ unreadCount: number }>> {
    await delay(200);
    return { success: true, data: { unreadCount: 3 } };
  }

  async getDashboard(): Promise<ApiResponse<MemberDashboardData>> {
    await delay(450);

    const [memberRes, churchRes, nextServiceRes, eventsRes, announcementsRes, notificationsRes] =
      await Promise.all([
        this.getCurrentMember(),
        this.getCurrentChurch(),
        this.getNextService(),
        this.getUpcomingEvents(),
        this.getRecentAnnouncements(),
        this.getNotificationSummary(),
      ]);

    return {
      success: true,
      data: {
        member: memberRes.data,
        church: churchRes.data,
        nextService: nextServiceRes.success ? nextServiceRes.data : null,
        upcomingEvents: eventsRes.success ? eventsRes.data : [],
        recentAnnouncements: announcementsRes.success ? announcementsRes.data : [],
        unreadNotificationCount: notificationsRes.success ? notificationsRes.data.unreadCount : 0,
      },
    };
  }
}

export const memberDashboardService = new MemberDashboardService();
export default memberDashboardService;
