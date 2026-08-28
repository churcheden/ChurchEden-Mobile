import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Share,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChurchFeedItem, ReactionType } from '../../types';
import { MemberTheme } from '../../constants/memberTheme';
import { ReactionPickerModal } from './ReactionPickerModal';
import {
  MoreHorizontal,
  Globe,
  ThumbsUp,
  Heart,
  MessageSquare,
  Share2,
  CalendarDays,
  Megaphone,
  ChevronRight,
  Send,
  Church as ChurchIcon,
} from 'lucide-react-native';

interface FeedPostCardProps {
  item: ChurchFeedItem;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  onReact: (postId: string, reaction: ReactionType) => void;
  onAddComment?: (postId: string, text: string) => void;
  showInlineComments?: boolean;
}

function formatTimeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / (1000 * 60));
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function FeedPostCard({
  item,
  currentUserName = 'You',
  currentUserAvatar,
  onReact,
  onAddComment,
  showInlineComments = true,
}: FeedPostCardProps) {
  const router = useRouter();
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [expandedText, setExpandedText] = useState(false);
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isAnnouncement = item.contentType === 'announcement';
  const isEvent = item.contentType === 'event';
  const isProject = item.contentType === 'project';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${item.title ? item.title + '\n' : ''}${item.content}\nShared from ChurchEden`,
      });
    } catch {
      // Ignored
    }
  };

  const handleSendComment = () => {
    if (!commentText.trim() || !onAddComment) return;
    onAddComment(item.id, commentText.trim());
    setCommentText('');
  };

  const openPostDetails = () => {
    router.push({
      pathname: '/post-details',
      params: { id: item.id },
    });
  };

  // Render announcement card format
  if (isAnnouncement) {
    return (
      <View style={styles.announcementCard}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={openPostDetails}
          accessibilityRole="button"
          accessibilityLabel={`Announcement: ${item.title}`}
        >
          <View style={styles.announcementTopRow}>
            <View style={styles.announcementBadge}>
              <Megaphone size={14} color="#F59E0B" strokeWidth={2.2} />
              <Text style={styles.announcementBadgeText}>ANNOUNCEMENT</Text>
            </View>
            {item.isPinned && (
              <View style={styles.pinnedBadge}>
                <Text style={styles.pinnedBadgeText}>PINNED</Text>
              </View>
            )}
          </View>

          <Text style={styles.announcementTitle}>{item.title}</Text>
          <Text style={styles.announcementContent} numberOfLines={3}>
            {item.content}
          </Text>

          <View style={styles.announcementFooter}>
            <Text style={styles.announcementDate}>
              {item.announcementDetails?.date || 'May 26, 2025'} •{' '}
              {item.announcementDetails?.time || '8:00 AM'}
            </Text>
            <View style={styles.announcementActionRow}>
              <Text style={styles.announcementActionText}>
                {item.announcementDetails?.actionLabel || 'Details'}
              </Text>
              <ChevronRight size={16} color="#FFFFFF" strokeWidth={2.2} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // Render standard card / project / event / praise report
  return (
    <View style={styles.card}>
      {/* ===== Card Header ===== */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.authorContainer}
          activeOpacity={0.8}
          onPress={openPostDetails}
        >
          {item.authorAvatar ? (
            <Image
              source={{ uri: item.authorAvatar }}
              style={styles.authorAvatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.churchAvatarBox}>
              <ChurchIcon size={18} color="#FFFFFF" strokeWidth={2} />
            </View>
          )}

          <View style={styles.authorInfo}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorName} numberOfLines={1}>
                {item.authorName}
              </Text>
              {item.authorBadge && (
                <View
                  style={[
                    styles.badgePill,
                    item.authorBadge === 'Admin' ? styles.adminBadge : styles.ministryBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      item.authorBadge === 'Admin'
                        ? styles.adminBadgeText
                        : styles.ministryBadgeText,
                    ]}
                  >
                    {item.authorBadge}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.timeAgo}>{formatTimeAgo(item.createdAt)}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Globe size={11} color={MemberTheme.textMuted} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moreButton}
          activeOpacity={0.7}
          onPress={openPostDetails}
          accessibilityRole="button"
          accessibilityLabel="Post options"
        >
          <MoreHorizontal size={20} color={MemberTheme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* ===== Post Title & Text ===== */}
      {item.title ? (
        <Text style={styles.postTitle} onPress={openPostDetails}>
          {item.title}
        </Text>
      ) : null}

      <Text
        style={styles.postContent}
        numberOfLines={expandedText ? undefined : 4}
      >
        {item.content}
      </Text>

      {item.content.length > 180 && !expandedText && (
        <TouchableOpacity
          onPress={() => setExpandedText(true)}
          style={styles.readMoreButton}
        >
          <Text style={styles.readMoreText}>Read more</Text>
        </TouchableOpacity>
      )}

      {/* ===== Media / Project Content ===== */}
      {item.mediaUrls && item.mediaUrls.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={openPostDetails}
          style={styles.mediaContainer}
        >
          <Image
            source={{ uri: item.mediaUrls[0] }}
            style={styles.singleImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      {/* ===== Project Progress Widget ===== */}
      {isProject && item.projectProgress && (
        <View style={styles.projectProgressCard}>
          <View style={styles.progressCol}>
            <Text style={styles.progressLabel}>Total Raised</Text>
            <Text style={styles.progressValue}>
              {item.projectProgress.currency} {item.projectProgress.totalRaised.toLocaleString()}
            </Text>
          </View>

          <View style={styles.progressPercentCircle}>
            <Text style={styles.percentText}>{item.projectProgress.percentage}%</Text>
          </View>

          <View style={[styles.progressCol, styles.progressColRight]}>
            <Text style={styles.progressLabel}>Goal</Text>
            <Text style={styles.progressValue}>
              {item.projectProgress.currency} {item.projectProgress.goal.toLocaleString()}
            </Text>
          </View>
        </View>
      )}

      {/* ===== Event Content Card ===== */}
      {isEvent && item.eventDetails && (
        <TouchableOpacity
          style={styles.eventRowCard}
          activeOpacity={0.85}
          onPress={() => router.push('/events')}
        >
          <View style={styles.eventDetailsCol}>
            <View style={styles.eventBadge}>
              <CalendarDays size={13} color="#3F7A3A" strokeWidth={2.2} />
              <Text style={styles.eventBadgeText}>EVENT</Text>
            </View>

            <Text style={styles.eventTitle} numberOfLines={1}>
              {item.title || 'Church Event'}
            </Text>
            <Text style={styles.eventDescription} numberOfLines={2}>
              {item.content}
            </Text>
            <Text style={styles.eventTimeText}>
              {item.eventDetails.date} • {item.eventDetails.time}
            </Text>
            <Text style={styles.eventLocationText} numberOfLines={1}>
              {item.eventDetails.location}
            </Text>
          </View>

          {item.eventDetails.bannerUrl && (
            <Image
              source={{ uri: item.eventDetails.bannerUrl }}
              style={styles.eventThumbnail}
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
      )}

      {/* ===== Reactions Summary Row ===== */}
      <View style={styles.summaryRow}>
        <View style={styles.reactionIconsSummary}>
          <View style={styles.reactionIconStack}>
            <Text style={styles.summaryEmoji}>👍</Text>
            <Text style={styles.summaryEmoji}>❤️</Text>
            <Text style={styles.summaryEmoji}>🙏</Text>
          </View>
          <Text style={styles.totalReactionsCount}>{item.totalReactions}</Text>
        </View>

        <View style={styles.countsRight}>
          <TouchableOpacity
            onPress={() => setShowCommentsSection(!showCommentsSection)}
            activeOpacity={0.7}
          >
            <Text style={styles.countText}>{item.commentsCount} comments</Text>
          </TouchableOpacity>
          {item.sharesCount ? (
            <>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.countText}>{item.sharesCount} shares</Text>
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.divider} />

      {/* ===== Action Buttons Bar ===== */}
      <View style={styles.actionsBar}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            const nextReaction: ReactionType = item.userReaction ? item.userReaction : 'like';
            onReact(item.id, nextReaction);
          }}
          onLongPress={() => setShowReactionPicker(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="React to post"
        >
          {item.userReaction === 'love' ? (
            <Heart size={18} color="#E11D48" fill="#E11D48" />
          ) : item.userReaction === 'amen' ? (
            <Text style={{ fontSize: 16 }}>🙏</Text>
          ) : (
            <ThumbsUp
              size={18}
              color={item.userReaction ? '#3F7A3A' : MemberTheme.textSecondary}
              fill={item.userReaction ? '#3F7A3A' : 'none'}
            />
          )}
          <Text
            style={[
              styles.actionBtnText,
              item.userReaction ? styles.actionBtnActive : null,
            ]}
          >
            {item.userReaction
              ? item.userReaction.charAt(0).toUpperCase() + item.userReaction.slice(1)
              : 'Like'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            if (showInlineComments) {
              setShowCommentsSection(!showCommentsSection);
            } else {
              openPostDetails();
            }
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Comments"
        >
          <MessageSquare size={18} color={MemberTheme.textSecondary} />
          <Text style={styles.actionBtnText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleShare}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Share post"
        >
          <Share2 size={18} color={MemberTheme.textSecondary} />
          <Text style={styles.actionBtnText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* ===== Inline Comments Preview ===== */}
      {showInlineComments && showCommentsSection && (
        <View style={styles.inlineCommentsSection}>
          <View style={styles.commentsDivider} />

          {item.recentComments && item.recentComments.length > 0 ? (
            <View style={styles.commentList}>
              {item.recentComments.slice(0, 2).map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  {comment.authorAvatar ? (
                    <Image
                      source={{ uri: comment.authorAvatar }}
                      style={styles.commentAvatar}
                    />
                  ) : (
                    <View style={styles.commentAvatarFallback}>
                      <Text style={styles.commentAvatarInitials}>
                        {comment.authorName.charAt(0)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.commentBubble}>
                    <Text style={styles.commentAuthor}>{comment.authorName}</Text>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                    <View style={styles.commentMetaRow}>
                      <Text style={styles.commentTime}>
                        {formatTimeAgo(comment.createdAt)}
                      </Text>
                      {comment.likesCount > 0 && (
                        <View style={styles.commentLikeBadge}>
                          <Text style={{ fontSize: 10 }}>👍 {comment.likesCount}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}

              {item.commentsCount > 2 && (
                <TouchableOpacity
                  style={styles.viewMoreCommentsBtn}
                  onPress={openPostDetails}
                >
                  <Text style={styles.viewMoreCommentsText}>
                    View all {item.commentsCount} comments
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Text style={styles.noCommentsText}>Be the first to comment</Text>
          )}

          {/* Quick Comment Input */}
          <View style={styles.commentInputRow}>
            {currentUserAvatar ? (
              <Image
                source={{ uri: currentUserAvatar }}
                style={styles.currentUserSmallAvatar}
              />
            ) : (
              <View style={styles.currentUserSmallAvatarFallback}>
                <Text style={styles.fallbackInitials}>
                  {currentUserName.charAt(0)}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Write a comment..."
                placeholderTextColor={MemberTheme.textMuted}
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              {commentText.trim().length > 0 && (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendComment}
                  accessibilityRole="button"
                  accessibilityLabel="Send comment"
                >
                  <Send size={16} color="#3F7A3A" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Reaction Picker Popup */}
      <ReactionPickerModal
        visible={showReactionPicker}
        onClose={() => setShowReactionPicker(false)}
        onSelectReaction={(type) => onReact(item.id, type)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 16,
    marginBottom: 16,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  authorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: MemberTheme.skeleton,
  },
  churchAvatarBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: MemberTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInfo: {
    flex: 1,
    gap: 2,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  adminBadge: {
    backgroundColor: '#EAF2E7',
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3F7A3A',
    fontFamily: 'Inter-SemiBold',
  },
  ministryBadge: {
    backgroundColor: '#FEF3C7',
  },
  ministryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
    fontFamily: 'Inter-SemiBold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  metaDot: {
    fontSize: 11,
    color: MemberTheme.textMuted,
  },
  moreButton: {
    padding: 6,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    marginBottom: 6,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 21,
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  readMoreButton: {
    marginTop: 4,
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3F7A3A',
    fontFamily: 'Inter-SemiBold',
  },
  mediaContainer: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: MemberTheme.skeleton,
  },
  singleImage: {
    width: '100%',
    height: 200,
  },
  projectProgressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F7F3',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
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
    fontSize: 11.5,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  progressValue: {
    fontSize: 14.5,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    marginTop: 2,
  },
  progressPercentCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#3F7A3A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MemberTheme.surface,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3F7A3A',
    fontFamily: 'Inter-Bold',
  },
  eventRowCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F7F3',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 12,
    marginTop: 12,
    gap: 12,
  },
  eventDetailsCol: {
    flex: 1,
    gap: 3,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  eventBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#3F7A3A',
    letterSpacing: 0.5,
    fontFamily: 'Inter-Bold',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  eventDescription: {
    fontSize: 12.5,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
    lineHeight: 17,
  },
  eventTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: MemberTheme.textPrimary,
    marginTop: 4,
    fontFamily: 'Inter-SemiBold',
  },
  eventLocationText: {
    fontSize: 11.5,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  eventThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: MemberTheme.skeleton,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  reactionIconsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reactionIconStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryEmoji: {
    fontSize: 14,
    marginRight: -3,
  },
  totalReactionsCount: {
    fontSize: 12.5,
    color: MemberTheme.textSecondary,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  countsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countText: {
    fontSize: 12.5,
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
    fontSize: 13,
    fontWeight: '600',
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-SemiBold',
  },
  actionBtnActive: {
    color: '#3F7A3A',
  },
  // Announcement Card specific styles
  announcementCard: {
    backgroundColor: MemberTheme.primary, // ChurchEden Green
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  announcementTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  announcementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  announcementBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    letterSpacing: 0.8,
    fontFamily: 'Inter-Bold',
  },
  pinnedBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pinnedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B',
    fontFamily: 'Inter-Bold',
  },
  announcementTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    marginBottom: 6,
  },
  announcementContent: {
    fontSize: 13.5,
    color: '#D1D5DB',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
    marginBottom: 14,
  },
  announcementFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    paddingTop: 12,
  },
  announcementDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  announcementActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  announcementActionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  // Inline comments styles
  inlineCommentsSection: {
    marginTop: 6,
  },
  commentsDivider: {
    height: 1,
    backgroundColor: MemberTheme.divider,
    marginBottom: 12,
  },
  commentList: {
    gap: 10,
    marginBottom: 12,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 10,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MemberTheme.skeleton,
  },
  commentAvatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MemberTheme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: MemberTheme.primary,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: '#F8F7F3',
    borderRadius: 14,
    padding: 10,
  },
  commentAuthor: {
    fontSize: 12.5,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  commentContent: {
    fontSize: 13,
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  commentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  commentTime: {
    fontSize: 11,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  commentLikeBadge: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
  },
  viewMoreCommentsBtn: {
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  viewMoreCommentsText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#3F7A3A',
    fontFamily: 'Inter-SemiBold',
  },
  noCommentsText: {
    fontSize: 12.5,
    color: MemberTheme.textMuted,
    marginBottom: 10,
    fontFamily: 'Inter-Regular',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  currentUserSmallAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MemberTheme.skeleton,
  },
  currentUserSmallAvatarFallback: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MemberTheme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackInitials: {
    fontSize: 11,
    fontWeight: '700',
    color: MemberTheme.primary,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F7F3',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Regular',
    maxHeight: 80,
  },
  sendButton: {
    padding: 4,
    marginLeft: 4,
  },
});

export default FeedPostCard;
