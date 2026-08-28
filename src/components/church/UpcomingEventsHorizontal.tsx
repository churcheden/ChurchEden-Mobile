import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChurchEvent } from '../../types';
import { MemberTheme } from '../../constants/memberTheme';
import { ChevronRight, Clock, MapPin } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.72, 280);

interface UpcomingEventsHorizontalProps {
  events: ChurchEvent[];
  title?: string;
  onSeeAll?: () => void;
}

function parseMonthAndDay(dateStr: string): { month: string; day: string } {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return { month: 'UPCOMING', day: '•' };
  }
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = d.toLocaleDateString('en-US', { day: 'numeric' });
  return { month, day };
}

function formatEventTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '6:00 PM';
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function UpcomingEventsHorizontal({
  events,
  title = 'Upcoming at Your Church',
  onSeeAll,
}: UpcomingEventsHorizontalProps) {
  const router = useRouter();

  if (!events || events.length === 0) {
    return null;
  }

  const handleSeeAll = () => {
    if (onSeeAll) {
      onSeeAll();
    } else {
      router.push('/events');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={handleSeeAll}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="See all upcoming events"
        >
          <Text style={styles.seeAllText}>See all</Text>
          <ChevronRight size={15} color={MemberTheme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + 14}
        decelerationRate="fast"
      >
        {events.map((event) => {
          const { month, day } = parseMonthAndDay(event.startDate);
          const timeFormatted = formatEventTime(event.startDate);

          return (
            <TouchableOpacity
              key={event.id}
              style={[styles.eventCard, { width: CARD_WIDTH }]}
              activeOpacity={0.85}
              onPress={() => router.push('/events')}
              accessibilityRole="button"
              accessibilityLabel={`${event.title}, on ${month} ${day}`}
            >
              {/* Event Image with overlay date badge */}
              <View style={styles.imageContainer}>
                {event.bannerImageUrl ? (
                  <Image
                    source={{ uri: event.bannerImageUrl }}
                    style={styles.eventImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}

                <View style={styles.dateBadge}>
                  <Text style={styles.dateMonth}>{month}</Text>
                  <Text style={styles.dateDay}>{day}</Text>
                </View>
              </View>

              {/* Event Info */}
              <View style={styles.infoContainer}>
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {event.title}
                </Text>

                <View style={styles.metaRow}>
                  <Clock size={12} color={MemberTheme.textMuted} />
                  <Text style={styles.timeText}>{timeFormatted}</Text>
                </View>

                {event.location ? (
                  <View style={styles.metaRow}>
                    <MapPin size={12} color={MemberTheme.textMuted} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {event.location}
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 14,
  },
  eventCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    overflow: 'hidden',
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: MemberTheme.skeleton,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#10233F',
  },
  dateBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: MemberTheme.surface,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  dateMonth: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D14343',
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  dateDay: {
    fontSize: 14,
    fontWeight: '800',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  infoContainer: {
    padding: 12,
    gap: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  locationText: {
    fontSize: 11.5,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
    flexShrink: 1,
  },
});

export default UpcomingEventsHorizontal;
