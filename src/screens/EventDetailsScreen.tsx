import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MemberTheme } from '../constants/memberTheme';
import { ChurchEvent } from '../types';
import { memberDashboardService } from '../services/memberDashboardService';
import { ChevronLeft, CalendarDays, Clock, MapPin, Users, CheckCircle2 } from 'lucide-react-native';

const DEFAULT_BANNER =
  'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1200&auto=format&fit=crop';

function parseMonthAndDay(dateStr: string): { month: string; day: string } {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { month: 'SEP', day: '05' };
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = d.toLocaleDateString('en-US', { day: 'numeric' });
  return { month, day };
}

function formatEventDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = d.toLocaleDateString('en-US', { month: 'long' });
  const dayNum = d.getDate();
  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${dayName}, ${monthName} ${dayNum} at ${timeStr}`;
}

export function EventDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<ChurchEvent | null>(null);
  const [isRSVPed, setIsRSVPed] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await memberDashboardService.getUpcomingEvents();
        if (res.success) {
          const found = res.data.find((e) => e.id === id) || res.data[0];
          setEvent(found || null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleToggleRSVP = () => {
    if (!event) return;
    const nextState = !isRSVPed;
    setIsRSVPed(nextState);
    Alert.alert(
      nextState ? 'RSVP Confirmed 🎉' : 'RSVP Cancelled',
      nextState
        ? `You have successfully reserved your spot for ${event.title}!`
        : `Your reservation for ${event.title} has been cancelled.`
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={22} color={MemberTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerFill}>
          <ActivityIndicator color={MemberTheme.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={22} color={MemberTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>Event not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { month, day } = parseMonthAndDay(event.startDate);
  const formattedDateTime = formatEventDateTime(event.startDate);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={22} color={MemberTheme.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Image */}
        <Image
          source={{ uri: event.bannerImageUrl || DEFAULT_BANNER }}
          style={styles.bannerImage}
          resizeMode="cover"
        />

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.topRow}>
            {/* Green Date Badge */}
            <View style={styles.greenDateBadge}>
              <Text style={styles.badgeMonth}>{month}</Text>
              <Text style={styles.badgeDay}>{day}</Text>
            </View>

            <View style={styles.headerMetaCol}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {(event.category || 'EVENT').toUpperCase()}
                </Text>
              </View>
              <Text style={styles.eventTitle}>{event.title}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Details list */}
          <View style={styles.detailRowsGroup}>
            <View style={styles.detailRow}>
              <Clock size={18} color={MemberTheme.primary} />
              <View style={styles.detailTextCol}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>{formattedDateTime}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MapPin size={18} color={MemberTheme.primary} />
              <View style={styles.detailTextCol}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>
                  {event.location || 'Grace Cathedral Main Auditorium'}
                </Text>
              </View>
            </View>

            {event.rsvpCount > 0 && (
              <View style={styles.detailRow}>
                <Users size={18} color={MemberTheme.primary} />
                <View style={styles.detailTextCol}>
                  <Text style={styles.detailLabel}>Attendance</Text>
                  <Text style={styles.detailValue}>
                    {event.rsvpCount + (isRSVPed ? 1 : 0)} members attending
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Description section */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionHeading}>About This Event</Text>
          <Text style={styles.descriptionText}>
            {event.description ||
              'Join us for a spiritual gathering with powerful worship, Biblical teaching, and genuine community fellowship.'}
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.rsvpButton,
            isRSVPed ? styles.rsvpButtonActive : styles.rsvpButtonNormal,
          ]}
          onPress={handleToggleRSVP}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          {isRSVPed && <CheckCircle2 size={18} color="#FFFFFF" />}
          <Text style={styles.rsvpButtonText}>
            {isRSVPed ? 'Spot Reserved (Cancel RSVP)' : 'Reserve My Spot'}
          </Text>
        </TouchableOpacity>

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
    paddingTop: 14,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: MemberTheme.surfaceBorder,
    backgroundColor: MemberTheme.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F7F3',
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  centerFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    backgroundColor: MemberTheme.skeleton,
  },
  infoCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 20,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  greenDateBadge: {
    width: 56,
    height: 58,
    backgroundColor: MemberTheme.primary, // #3F7A3A Green
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeMonth: {
    fontSize: 11,
    fontWeight: '800',
    color: MemberTheme.textOnDark,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  badgeDay: {
    fontSize: 20,
    fontWeight: '800',
    color: MemberTheme.textOnDark,
    fontFamily: 'Inter-Bold',
  },
  headerMetaCol: {
    flex: 1,
    gap: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF2E7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: MemberTheme.primary,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: MemberTheme.divider,
    marginVertical: 16,
  },
  detailRowsGroup: {
    gap: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailTextCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-SemiBold',
    marginTop: 1,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  rsvpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 4,
  },
  rsvpButtonNormal: {
    backgroundColor: MemberTheme.primary,
  },
  rsvpButtonActive: {
    backgroundColor: '#2D582A',
  },
  rsvpButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: MemberTheme.textOnDark,
    fontFamily: 'Inter-Bold',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default EventDetailsScreen;
