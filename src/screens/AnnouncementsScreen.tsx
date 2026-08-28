import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MemberTheme } from '../constants/memberTheme';
import { ChurchFeedItem } from '../types';
import { churchFeedService } from '../services/churchFeedService';
import { ChevronLeft, Search, Megaphone, ArrowRight, Calendar, MapPin } from 'lucide-react-native';

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Aug 27, 2026';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function AnnouncementsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [announcements, setAnnouncements] = useState<ChurchFeedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadAnnouncements = async () => {
    try {
      const res = await churchFeedService.getFeed('church_1', 'announcements');
      if (res.success) {
        setAnnouncements(res.data);
      }
    } catch (e) {
      console.error('Failed to load announcements', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return announcements;
    const q = searchQuery.toLowerCase();
    return announcements.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q)
    );
  }, [announcements, searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnnouncements();
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
        <Text style={styles.headerTitle}>Announcements</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={18} color={MemberTheme.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search announcements..."
            placeholderTextColor={MemberTheme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator color={MemberTheme.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
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
              <Megaphone size={36} color={MemberTheme.primaryMuted} />
              <Text style={styles.emptyTitle}>No announcements yet</Text>
              <Text style={styles.emptySubtitle}>
                Your church’s latest updates and notices will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const formattedDate = formatFullDate(item.createdAt);
            const badgeLabel = (item.authorBadge || 'CHURCH ANNOUNCEMENT').toUpperCase();

            return (
              <TouchableOpacity
                style={styles.announcementCard}
                activeOpacity={0.88}
                onPress={() =>
                  router.push({
                    pathname: '/announcement-details',
                    params: { id: item.id },
                  })
                }
              >
                <View style={styles.categoryBadgeRow}>
                  <View style={styles.megaphoneIconBox}>
                    <Megaphone size={13} color={MemberTheme.primary} />
                  </View>
                  <Text style={styles.categoryBadgeText}>{badgeLabel}</Text>
                  {item.isPinned && (
                    <View style={styles.pinnedBadge}>
                      <Text style={styles.pinnedText}>PINNED</Text>
                    </View>
                  )}
                </View>

                {item.title ? <Text style={styles.cardTitle}>{item.title}</Text> : null}

                <Text style={styles.cardContent} numberOfLines={3}>
                  &ldquo;{item.content}&rdquo;
                </Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Calendar size={13} color={MemberTheme.textMuted} />
                    <Text style={styles.metaText}>{formattedDate}</Text>
                  </View>

                  <View style={styles.metaItem}>
                    <MapPin size={13} color={MemberTheme.textMuted} />
                    <Text style={styles.metaText}>{item.authorName}</Text>
                  </View>
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: MemberTheme.surface,
    borderBottomWidth: 1,
    borderBottomColor: MemberTheme.surfaceBorder,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F7F3',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Regular',
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
  announcementCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 18,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    gap: 8,
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  megaphoneIconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: MemberTheme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: MemberTheme.primary,
    letterSpacing: 0.6,
    fontFamily: 'Inter-Bold',
  },
  pinnedBadge: {
    marginLeft: 'auto',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pinnedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    fontFamily: 'Inter-Bold',
  },
  cardTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  cardContent: {
    fontSize: 13.5,
    lineHeight: 20,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 8,
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

export default AnnouncementsScreen;
