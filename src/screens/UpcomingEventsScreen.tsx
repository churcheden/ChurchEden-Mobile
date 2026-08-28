import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MemberTheme } from '../constants/memberTheme';
import { ChurchEvent } from '../types';
import { churchFeedService } from '../services/churchFeedService';
import { ChevronLeft, CalendarDays, MapPin, Clock, ArrowRight } from 'lucide-react-native';

type EventTimeFilter = 'all' | 'week' | 'month';

function parseMonthAndDay(dateStr: string): { month: string; day: string } {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { month: 'AUG', day: '30' };
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = d.toLocaleDateString('en-US', { day: 'numeric' });
  return { month, day };
}

function formatFullDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = d.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = d.getDate();
  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${dayName}, ${monthName} ${dayNum} • ${timeStr}`;
}

export function UpcomingEventsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<EventTimeFilter>('all');

  const loadEvents = async () => {
    try {
      const res = await churchFeedService.getUpcomingEvents();
      if (res.success) {
        setEvents(res.data);
      }
    } catch (e) {
      console.error('Failed to load upcoming events', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (selectedFilter === 'all') return events;
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return events.filter((e) => {
      const eventDate = new Date(e.startDate);
      if (isNaN(eventDate.getTime())) return true;
      if (selectedFilter === 'week') {
        return eventDate <= oneWeekLater;
      } else if (selectedFilter === 'month') {
        return eventDate <= oneMonthLater;
      }
      return true;
    });
  }, [events, selectedFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={22} color={MemberTheme.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {(['all', 'week', 'month'] as EventTimeFilter[]).map((filterKey) => {
          const label =
            filterKey === 'all'
              ? 'All'
              : filterKey === 'week'
              ? 'This Week'
              : 'This Month';
          const isSelected = selectedFilter === filterKey;

          return (
            <TouchableOpacity
              key={filterKey}
              style={[
                styles.filterPill,
                isSelected ? styles.filterPillSelected : styles.filterPillUnselected,
              ]}
              onPress={() => setSelectedFilter(filterKey)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isSelected
                    ? styles.filterPillTextSelected
                    : styles.filterPillTextUnselected,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Events List */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator color={MemberTheme.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={MemberTheme.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <CalendarDays size={36} color={MemberTheme.primaryMuted} />
              <Text style={styles.emptyTitle}>No upcoming events</Text>
              <Text style={styles.emptySubtitle}>
                Check back soon for what’s happening at your church.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const { month, day } = parseMonthAndDay(item.startDate);
            const dateStrFormatted = formatFullDateTime(item.startDate);

            return (
              <TouchableOpacity
                style={styles.eventCard}
                activeOpacity={0.88}
                onPress={() =>
                  router.push({
                    pathname: '/event-details',
                    params: { id: item.id },
                  })
                }
              >
                <View style={styles.cardTopRow}>
                  {/* GREEN CALENDAR DATE BADGE TREATMENT */}
                  <View style={styles.greenDateBadge}>
                    <Text style={styles.badgeMonth}>{month}</Text>
                    <Text style={styles.badgeDay}>{day}</Text>
                  </View>

                  <View style={styles.eventMainInfo}>
                    <Text style={styles.categoryBadgeText}>
                      {(item.category || 'EVENT').toUpperCase()}
                    </Text>
                    <Text style={styles.eventTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <View style={styles.metaLine}>
                      <Clock size={13} color={MemberTheme.textMuted} />
                      <Text style={styles.metaText}>{dateStrFormatted}</Text>
                    </View>
                    {item.location ? (
                      <View style={styles.metaLine}>
                        <MapPin size={13} color={MemberTheme.textMuted} />
                        <Text style={styles.metaText} numberOfLines={1}>
                          {item.location}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {item.bannerImageUrl && (
                    <Image
                      source={{ uri: item.bannerImageUrl }}
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <ArrowRight size={15} color={MemberTheme.primary} />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MemberTheme.background,
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: MemberTheme.surface,
    borderBottomWidth: 1,
    borderBottomColor: MemberTheme.surfaceBorder,
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  filterPillSelected: {
    backgroundColor: '#EAF2E7',
    borderColor: MemberTheme.primary,
  },
  filterPillUnselected: {
    backgroundColor: MemberTheme.surface,
    borderColor: MemberTheme.surfaceBorder,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  filterPillTextSelected: {
    color: '#10233F',
    fontWeight: '700',
  },
  filterPillTextUnselected: {
    color: MemberTheme.textSecondary,
  },
  listContent: {
    padding: 20,
    gap: 14,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 16,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  // ESTABLISHED GREEN CALENDAR DATE BADGE
  greenDateBadge: {
    width: 52,
    height: 54,
    backgroundColor: MemberTheme.primary, // #3F7A3A
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeMonth: {
    fontSize: 10,
    fontWeight: '800',
    color: MemberTheme.textOnDark, // #FFFFFF
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  badgeDay: {
    fontSize: 18,
    fontWeight: '800',
    color: MemberTheme.textOnDark, // #FFFFFF
    fontFamily: 'Inter-Bold',
    marginTop: 1,
  },
  eventMainInfo: {
    flex: 1,
    gap: 3,
  },
  categoryBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: MemberTheme.primary,
    letterSpacing: 0.5,
    fontFamily: 'Inter-Bold',
  },
  eventTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12.5,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
    flexShrink: 1,
  },
  thumbnailImage: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: MemberTheme.skeleton,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: MemberTheme.divider,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
  emptyCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  emptySubtitle: {
    fontSize: 13,
    color: MemberTheme.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    fontFamily: 'Inter-Regular',
  },
});

export default UpcomingEventsScreen;
