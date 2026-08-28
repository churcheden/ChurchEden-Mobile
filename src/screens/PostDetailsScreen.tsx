import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { MemberTheme } from '../constants/memberTheme';
import { ChurchFeedItem, FeedComment, ReactionType } from '../types';
import { churchFeedService } from '../services/churchFeedService';
import { ReactionPickerModal } from '../components/church/ReactionPickerModal';
import {
  ChevronLeft,
  MoreHorizontal,
  Globe,
  ThumbsUp,
  Heart,
  MessageSquare,
  Share2,
  Send,
  Image as ImageIcon,
  Smile,
  ChevronDown,
  Church as ChurchIcon,
  CalendarDays,
} from 'lucide-react-native';

function formatTimeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / (1000 * 60));
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function PostDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<ChurchFeedItem | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [sortBy, setSortBy] = useState<'relevant' | 'newest'>('relevant');
  const [commentText, setCommentText] = useState('');
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadPost = useCallback(async () => {
    if (!id) return;
    try {
      const [postRes, commentsRes] = await Promise.all([
        churchFeedService.getPostById(id),
        churchFeedService.getComments(id, sortBy),
      ]);

      if (postRes.success) setPost(postRes.data);
      if (commentsRes.success) setComments(commentsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id, sortBy]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleToggleSort = () => {
    const nextSort = sortBy === 'relevant' ? 'newest' : 'relevant';
    setSortBy(nextSort);
  };

  const handleReact = async (reaction: ReactionType) => {
    if (!post) return;
    const currentReaction = post.userReaction;
    let newTotal = post.totalReactions;
    let nextUserReaction: ReactionType | null = reaction;

    if (currentReaction === reaction) {
      nextUserReaction = null;
      newTotal = Math.max(0, newTotal - 1);
    } else if (!currentReaction) {
      newTotal += 1;
    }

    setPost({
      ...post,
      userReaction: nextUserReaction,
      totalReactions: newTotal,
    });

    await churchFeedService.toggleReaction(post.id, reaction, user?.id);
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !post || submittingComment) return;
    setSubmittingComment(true);

    try {
      const res = await churchFeedService.addComment(post.id, {
        text: commentText.trim(),
        userId: user?.id,
        authorName: user?.fullName || 'You',
        authorAvatar: user?.avatarUrl,
        authorRole: user?.role,
      });

      if (res.success) {
        setComments((prev) => [res.data, ...prev]);
        setPost((prev) =>
          prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null
        );
        setCommentText('');
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleToggleCommentLike = async (commentId: string) => {
    if (!post) return;
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const nextLiked = !c.isLikedByMe;
        return {
          ...c,
          isLikedByMe: nextLiked,
          likesCount: nextLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
        };
      })
    );

    await churchFeedService.toggleCommentLike(post.id, commentId);
  };

  const handleShare = async () => {
    if (!post) return;
    try {
      await Share.share({
        message: `${post.title ? post.title + '\n' : ''}${post.content}\nShared from ChurchEden`,
      });
    } catch {
      // Ignored
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={22} color={MemberTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerLoading}>
          <ActivityIndicator color={MemberTheme.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={22} color={MemberTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerLoading}>
          <Text style={styles.errorText}>Post not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isProject = post.contentType === 'project';
  const isEvent = post.contentType === 'event';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={22} color={MemberTheme.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <TouchableOpacity
          style={styles.headerMoreBtn}
          accessibilityRole="button"
          accessibilityLabel="Options"
        >
          <MoreHorizontal size={20} color={MemberTheme.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex1}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Post Author Row */}
          <View style={styles.authorRow}>
            {post.authorAvatar ? (
              <Image
                source={{ uri: post.authorAvatar }}
                style={styles.authorAvatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.churchAvatarBox}>
                <ChurchIcon size={20} color="#FFFFFF" strokeWidth={2} />
              </View>
            )}

            <View style={styles.authorInfo}>
              <View style={styles.authorNameRow}>
                <Text style={styles.authorName}>{post.authorName}</Text>
                {post.authorBadge && (
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminBadgeText}>{post.authorBadge}</Text>
                  </View>
                )}
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaTime}>{formatTimeAgo(post.createdAt)}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Globe size={12} color={MemberTheme.textMuted} />
              </View>
            </View>

            <TouchableOpacity style={styles.postOptionsBtn}>
              <MoreHorizontal size={18} color={MemberTheme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Post Title */}
          {post.title && <Text style={styles.postTitle}>{post.title}</Text>}

          {/* Post Content */}
          <Text style={styles.postContent}>{post.content}</Text>

          {/* Post Media Image */}
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <View style={styles.mediaContainer}>
              <Image
                source={{ uri: post.mediaUrls[0] }}
                style={styles.postImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Project Progress Widget */}
          {isProject && post.projectProgress && (
            <View style={styles.projectProgressCard}>
              <View style={styles.progressCol}>
                <Text style={styles.progressLabel}>Total Raised</Text>
                <Text style={styles.progressValue}>
                  {post.projectProgress.currency}{' '}
                  {post.projectProgress.totalRaised.toLocaleString()}
                </Text>
              </View>

              <View style={styles.progressPercentCircle}>
                <Text style={styles.percentText}>
                  {post.projectProgress.percentage}%
                </Text>
              </View>

              <View style={[styles.progressCol, styles.progressColRight]}>
                <Text style={styles.progressLabel}>Goal</Text>
                <Text style={styles.progressValue}>
                  {post.projectProgress.currency}{' '}
                  {post.projectProgress.goal.toLocaleString()}
                </Text>
              </View>
            </View>
          )}

          {/* Event Content Details */}
          {isEvent && post.eventDetails && (
            <View style={styles.eventCardBox}>
              <View style={styles.eventBadge}>
                <CalendarDays size={13} color="#3F7A3A" />
                <Text style={styles.eventBadgeText}>EVENT DETAILS</Text>
              </View>
              <Text style={styles.eventTimeText}>
                {post.eventDetails.date} • {post.eventDetails.time}
              </Text>
              <Text style={styles.eventLocationText}>
                {post.eventDetails.location}
              </Text>
            </View>
          )}

          {/* Reactions Summary */}
          <View style={styles.summaryRow}>
            <View style={styles.reactionsCountRow}>
              <Text style={styles.summaryEmoji}>👍</Text>
              <Text style={styles.summaryEmoji}>❤️</Text>
              <Text style={styles.summaryEmoji}>😮</Text>
              <Text style={styles.reactionsTotalText}>{post.totalReactions}</Text>
            </View>

            <View style={styles.sharesRow}>
              <Text style={styles.countsText}>{post.commentsCount} comments</Text>
              {post.sharesCount ? (
                <>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.countsText}>{post.sharesCount} shares</Text>
                </>
              ) : null}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Actions Bar */}
          <View style={styles.actionsBar}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                const nextReaction: ReactionType = post.userReaction
                  ? post.userReaction
                  : 'like';
                handleReact(nextReaction);
              }}
              onLongPress={() => setShowReactionPicker(true)}
              activeOpacity={0.7}
            >
              {post.userReaction === 'love' ? (
                <Heart size={18} color="#E11D48" fill="#E11D48" />
              ) : post.userReaction === 'amen' ? (
                <Text style={{ fontSize: 16 }}>🙏</Text>
              ) : (
                <ThumbsUp
                  size={18}
                  color={post.userReaction ? '#3F7A3A' : MemberTheme.textSecondary}
                  fill={post.userReaction ? '#3F7A3A' : 'none'}
                />
              )}
              <Text
                style={[
                  styles.actionBtnText,
                  post.userReaction ? styles.actionBtnActive : null,
                ]}
              >
                {post.userReaction
                  ? post.userReaction.charAt(0).toUpperCase() +
                    post.userReaction.slice(1)
                  : 'Like'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
              <MessageSquare size={18} color={MemberTheme.textSecondary} />
              <Text style={styles.actionBtnText}>Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Share2 size={18} color={MemberTheme.textSecondary} />
              <Text style={styles.actionBtnText}>Share</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.thickDivider} />

          {/* Comments Header */}
          <View style={styles.commentsHeaderRow}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={handleToggleSort}
              activeOpacity={0.7}
            >
              <Text style={styles.sortButtonText}>
                {sortBy === 'relevant' ? 'Most relevant' : 'Newest'}
              </Text>
              <ChevronDown size={14} color={MemberTheme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          <View style={styles.commentsList}>
            {comments.map((c) => (
              <View key={c.id} style={styles.commentRow}>
                {c.authorAvatar ? (
                  <Image
                    source={{ uri: c.authorAvatar }}
                    style={styles.commentAuthorAvatar}
                  />
                ) : (
                  <View style={styles.commentAvatarFallback}>
                    <Text style={styles.avatarInitial}>
                      {c.authorName.charAt(0)}
                    </Text>
                  </View>
                )}

                <View style={styles.commentCol}>
                  <View style={styles.commentBubble}>
                    <Text style={styles.commentAuthorName}>{c.authorName}</Text>
                    <Text style={styles.commentBodyText}>{c.content}</Text>
                  </View>

                  <View style={styles.commentActionsRow}>
                    <Text style={styles.commentTimeAgo}>
                      {formatTimeAgo(c.createdAt)}
                    </Text>

                    <TouchableOpacity
                      onPress={() => handleToggleCommentLike(c.id)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.commentActionText,
                          c.isLikedByMe && styles.commentActionLiked,
                        ]}
                      >
                        Like
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.commentActionText}>Reply</Text>
                    </TouchableOpacity>

                    {c.likesCount > 0 && (
                      <View style={styles.commentLikesCountBadge}>
                        <Text style={{ fontSize: 10 }}>👍 ❤️ {c.likesCount}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.bottomListSpacer} />
        </ScrollView>

        {/* Bottom Add Comment Bar */}
        <View style={styles.bottomInputBar}>
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.inputUserAvatar}
            />
          ) : (
            <View style={styles.inputUserAvatarFallback}>
              <Text style={styles.avatarInitial}>
                {user?.fullName?.charAt(0) || 'U'}
              </Text>
            </View>
          )}

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.commentTextInput}
              placeholder="Write a comment..."
              placeholderTextColor={MemberTheme.textMuted}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />

            <View style={styles.inputIconsRight}>
              <TouchableOpacity style={styles.inputIconBtn}>
                <ImageIcon size={18} color={MemberTheme.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputIconBtn}>
                <Smile size={18} color={MemberTheme.textMuted} />
              </TouchableOpacity>
              {commentText.trim().length > 0 && (
                <TouchableOpacity
                  style={styles.sendCommentBtn}
                  onPress={handleSendComment}
                  disabled={submittingComment}
                >
                  <Send size={16} color="#3F7A3A" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Reaction Picker Popup */}
      <ReactionPickerModal
        visible={showReactionPicker}
        onClose={() => setShowReactionPicker(false)}
        onSelectReaction={handleReact}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MemberTheme.surface,
  },
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: MemberTheme.surface,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: MemberTheme.divider,
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
    fontSize: 17,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  headerMoreBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: MemberTheme.skeleton,
  },
  churchAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10233F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  adminBadge: {
    backgroundColor: '#EAF2E7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3F7A3A',
    fontFamily: 'Inter-SemiBold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaTime: {
    fontSize: 12,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  metaDot: {
    fontSize: 11,
    color: MemberTheme.textMuted,
  },
  postOptionsBtn: {
    padding: 6,
  },
  postTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14.5,
    lineHeight: 22,
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  mediaContainer: {
    marginTop: 14,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: MemberTheme.skeleton,
  },
  postImage: {
    width: '100%',
    height: 240,
  },
  projectProgressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F7F3',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
  },
  progressCol: {
    flex: 1,
  },
  progressColRight: {
    alignItems: 'flex-end',
  },
  progressLabel: {
    fontSize: 12,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  progressValue: {
    fontSize: 15,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    marginTop: 2,
  },
  progressPercentCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3.5,
    borderColor: '#3F7A3A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MemberTheme.surface,
  },
  percentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3F7A3A',
    fontFamily: 'Inter-Bold',
  },
  eventCardBox: {
    backgroundColor: '#F8F7F3',
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    gap: 4,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  eventBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3F7A3A',
    fontFamily: 'Inter-Bold',
  },
  eventTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  eventLocationText: {
    fontSize: 12,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  reactionsCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryEmoji: {
    fontSize: 15,
    marginRight: -4,
  },
  reactionsTotalText: {
    fontSize: 13,
    fontWeight: '600',
    color: MemberTheme.textSecondary,
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  sharesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countsText: {
    fontSize: 13,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: MemberTheme.divider,
    marginVertical: 12,
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-SemiBold',
  },
  actionBtnActive: {
    color: '#3F7A3A',
  },
  thickDivider: {
    height: 6,
    backgroundColor: '#F8F7F3',
    marginHorizontal: -20,
    marginTop: 12,
    marginBottom: 16,
  },
  commentsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  commentsList: {
    gap: 14,
  },
  commentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  commentAuthorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: MemberTheme.skeleton,
  },
  commentAvatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: MemberTheme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: MemberTheme.primary,
  },
  commentCol: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#F8F7F3',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  commentAuthorName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  commentBodyText: {
    fontSize: 13.5,
    color: MemberTheme.textPrimary,
    lineHeight: 19,
    fontFamily: 'Inter-Regular',
  },
  commentActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 6,
    paddingHorizontal: 6,
  },
  commentTimeAgo: {
    fontSize: 11.5,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  commentActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-SemiBold',
  },
  commentActionLiked: {
    color: '#3F7A3A',
  },
  commentLikesCountBadge: {
    marginLeft: 'auto',
    backgroundColor: MemberTheme.surface,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
  },
  bottomListSpacer: {
    height: 30,
  },
  bottomInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: MemberTheme.surface,
    borderTopWidth: 1,
    borderTopColor: MemberTheme.divider,
  },
  inputUserAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MemberTheme.skeleton,
  },
  inputUserAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MemberTheme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F7F3',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
  },
  commentTextInput: {
    flex: 1,
    fontSize: 13.5,
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Regular',
    maxHeight: 90,
  },
  inputIconsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 6,
  },
  inputIconBtn: {
    padding: 2,
  },
  sendCommentBtn: {
    padding: 4,
  },
});

export default PostDetailsScreen;
