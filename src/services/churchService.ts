import { Church, ChurchJoinRequest, ApiResponse } from '../types';
import api from './api';

// Realistic Church Development Dataset
const MOCK_CHURCHES: Church[] = [
  {
    id: 'church_1',
    name: 'Grace Community Church',
    city: 'Accra',
    region: 'Greater Accra',
    country: 'Ghana',
    address: '14 Independence Avenue, Ridge, Accra',
    imageUrl: 'https://images.unsplash.com/photo-1548625361-195fe57876a3?q=80&w=1200&auto=format&fit=crop',
    iconType: 'church',
    iconBgColor: '#07182F', // Deep Navy
    isRegistered: true,
    distance: '1.2 km from you',
    shortDescription: 'A loving community passionate about helping people experience God’s grace and grow in their faith. Everyone is welcome here.',
    description: 'Grace Community Church exists to help people know God, find freedom, discover purpose, and make a difference. We believe church is more than a place — it’s a family.\n\nWe are a Bible-believing church with a heart for our city and the world. Join us this Sunday for inspiring worship, biblical teaching, and genuine community!',
    memberCount: 1248,
    serviceCount: 3,
    serviceTimes: ['Sun 8:00 AM', 'Sun 10:30 AM', 'Wed 6:30 PM'],
    foundedYear: 2012,
    expectations: ['Friendly Community', 'Biblical Teaching', 'Worship Music', 'Children’s Ministry'],
    estimatedApprovalTime: '1–3 business days',
    isFavorite: false,
    status: 'verified',
  },
  {
    id: 'church_2',
    name: 'The Hope Fellowship',
    city: 'East Legon',
    region: 'Greater Accra',
    country: 'Ghana',
    address: 'Bawaleshie Rd, East Legon, Accra',
    imageUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1200&auto=format&fit=crop',
    iconType: 'leaf',
    iconBgColor: '#365314', // Olive/Green
    isRegistered: true,
    distance: '3.5 km from you',
    shortDescription: 'Empowering believers to live out their God-given destiny with hope, compassion, and purpose.',
    description: 'The Hope Fellowship is a vibrant, contemporary Christian assembly located in the heart of East Legon. Our mission is to restore hope, equip disciples, and raise leaders that influence culture for Christ.',
    memberCount: 860,
    serviceCount: 2,
    serviceTimes: ['Sun 9:00 AM', 'Sun 11:30 AM'],
    foundedYear: 2016,
    expectations: ['Contemporary Worship', 'Youth & Young Adults', 'Small Groups', 'Community Outreach'],
    estimatedApprovalTime: '24–48 hours',
    isFavorite: false,
    status: 'verified',
  },
  {
    id: 'church_3',
    name: 'Living Water Church',
    city: 'Tema',
    region: 'Greater Accra',
    country: 'Ghana',
    address: 'Community 6, Near Central Hospital, Tema',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1200&auto=format&fit=crop',
    iconType: 'bible',
    iconBgColor: '#9A6700', // Gold/Amber
    isRegistered: true,
    distance: '8.1 km from you',
    shortDescription: 'Experiencing the fresh power of the Holy Spirit and deepening our walk in the Word.',
    description: 'Living Water Church provides a spiritual oasis for seekers and believers in the harbor city of Tema. We emphasize spirit-filled prayer, sound scriptural exposition, and caring fellowship.',
    memberCount: 620,
    serviceCount: 2,
    serviceTimes: ['Sun 8:30 AM', 'Wed 6:00 PM'],
    foundedYear: 2014,
    expectations: ['Spirit-filled Worship', 'Intercessory Prayer', 'Family Care', 'Bible Foundations'],
    estimatedApprovalTime: '1–2 business days',
    isFavorite: false,
    status: 'verified',
  },
  {
    id: 'church_4',
    name: 'New Life Church',
    city: 'Spintex',
    region: 'Greater Accra',
    country: 'Ghana',
    address: 'Spintex Road, Junction Mall Vicinity, Accra',
    imageUrl: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=1200&auto=format&fit=crop',
    iconType: 'heart',
    iconBgColor: '#1E293B', // Slate Dark
    isRegistered: true,
    distance: '4.9 km from you',
    shortDescription: 'A sanctuary of grace, unconditional love, and transformation for individuals and families.',
    description: 'At New Life Church, no matter what you’ve been through or where you come from, you have a home. We are dedicated to sharing Christ’s transforming love through inspiring messages, practical life groups, and community outreach.',
    memberCount: 940,
    serviceCount: 2,
    serviceTimes: ['Sun 9:00 AM', 'Fri 7:00 PM'],
    foundedYear: 2010,
    expectations: ['Warm Hospitality', 'Life Groups', 'Marriage Ministry', 'NextGen Youth'],
    estimatedApprovalTime: '24 hours',
    isFavorite: false,
    status: 'verified',
  },
  {
    id: 'church_5',
    name: 'Christ the King Church',
    city: 'Achimota',
    region: 'Greater Accra',
    country: 'Ghana',
    address: 'Old Achimota Station Rd, Achimota, Accra',
    imageUrl: 'https://images.unsplash.com/photo-1543702404-585802166668?q=80&w=1200&auto=format&fit=crop',
    iconType: 'mountain',
    iconBgColor: '#4C1D95', // Deep Purple
    isRegistered: true,
    distance: '6.4 km from you',
    shortDescription: 'Exalting King Jesus through reverence, sound biblical teaching, and sacrificial love.',
    description: 'Christ the King Church is committed to historic Christian orthodoxy, expository preaching, liturgical beauty, and joyful fellowship in Greater Accra.',
    memberCount: 510,
    serviceCount: 1,
    serviceTimes: ['Sun 10:00 AM'],
    foundedYear: 2008,
    expectations: ['Reverent Worship', 'Expository Preaching', 'Kids Catechism', 'Hospitality Lunch'],
    estimatedApprovalTime: '2–3 business days',
    isFavorite: false,
    status: 'verified',
  },
  {
    id: 'church_6',
    name: 'Victory Chapel',
    city: 'Dansoman',
    region: 'Greater Accra',
    country: 'Ghana',
    address: 'Sahara Street, Dansoman, Accra',
    imageUrl: 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?q=80&w=1200&auto=format&fit=crop',
    iconType: 'crown',
    iconBgColor: '#0E7490', // Cyan/Deep Blue
    isRegistered: true,
    distance: '9.0 km from you',
    shortDescription: 'Walking in faith, overcoming challenges, and discovering victory in Christ Jesus.',
    description: 'Victory Chapel is an energetic, faith-filled church family helping every person unlock their potential in God and overcome life’s trials through the power of prayer and biblical wisdom.',
    memberCount: 780,
    serviceCount: 2,
    serviceTimes: ['Sun 8:30 AM', 'Thu 6:30 PM'],
    foundedYear: 2015,
    expectations: ['High-Energy Praise', 'Faith Teaching', 'Prayer Warriors', 'Mentorship'],
    estimatedApprovalTime: '1–2 business days',
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
    // In production, will call: return api.get<Church[]>('/churches');
    // Simulated smooth network delay
    await new Promise((res) => setTimeout(res, 400));
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
   * Search churches by name, city, address, or region
   */
  async searchChurches(query: string): Promise<ApiResponse<Church[]>> {
    await new Promise((res) => setTimeout(res, 200));
    const cleanQuery = query.trim().toLowerCase();
    
    if (!cleanQuery) {
      return this.getChurches();
    }

    const filtered = this.churches.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(cleanQuery);
      const cityMatch = c.city?.toLowerCase().includes(cleanQuery) ?? false;
      const regionMatch = c.region?.toLowerCase().includes(cleanQuery) ?? false;
      const addressMatch = c.address?.toLowerCase().includes(cleanQuery) ?? false;
      return nameMatch || cityMatch || regionMatch || addressMatch;
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
   * Get a single church by its unique ID
   */
  async getChurchById(id: string): Promise<ApiResponse<Church>> {
    await new Promise((res) => setTimeout(res, 300));
    const found = this.churches.find((c) => c.id === id);
    if (!found) {
      return {
        success: false,
        data: null as unknown as Church,
        error: 'Church not found in the directory.',
      };
    }

    return {
      success: true,
      data: {
        ...found,
        isFavorite: this.favoriteIds.has(found.id),
      },
    };
  }

  /**
   * Request to join a specific church
   */
  async requestToJoinChurch(churchId: string): Promise<ApiResponse<ChurchJoinRequest>> {
    await new Promise((res) => setTimeout(res, 800));
    const church = this.churches.find((c) => c.id === churchId);
    
    if (!church) {
      return {
        success: false,
        data: null as unknown as ChurchJoinRequest,
        error: 'Cannot submit request: church was not found.',
      };
    }

    const newRequest: ChurchJoinRequest = {
      id: `req_${Date.now()}`,
      churchId: church.id,
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
      message: 'Join request successfully submitted to church administrators.',
    };
  }

  /**
   * Get active pending or approved join request
   */
  getActiveJoinRequest(): ChurchJoinRequest | null {
    return this.activeJoinRequest;
  }

  /**
   * Clear active join request (e.g. if user cancels or wants to pick another church)
   */
  clearActiveJoinRequest(): void {
    this.activeJoinRequest = null;
  }

  /**
   * Toggle favorite state for a church
   */
  toggleFavorite(churchId: string): boolean {
    if (this.favoriteIds.has(churchId)) {
      this.favoriteIds.delete(churchId);
      return false;
    } else {
      this.favoriteIds.add(churchId);
      return true;
    }
  }

  /**
   * Check if a church is favorited
   */
  isFavorite(churchId: string): boolean {
    return this.favoriteIds.has(churchId);
  }
}

export const churchService = new ChurchService();
export default churchService;
