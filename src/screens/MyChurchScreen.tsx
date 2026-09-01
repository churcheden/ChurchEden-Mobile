import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { MemberTheme } from '../constants/memberTheme';
import {
  Church,
  ChurchFeedItem,
  ChurchEvent,
  FeedCategoryFilter,
  ReactionType,
} from '../types';
import { memberDashboardService } from '../services/memberDashboardService';
import { churchFeedService } from '../services/churchFeedService';
import { AppHeader } from '../components/common/AppHeader';
import { ChurchHeroCard } from '../components/church/ChurchHeroCard';
import { FeedFilterPills } from '../components/church/FeedFilterPills';
import { FeedPostCard } from '../components/church/FeedPostCard';
import { UpcomingEventsHorizontal } from '../components/church/UpcomingEventsHorizontal';
import { FeedSkeleton } from '../components/church/FeedSkeleton';
import { Plus, Image as ImageIcon, X } from 'lucide-react-native';

export function MyChurchScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [church, setChurch] = useState<Church | null>(null);
  const [feedItems, setFeedItems] = useState<ChurchFeedItem[]>([]);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FeedCategoryFilter>('all');
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Admin / Leader Composer Modal state
  const [showComposer, setShowComposer] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');

  // Check if current user has publishing permissions (admin, leader, pastor)
  const canPublish = useMemo(() => {
    const role = user?.role?.toLowerCase() || '';
    return (
      role.includes('admin') ||
      role.includes('pastor') ||
      role.includes('leader') ||
      role.includes('minister')
    );
  }, [user]);

  const loadData = useCallback(
    async (filter: FeedCategoryFilter = selectedFilter) => {
      try {
        const [churchRes, feedRes, eventsRes, notifRes] = await Promise.all([
          memberDashboardService.getCurrentChurch(),
          churchFeedService.getFeed('church_1', filter),
          churchFeedService.getUpcomingEvents(),
          memberDashboardService.getNotificationSummary(),
        ]);

        if (churchRes.success) setChurch(churchRes.data);
        if (feedRes.success) setFeedItems(feedRes.data);
        if (eventsRes.success) setEvents(eventsRes.data);
        if (notifRes.success) setUnreadNotifications(notifRes.data.unreadCount);
      } catch (err) {
        console.error('Failed to load My Church data:', err);
      } finally {
        setLoading(false);
      }
    },
    [selectedFilter]
  );

  useEffect(() => {
    loadData(selectedFilter);
  }, [loadData, selectedFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(selectedFilter);
    setRefreshing(false);
  };

  const handleFilterChange = (filter: FeedCategoryFilter) => {
    setSelectedFilter(filter);
    setLoading(true);
    loadData(filter);
  };

  const handleReact = async (postId: string, reaction: ReactionType) => {
    // Optimistic update
    setFeedItems((prev) =>
      prev.map((item) => {
        if (item.id !== postId) return item;
        const currentReaction = item.userReaction;
        let newTotal = item.totalReactions;
        let nextUserReaction: ReactionType | null = reaction;

        if (currentReaction === reaction) {
          nextUserReaction = null;
          newTotal = Math.max(0, newTotal - 1);
        } else if (!currentReaction) {
          newTotal += 1;
        }

        return {
          ...item,
          userReaction: nextUserReaction,
          totalReactions: newTotal,
        };
      })
    );

    // Call service in background
    await churchFeedService.toggleReaction(postId, reaction, user?.id);
  };

  const handleAddComment = async (postId: string, text: string) => {
    const authorName = user?.fullName || 'You';
    const authorAvatar = user?.avatarUrl;

    const res = await churchFeedService.addComment(postId, {
      text,
      userId: user?.id,
      authorName,
      authorAvatar: user?.avatarUrl || undefined,
      authorRole: (user?.role as string) || undefined,
    });

    if (res.success) {
      setFeedItems((prev) =>
        prev.map((item) => {
          if (item.id !== postId) return item;
          const updatedComments = [res.data, ...(item.recentComments || [])];
          return {
            ...item,
            commentsCount: item.commentsCount + 1,
            recentComments: updatedComments.slice(0, 2),
          };
        })
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Shared App Header */}
      <AppHeader
        title="My Church"
        subtitle="Connect • Engage • Grow"
        unreadCount={unreadNotifications}
        onBellPress={() => {
          // Navigates to notifications when implemented
        }}
      />

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
        {loading && !refreshing ? (
          <FeedSkeleton />
        ) : (
          <>
            {/* Church Identity Hero */}
            <View style={styles.sectionWrap}>
              <ChurchHeroCard
                church={church}
                onPress={() => router.push('/church-details')}
              />
              <TouchableOpacity
                style={styles.changeChurchBtn}
                activeOpacity={0.85}
                onPress={() => router.push('/change-church')}
                accessibilityRole="button"
                accessibilityLabel="Change church"
              >
                <Text style={styles.changeChurchText}>Change / Leave Church</Text>
              </TouchableOpacity>
            </View>

            {/* Role-Based Composer for Authorized Leaders/Admins */}
            {canPublish && (
              <View style={styles.sectionWrap}>
                <TouchableOpacity
                  style={styles.composerCard}
                  activeOpacity={0.85}
                  onPress={() => setShowComposer(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Create a church post"
                >
                  {user?.avatarUrl ? (
                    <Image
                      source={{ uri: user.avatarUrl }}
                      style={styles.composerAvatar}
                    />
                  ) : (
                    <View style={styles.composerAvatarFallback}>
                      <Text style={styles.composerInitials}>
                        {user?.fullName?.charAt(0) || 'A'}
                      </Text>
                    </View>
                  )}

                  <View style={styles.composerInputPlaceholder}>
                    <Text style={styles.composerPlaceholderText}>
                      What’s happening in your church?
                    </Text>
                  </View>

                  <View style={styles.composerAddBtn}>
                    <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Category Filter Pills */}
            <FeedFilterPills
              selectedFilter={selectedFilter}
              onSelectFilter={handleFilterChange}
            />

            {/* Upcoming Events Horizontal Carousel (shown on 'all' or 'events' tab) */}
            {(selectedFilter === 'all' || selectedFilter === 'events') &&
              events.length > 0 && (
                <UpcomingEventsHorizontal
                  events={events}
                  title="Upcoming at Your Church"
                  onSeeAll={() => router.push('/events')}
                />
              )}

            {/* Unified Feed Posts */}
            <View style={styles.feedContainer}>
              {feedItems.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>Nothing new yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Church updates, announcements, and community activity will appear
                    here.
                  </Text>
                </View>
              ) : (
                feedItems.map((item) => (
                  <FeedPostCard
                    key={item.id}
                    item={item}
                    currentUserId={user?.id}
                    currentUserName={user?.fullName || undefined}
                    currentUserAvatar={user?.avatarUrl || undefined}
                    onReact={handleReact}
                    onAddComment={handleAddComment}
                    showInlineComments={true}
                  />
                ))
              )}
            </View>
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Admin / Leader Composer Modal */}
      {showComposer && (
        <Modal
          visible={showComposer}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowComposer(false)}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowComposer(false)}
                style={styles.modalCloseBtn}
              >
                <X size={22} color={MemberTheme.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Create Church Update</Text>
              <TouchableOpacity
                style={styles.modalPublishBtn}
                onPress={() => {
                  // Simulate publish
                  setShowComposer(false);
                  setNewPostTitle('');
                  setNewPostText('');
                  loadData();
                }}
              >
                <Text style={styles.modalPublishText}>Publish</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <TextInput
                style={styles.titleInput}
                placeholder="Title (Optional)"
                placeholderTextColor={MemberTheme.textMuted}
                value={newPostTitle}
                onChangeText={setNewPostTitle}
              />
              <TextInput
                style={styles.bodyInput}
                placeholder="Share an announcement, project update, or testimony..."
                placeholderTextColor={MemberTheme.textMuted}
                multiline
                value={newPostText}
                onChangeText={setNewPostText}
                autoFocus
              />

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.mediaPickerBtn}>
                  <ImageIcon size={20} color="#3F7A3A" />
                  <Text style={styles.mediaPickerText}>Add Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      )}
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
    paddingTop: 8,
    paddingBottom: 32,
  },
  sectionWrap: {
    paddingHorizontal: 20,
  },
  changeChurchBtn: {
    marginTop: 12,
    marginBottom: 4,
    alignItems: 'center',
    backgroundColor: MemberTheme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    paddingVertical: 11,
  },
  changeChurchText: {
    fontSize: 13,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
  composerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 10,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  composerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MemberTheme.skeleton,
  },
  composerAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MemberTheme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: MemberTheme.primary,
  },
  composerInputPlaceholder: {
    flex: 1,
    justifyContent: 'center',
  },
  composerPlaceholderText: {
    fontSize: 13,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  composerAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MemberTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedContainer: {
    paddingHorizontal: 20,
  },
  emptyState: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: MemberTheme.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    fontFamily: 'Inter-Regular',
  },
  bottomSpacer: {
    height: 20,
  },
  // Modal styles
  modalSafeArea: {
    flex: 1,
    backgroundColor: MemberTheme.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: MemberTheme.divider,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  modalPublishBtn: {
    backgroundColor: MemberTheme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  modalPublishText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: MemberTheme.divider,
  },
  bodyInput: {
    fontSize: 14.5,
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Regular',
    flex: 1,
    textAlignVertical: 'top',
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: MemberTheme.divider,
    paddingTop: 14,
  },
  mediaPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: MemberTheme.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mediaPickerText: {
    fontSize: 13,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
});

export default MyChurchScreen;
