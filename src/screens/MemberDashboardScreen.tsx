import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../hooks/useAuth';
import { MemberTheme } from '../constants/memberTheme';
import {
  Church,
  Member,
  NextService,
  Announcement,
  ChurchEvent,
} from '../types';
import { memberDashboardService } from '../services/memberDashboardService';
import { DashboardSkeleton } from '../components/member/DashboardSkeleton';
import { EventCarousel } from '../components/member/EventCarousel';
import { AnnouncementRow } from '../components/member/AnnouncementRow';
import { ChurchEdenLogo } from '../components/common/ChurchEdenLogo';
import { ProfileAvatar } from '../components/common/ProfileAvatar';
import Svg, { Circle } from 'react-native-svg';
import {
  Bell,
  MapPin,
  CalendarDays,
  ChevronRight,
  AlertCircle,
  ArrowRight,
} from 'lucide-react-native';

const DEFAULT_CHURCH_IMAGE =
  'https://images.unsplash.com/photo-1548625361-195fe57876a3?q=80&w=1200&auto=format&fit=crop';

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || '';
}

export function MemberDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [coreLoading, setCoreLoading] = useState(true);
  const [coreError, setCoreError] = useState(false);

  const [member, setMember] = useState<Member | null>(null);
  const [church, setChurch] = useState<Church | null>(null);
  const [nextService, setNextService] = useState<NextService | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const [eventsState, setEventsState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [events, setEvents] = useState<ChurchEvent[]>([]);

  const [announcementsState, setAnnouncementsState] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const loadCore = useCallback(async () => {
    setCoreLoading(true);
    setCoreError(false);
    try {
      const [memberRes, churchRes, nextServiceRes, notificationsRes] = await Promise.all([
        memberDashboardService.getCurrentMember(),
        memberDashboardService.getCurrentChurch(),
        memberDashboardService.getNextService(),
        memberDashboardService.getNotificationSummary(),
      ]);
      setMember(memberRes.success ? memberRes.data : null);
      setChurch(churchRes.success ? churchRes.data : null);
      setNextService(nextServiceRes.success ? nextServiceRes.data : null);
      setUnreadCount(notificationsRes.success ? notificationsRes.data.unreadCount : 0);
      if (!memberRes.success && !churchRes.success) {
        setCoreError(true);
      }
    } catch {
      setCoreError(true);
    } finally {
      setCoreLoading(false);
    }
  }, []);

  const loadEvents = useCallback(async () => {
    setEventsState('loading');
    try {
      const res = await memberDashboardService.getUpcomingEvents();
      if (res.success) {
        setEvents(res.data);
        setEventsState('ready');
      } else {
        setEventsState('error');
      }
    } catch {
      setEventsState('error');
    }
  }, []);

  const loadAnnouncements = useCallback(async () => {
    setAnnouncementsState('loading');
    try {
      const res = await memberDashboardService.getRecentAnnouncements();
      if (res.success) {
        setAnnouncements(res.data);
        setAnnouncementsState('ready');
      } else {
        setAnnouncementsState('error');
      }
    } catch {
      setAnnouncementsState('error');
    }
  }, []);

  const loadAll = useCallback(async () => {
    await Promise.all([loadCore(), loadEvents(), loadAnnouncements()]);
  }, [loadCore, loadEvents, loadAnnouncements]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  }, [loadAll]);

  const displayName = useMemo(() => {
    const raw = member?.fullName || user?.fullName || 'Member';
    return firstName(raw) || 'Member';
  }, [user, member]);

  const hasUnread = unreadCount > 0;
  const growthPercent = 72;

  if (coreLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <DashboardSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (coreError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
        <View style={[styles.container, styles.centerFill]}>
          <View style={styles.errorIconWrap}>
            <AlertCircle size={28} color={MemberTheme.primary} />
          </View>
          <Text style={styles.errorTitle}>We couldn&apos;t load your dashboard.</Text>
          <Text style={styles.errorBody}>
            Please check your connection and try again.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setCoreLoading(true);
              setCoreError(false);
              loadAll().finally(() => setCoreLoading(false));
            }}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={MemberTheme.primary}
            colors={[MemberTheme.primary]}
          />
        }
      >
        {/* ===== Header row ===== */}
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            <ChurchEdenLogo size={34} />
            <View>
              <Text style={styles.wordmark}>ChurchEden</Text>
              <Text style={styles.tagline}>FAITH. PEOPLE. PURPOSE.</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.8}
              onPress={() => {
                // Opens the existing Notifications screen when available
              }}
              accessibilityRole="button"
              accessibilityLabel={hasUnread ? `Notifications, ${unreadCount} unread` : 'Notifications'}
            >
              <Bell size={20} color={MemberTheme.textPrimary} strokeWidth={2} />
              {hasUnread && <View style={styles.unreadDot} />}
            </TouchableOpacity>

            <ProfileAvatar size={40} />
          </View>
        </View>

        {/* ===== Greeting ===== */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.headerName} numberOfLines={1}>
            {displayName},
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            We&apos;re glad to have you with {church?.name || 'your church'}.
          </Text>
        </View>

        {/* ===== Church info card ===== */}
        <TouchableOpacity
          style={styles.churchCard}
          activeOpacity={0.8}
          onPress={() => router.push('/my-church')}
          accessibilityRole="button"
          accessibilityLabel={`Your church: ${church?.name || 'Church'}`}
          accessibilityHint="Opens your church profile"
        >
          <Image
            source={{ uri: church?.imageUrl || DEFAULT_CHURCH_IMAGE }}
            style={styles.churchImage}
            resizeMode="cover"
          />
          <View style={styles.churchInfo}>
            <Text style={styles.churchLabel}>Your Church</Text>
            <Text style={styles.churchName} numberOfLines={1}>
              {church?.name || 'Your Church'}
            </Text>
            <View style={styles.churchLocationRow}>
              <MapPin size={13} color={MemberTheme.textMuted} />
              <Text style={styles.churchLocation} numberOfLines={1}>
                {church?.city && church?.country
                  ? `${church.city}, ${church.country}`
                  : church?.city || church?.address || 'Your church'}
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color={MemberTheme.textMuted} />
        </TouchableOpacity>

        {/* ===== Stats / status row ===== */}
        <View style={styles.summaryCard}>
          <View style={styles.summarySections}>
            {/* Active member */}
            <View style={styles.summarySection}>
              <View style={styles.memberStatusRow}>
                <View style={styles.memberStatusDot} />
                <Text style={styles.memberStatusLabel}>Active Member</Text>
              </View>
              <Text style={styles.memberSinceLabel}>Member since</Text>
              <Text style={styles.memberSinceValue} numberOfLines={1}>
                {member?.membershipDate ? formatFullDate(member.membershipDate) : '—'}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            {/* Next service */}
            <View style={styles.summarySection}>
              <View style={styles.serviceLabelRow}>
                <CalendarDays size={15} color={MemberTheme.primary} strokeWidth={2} />
                <Text style={styles.summaryLabel}>Next Service</Text>
              </View>
              <Text style={styles.serviceDay} numberOfLines={1}>
                {nextService ? `${nextService.dayLabel}, ${nextService.dateLabel}` : '—'}
              </Text>
              <Text style={styles.serviceTime}>
                {nextService?.time || '—'}
              </Text>
              <Text style={styles.serviceLocation} numberOfLines={1}>
                {nextService?.location || '—'}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            {/* Spiritual growth progress ring */}
            <View style={[styles.summarySection, styles.growthSection]}>
              <View style={styles.growthRingWrap}>
                <Svg width={64} height={64} viewBox="0 0 64 64">
                  <Circle
                    cx="32"
                    cy="32"
                    r="27"
                    stroke={MemberTheme.primarySoft}
                    strokeWidth="7"
                    fill="none"
                  />
                  <Circle
                    cx="32"
                    cy="32"
                    r="27"
                    stroke={MemberTheme.primary}
                    strokeWidth="7"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 27}`}
                    strokeDashoffset={2 * Math.PI * 27 * (1 - growthPercent / 100)}
                    transform="rotate(-90 32 32)"
                  />
                </Svg>
                <Text style={styles.growthValue}>{growthPercent}%</Text>
              </View>
              <Text style={styles.growthLabel}>Spiritual Growth</Text>
            </View>
          </View>

          {/* Add to calendar */}
          <View style={styles.calendarDivider} />
          <TouchableOpacity
            style={styles.calendarAction}
            activeOpacity={0.7}
            onPress={() => {
              // Calendar integration to be wired up when available.
            }}
            accessibilityRole="button"
            accessibilityLabel="Add next service to calendar"
          >
            <Text style={styles.calendarActionText}>Add to calendar</Text>
            <ArrowRight size={16} color={MemberTheme.primary} />
          </TouchableOpacity>
        </View>

        {/* ===== Upcoming events ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity
            style={styles.viewAllLink}
            onPress={() => router.push('/events')}
            accessibilityRole="button"
            accessibilityLabel="View all events"
          >
            <Text style={styles.viewAllText}>View all</Text>
            <ChevronRight size={16} color={MemberTheme.primary} />
          </TouchableOpacity>
        </View>

        {eventsState === 'loading' ? (
          <View style={styles.sectionLoading}>
            <ActivityIndicator color={MemberTheme.primary} />
          </View>
        ) : eventsState === 'error' ? (
          <TouchableOpacity
            style={styles.inlineRetry}
            onPress={loadEvents}
            accessibilityRole="button"
          >
            <AlertCircle size={18} color={MemberTheme.textMuted} />
            <Text style={styles.inlineRetryText}>Couldn&apos;t load events.</Text>
            <Text style={styles.inlineRetryAction}>Retry</Text>
          </TouchableOpacity>
        ) : events.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No upcoming events right now.</Text>
          </View>
        ) : (
          <EventCarousel events={events} />
        )}

        {/* ===== Recent announcements ===== */}
        <View style={[styles.sectionHeader, styles.announcementsHeader]}>
          <Text style={styles.sectionTitle}>Recent Announcements</Text>
          <TouchableOpacity
            style={styles.viewAllLink}
            onPress={() => {
              // Opens the existing Announcements screen when available
            }}
            accessibilityRole="button"
            accessibilityLabel="View all announcements"
          >
            <Text style={styles.viewAllText}>View all</Text>
            <ChevronRight size={16} color={MemberTheme.primary} />
          </TouchableOpacity>
        </View>

        {announcementsState === 'loading' ? (
          <View style={styles.announcementsLoading}>
            <View style={styles.sectionLoading}>
              <ActivityIndicator color={MemberTheme.primary} />
            </View>
          </View>
        ) : announcementsState === 'error' ? (
          <TouchableOpacity
            style={styles.inlineRetry}
            onPress={loadAnnouncements}
            accessibilityRole="button"
          >
            <AlertCircle size={18} color={MemberTheme.textMuted} />
            <Text style={styles.inlineRetryText}>Couldn&apos;t load announcements.</Text>
            <Text style={styles.inlineRetryAction}>Retry</Text>
          </TouchableOpacity>
        ) : announcements.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>You&apos;re all caught up.</Text>
          </View>
        ) : (
          <View style={styles.announcementContainer}>
            {announcements.map((item, index) => (
              <AnnouncementRow
                key={item.id}
                announcement={item}
                showTopBorder={index > 0}
                onPress={() => {
                  // Opens announcement details when available
                }}
              />
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MemberTheme.background,
  },
  container: {
    flex: 1,
    backgroundColor: MemberTheme.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  centerFill: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: MemberTheme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  errorBody: {
    fontSize: 14,
    color: MemberTheme.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: MemberTheme.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: MemberTheme.textOnDark,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    fontSize: 20,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 9,
    color: MemberTheme.gold,
    letterSpacing: 2,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginTop: 1,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: MemberTheme.surface,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  unreadDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: MemberTheme.primary,
    borderWidth: 1.5,
    borderColor: MemberTheme.surface,
  },
  greetingSection: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  headerName: {
    fontSize: 26,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: MemberTheme.textSecondary,
    lineHeight: 18,
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  churchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MemberTheme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 14,
    gap: 14,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  churchImage: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: MemberTheme.skeleton,
  },
  churchInfo: {
    flex: 1,
    gap: 4,
  },
  churchLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: MemberTheme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: 'Inter-SemiBold',
  },
  churchName: {
    fontSize: 16,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  churchLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  churchLocation: {
    fontSize: 13,
    color: MemberTheme.textSecondary,
    flexShrink: 1,
    fontFamily: 'Inter-Regular',
  },
  summaryCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 20,
    marginTop: 16,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  summarySections: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  summarySection: {
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: MemberTheme.divider,
    marginHorizontal: 14,
  },
  memberStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  memberStatusDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: MemberTheme.primary,
  },
  memberStatusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
  memberSinceLabel: {
    fontSize: 12,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  memberSinceValue: {
    fontSize: 15,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    marginTop: 2,
    fontFamily: 'Inter-Bold',
  },
  serviceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 12,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  serviceDay: {
    fontSize: 15,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    marginTop: 2,
    fontFamily: 'Inter-Bold',
  },
  serviceTime: {
    fontSize: 13,
    color: MemberTheme.textSecondary,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  serviceLocation: {
    fontSize: 13,
    color: MemberTheme.textMuted,
    flexShrink: 1,
    marginTop: 6,
    fontFamily: 'Inter-Regular',
  },
  growthSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  growthRingWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  growthValue: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '700',
    color: MemberTheme.primary,
    fontFamily: 'Inter-Bold',
  },
  growthLabel: {
    fontSize: 11,
    color: MemberTheme.textMuted,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  calendarDivider: {
    height: 1,
    backgroundColor: MemberTheme.divider,
    marginTop: 18,
  },
  calendarAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 14,
    alignSelf: 'flex-start',
  },
  calendarActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  announcementsHeader: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  viewAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
  sectionLoading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  announcementsLoading: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
  },
  inlineRetry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: MemberTheme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 16,
  },
  inlineRetryText: {
    flex: 1,
    fontSize: 14,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  inlineRetryAction: {
    fontSize: 14,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    backgroundColor: MemberTheme.primaryPale,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'flex-start',
  },
  emptyStateText: {
    fontSize: 14,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  announcementContainer: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    paddingHorizontal: 16,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  bottomSpacer: {
    height: 16,
  },
});

export default MemberDashboardScreen;
