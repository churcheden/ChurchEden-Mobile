export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'member' | 'volunteer' | 'leader' | 'pastor' | 'admin';
  campus: string;
  qrCodeUrl?: string;
  profileImageUrl?: string;
  membershipDate: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  serviceName: string;
  checkInTime: string;
  method: 'qr_scan' | 'manual_entry' | 'kiosk';
  campus: string;
}

export interface Donation {
  id: string;
  amount: number;
  currency: 'USD' | 'GHS' | 'NGN' | 'KES' | 'GBP' | 'EUR';
  category: 'Tithe' | 'Offering' | 'Building Fund' | 'Missions' | 'Special Seed';
  paymentGateway: 'Paystack' | 'Flutterwave' | 'Stripe' | 'Mobile Money (MoMo)';
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  transactionRef: string;
  isAnonymous: boolean;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  category: 'Sunday Service' | 'Midweek Service' | 'Youth' | 'Conference' | 'Outreach';
  bannerImageUrl?: string;
  isRSVPRequired: boolean;
  rsvpCount: number;
}

export interface SmallGroup {
  id: string;
  name: string;
  leaderName: string;
  meetingDay: string;
  meetingTime: string;
  location: string;
  category: 'Men' | 'Women' | 'Youth' | 'Couples' | 'Bible Study';
  memberCount: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  campus: string;
  avatarUrl?: string;
}

export interface Church {
  id: string;
  name: string;
  city?: string;
  region?: string;
  country?: string;
  address?: string;
  imageUrl?: string;
  iconType?: 'cross' | 'leaf' | 'bible' | 'heart' | 'mountain' | 'crown' | 'church';
  iconBgColor?: string;
  isRegistered: boolean;
  shortDescription?: string;
  description?: string;
  memberCount?: number;
  serviceCount?: number;
  serviceTimes?: string[];
  foundedYear?: number;
  expectations?: string[];
  estimatedApprovalTime?: string;
  distance?: string;
  isFavorite?: boolean;
  status?: 'active' | 'pending' | 'verified';
}

export interface ChurchJoinRequest {
  id: string;
  churchId: string;
  churchName: string;
  churchLocation?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  estimatedApprovalTime?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export type AnnouncementType = 'sermon' | 'community' | 'calendar' | 'general';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  type: AnnouncementType;
  date: string;
  author: string;
}

export interface NextService {
  dayLabel: string;
  dateLabel: string;
  time: string;
  location: string;
}

export interface MemberDashboardData {
  member: Member;
  church: Church;
  nextService: NextService | null;
  upcomingEvents: ChurchEvent[];
  recentAnnouncements: Announcement[];
  unreadNotificationCount: number;
}
