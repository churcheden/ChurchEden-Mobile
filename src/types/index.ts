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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
