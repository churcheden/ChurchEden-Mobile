import {
  ChurchFeedItem,
  FeedCategoryFilter,
  FeedComment,
  ReactionType,
  ApiResponse,
  ChurchEvent,
} from '../types';
import { memberDashboardService } from './memberDashboardService';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const INITIAL_COMMENTS: Record<string, FeedComment[]> = {
  feed_proj_1: [
    {
      id: 'c_1',
      postId: 'feed_proj_1',
      authorId: 'u_akosua',
      authorName: 'Akosua Boateng',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      content: 'Glory to God! This is amazing! 🙌',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likesCount: 5,
      isLikedByMe: false,
    },
    {
      id: 'c_2',
      postId: 'feed_proj_1',
      authorId: 'u_kwame',
      authorName: 'Kwame Asante',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      content: 'Proud to be part of what God is building in our church!',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      likesCount: 3,
      isLikedByMe: true,
    },
    {
      id: 'c_3',
      postId: 'feed_proj_1',
      authorId: 'u_abena',
      authorName: 'Abena Taylor',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      content: 'How can I contribute further to help us reach the goal?',
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      likesCount: 2,
      isLikedByMe: false,
    },
    {
      id: 'c_4',
      postId: 'feed_proj_1',
      authorId: 'u_kofi',
      authorName: 'Kofi Mensah',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      content: 'God will surely complete what He has started. Amen!',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      likesCount: 4,
      isLikedByMe: false,
    },
    {
      id: 'c_5',
      postId: 'feed_proj_1',
      authorId: 'u_adjoa',
      authorName: 'Adjoa Darko',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      content: 'Such great progress! Cheering our church family on.',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      likesCount: 1,
      isLikedByMe: false,
    },
  ],
  feed_ann_1: [
    {
      id: 'c_ann_1',
      postId: 'feed_ann_1',
      authorId: 'u_adjoa',
      authorName: 'Adjoa Darko',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      content: 'Can’t wait for Sunday service with the family! 🙏',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      likesCount: 3,
    },
    {
      id: 'c_ann_2',
      postId: 'feed_ann_1',
      authorId: 'u_kwame',
      authorName: 'Kwame Asante',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      content: 'Inviting two neighbors to come along with me.',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      likesCount: 2,
    },
  ],
  feed_event_1: [
    {
      id: 'c_ev_1',
      postId: 'feed_event_1',
      authorId: 'u_emmanuel',
      authorName: 'Emmanuel Osei',
      authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      content: 'Looking forward to an explosive night in His presence! 🔥',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likesCount: 6,
    },
  ],
  feed_praise_1: [
    {
      id: 'c_pr_1',
      postId: 'feed_praise_1',
      authorId: 'u_pastor',
      authorName: 'Pastor Samuel Eden',
      authorRole: 'Pastor',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      content: 'Amen Sister Sarah! God is faithful to his promises.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likesCount: 8,
    },
  ],
};

const INITIAL_FEED_ITEMS: ChurchFeedItem[] = [
  {
    id: 'feed_ann_1',
    churchId: 'church_1',
    authorId: 'adm_1',
    authorName: 'Church Admin',
    authorBadge: 'Admin',
    authorRole: 'Church Administration',
    contentType: 'announcement',
    title: 'Sunday Service this weekend',
    content:
      'Join us this Sunday for a powerful time in God’s presence. Come expecting a breakthrough, inspiring worship, and transformative fellowship. Don’t come alone!',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isPinned: true,
    announcementDetails: {
      date: 'May 26, 2025',
      time: '8:00 AM',
      actionLabel: 'View Details',
    },
    reactionSummary: [
      { type: 'like', count: 32 },
      { type: 'love', count: 24 },
      { type: 'amen', count: 18 },
    ],
    totalReactions: 74,
    userReaction: null,
    commentsCount: 6,
    sharesCount: 12,
    commentsEnabled: true,
    recentComments: INITIAL_COMMENTS['feed_ann_1'],
  },
  {
    id: 'feed_proj_1',
    churchId: 'church_1',
    authorId: 'adm_1',
    authorName: 'Church Admin',
    authorBadge: 'Admin',
    authorRole: 'Church Administration',
    contentType: 'project',
    title: 'Building Project Update 🚧',
    content:
      'We’re excited to share that we’ve reached 65% of our building project goal! Thank you for your generosity, sacrificial giving, and support. Let’s keep going to completion! 🙌',
    mediaUrls: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1200&auto=format&fit=crop',
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    projectProgress: {
      totalRaised: 162500,
      goal: 250000,
      currency: 'GHS',
      percentage: 65,
    },
    reactionSummary: [
      { type: 'like', count: 68 },
      { type: 'love', count: 42 },
      { type: 'amen', count: 14 },
    ],
    totalReactions: 124,
    userReaction: 'like',
    commentsCount: 32,
    sharesCount: 18,
    commentsEnabled: true,
    recentComments: INITIAL_COMMENTS['feed_proj_1']?.slice(0, 2),
  },
  {
    id: 'feed_event_1',
    churchId: 'church_1',
    authorId: 'min_youth',
    authorName: 'Youth Ministry',
    authorBadge: 'Ministry',
    authorRole: 'NextGen Ministry',
    contentType: 'event',
    title: 'Youth Prayer Night',
    content:
      'A night of prayer, worship and the Word. All youths, students, and young professionals are warmly invited!',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    eventDetails: {
      eventId: 'upcoming_3',
      date: 'Fri, May 30',
      time: '6:00 PM',
      location: 'Main Auditorium',
      bannerUrl:
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop',
    },
    reactionSummary: [
      { type: 'like', count: 45 },
      { type: 'amen', count: 28 },
      { type: 'celebrate', count: 13 },
    ],
    totalReactions: 86,
    userReaction: null,
    commentsCount: 14,
    sharesCount: 9,
    commentsEnabled: true,
    recentComments: INITIAL_COMMENTS['feed_event_1'],
  },
  {
    id: 'feed_praise_1',
    churchId: 'church_1',
    authorId: 'mbr_sarah',
    authorName: 'Sarah Mensah',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    contentType: 'praise_report',
    content:
      'Grateful for today’s service! The message was exactly what I needed. God is so faithful and answers prayers in seasons we least expect! 🙏❤️',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    reactionSummary: [
      { type: 'amen', count: 32 },
      { type: 'love', count: 20 },
    ],
    totalReactions: 52,
    userReaction: 'love',
    commentsCount: 8,
    sharesCount: 3,
    commentsEnabled: true,
    recentComments: INITIAL_COMMENTS['feed_praise_1'],
  },
  {
    id: 'feed_min_1',
    churchId: 'church_1',
    authorId: 'min_children',
    authorName: 'Children & Family Ministry',
    authorBadge: 'Ministry',
    authorRole: 'Kingdom Kids',
    contentType: 'ministry',
    title: 'Kids Vacation Bible School Registration is Open',
    content:
      'Registration for this year’s Vacation Bible School is officially open. Give your kids a summer filled with scripture exploration, interactive games, and creative worship.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=1200&auto=format&fit=crop',
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reactionSummary: [
      { type: 'like', count: 24 },
      { type: 'love', count: 15 },
    ],
    totalReactions: 39,
    userReaction: null,
    commentsCount: 5,
    sharesCount: 4,
    commentsEnabled: true,
  },
];

class ChurchFeedService {
  private feed: ChurchFeedItem[] = [...INITIAL_FEED_ITEMS];
  private comments: Record<string, FeedComment[]> = { ...INITIAL_COMMENTS };

  /**
   * Get filtered feed for the church
   */
  async getFeed(
    churchId: string,
    filter: FeedCategoryFilter = 'all'
  ): Promise<ApiResponse<ChurchFeedItem[]>> {
    await delay(350);

    let items = [...this.feed];

    if (filter === 'announcements') {
      items = items.filter((i) => i.contentType === 'announcement');
    } else if (filter === 'events') {
      items = items.filter((i) => i.contentType === 'event');
    } else if (filter === 'praise_reports') {
      items = items.filter((i) => i.contentType === 'praise_report');
    } else if (filter === 'ministries') {
      items = items.filter((i) => i.contentType === 'ministry');
    } else if (filter === 'projects') {
      items = items.filter((i) => i.contentType === 'project');
    }

    // Attach latest recent comments
    const result = items.map((item) => {
      const itemComments = this.comments[item.id] || [];
      return {
        ...item,
        commentsCount: itemComments.length || item.commentsCount,
        recentComments: itemComments.slice(0, 2),
      };
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Get single post by ID
   */
  async getPostById(postId: string): Promise<ApiResponse<ChurchFeedItem>> {
    await delay(250);
    const item = this.feed.find((p) => p.id === postId);
    if (!item) {
      return {
        success: false,
        data: null as unknown as ChurchFeedItem,
        error: 'Post not found',
      };
    }

    const itemComments = this.comments[postId] || [];
    return {
      success: true,
      data: {
        ...item,
        commentsCount: itemComments.length || item.commentsCount,
        recentComments: itemComments,
      },
    };
  }

  /**
   * Toggle reaction on a post
   */
  async toggleReaction(
    postId: string,
    reactionType: ReactionType,
    userId: string = 'current_user'
  ): Promise<ApiResponse<{ userReaction: ReactionType | null; totalReactions: number }>> {
    await delay(150);

    const postIndex = this.feed.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      return {
        success: false,
        data: { userReaction: null, totalReactions: 0 },
        error: 'Post not found',
      };
    }

    const post = { ...this.feed[postIndex] };
    const currentReaction = post.userReaction;

    if (currentReaction === reactionType) {
      // User is removing reaction
      post.userReaction = null;
      post.totalReactions = Math.max(0, post.totalReactions - 1);
    } else {
      // Switching or adding reaction
      if (!currentReaction) {
        post.totalReactions += 1;
      }
      post.userReaction = reactionType;
    }

    this.feed[postIndex] = post;

    return {
      success: true,
      data: {
        userReaction: post.userReaction,
        totalReactions: post.totalReactions,
      },
    };
  }

  /**
   * Get comments for a post
   */
  async getComments(
    postId: string,
    sort: 'relevant' | 'newest' = 'relevant'
  ): Promise<ApiResponse<FeedComment[]>> {
    await delay(200);
    const list = [...(this.comments[postId] || [])];

    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      list.sort((a, b) => b.likesCount - a.likesCount);
    }

    return {
      success: true,
      data: list,
    };
  }

  /**
   * Add a comment to a post
   */
  async addComment(
    postId: string,
    commentData: {
      text: string;
      userId?: string;
      authorName: string;
      authorAvatar?: string;
      authorRole?: string;
    }
  ): Promise<ApiResponse<FeedComment>> {
    await delay(250);

    const newComment: FeedComment = {
      id: `c_${Date.now()}`,
      postId,
      authorId: commentData.userId || 'current_user',
      authorName: commentData.authorName,
      authorAvatar: commentData.authorAvatar,
      authorRole: commentData.authorRole,
      content: commentData.text,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLikedByMe: false,
    };

    if (!this.comments[postId]) {
      this.comments[postId] = [];
    }

    this.comments[postId].unshift(newComment);

    const postIndex = this.feed.findIndex((p) => p.id === postId);
    if (postIndex !== -1) {
      this.feed[postIndex].commentsCount = this.comments[postId].length;
    }

    return {
      success: true,
      data: newComment,
    };
  }

  /**
   * Toggle like on a comment
   */
  async toggleCommentLike(
    postId: string,
    commentId: string
  ): Promise<ApiResponse<{ isLiked: boolean; likesCount: number }>> {
    await delay(120);

    const commentsList = this.comments[postId];
    if (!commentsList) {
      return { success: false, data: { isLiked: false, likesCount: 0 }, error: 'Not found' };
    }

    const comment = commentsList.find((c) => c.id === commentId);
    if (!comment) {
      return { success: false, data: { isLiked: false, likesCount: 0 }, error: 'Comment not found' };
    }

    if (comment.isLikedByMe) {
      comment.isLikedByMe = false;
      comment.likesCount = Math.max(0, comment.likesCount - 1);
    } else {
      comment.isLikedByMe = true;
      comment.likesCount += 1;
    }

    return {
      success: true,
      data: {
        isLiked: !!comment.isLikedByMe,
        likesCount: comment.likesCount,
      },
    };
  }

  /**
   * Get upcoming events for horizontal carousel
   */
  async getUpcomingEvents(): Promise<ApiResponse<ChurchEvent[]>> {
    return memberDashboardService.getUpcomingEvents();
  }
}

export const churchFeedService = new ChurchFeedService();
export default churchFeedService;
