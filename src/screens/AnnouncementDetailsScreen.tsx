import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MemberTheme } from '../constants/memberTheme';
import { ChurchFeedItem } from '../types';
import { churchFeedService } from '../services/churchFeedService';
import {
  ChevronLeft,
  Megaphone,
  Share2,
  Calendar,
  UserCheck,
  Church as ChurchIcon,
} from 'lucide-react-native';

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Aug 27, 2026';
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function AnnouncementDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<ChurchFeedItem | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (id) {
          const res = await churchFeedService.getPostById(id);
          if (res.success) {
            setItem(res.data);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleShare = async () => {
    if (!item) return;
    try {
      await Share.share({
        message: `${item.title ? item.title + '\n' : ''}${item.content}\nShared from ChurchEden`,
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
          <Text style={styles.headerTitle}>Announcement</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerFill}>
          <ActivityIndicator color={MemberTheme.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={22} color={MemberTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Announcement</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>Announcement not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = formatFullDate(item.createdAt);

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
        <Text style={styles.headerTitle}>Announcement</Text>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.shareHeaderBtn}
          accessibilityRole="button"
          accessibilityLabel="Share announcement"
        >
          <Share2 size={20} color={MemberTheme.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Announcement Card */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Megaphone size={13} color={MemberTheme.primary} />
              <Text style={styles.categoryText}>
                {(item.authorBadge || 'CHURCH ANNOUNCEMENT').toUpperCase()}
              </Text>
            </View>
            {item.isPinned && (
              <View style={styles.pinnedBadge}>
                <Text style={styles.pinnedText}>PINNED</Text>
              </View>
            )}
          </View>

          {item.title ? <Text style={styles.title}>{item.title}</Text> : null}

          {/* Author & Meta Row */}
          <View style={styles.authorRow}>
            {item.authorAvatar ? (
              <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
            ) : (
              <View style={styles.authorAvatarFallback}>
                <ChurchIcon size={18} color="#FFFFFF" />
              </View>
            )}
            <View style={styles.authorCol}>
              <Text style={styles.authorName}>{item.authorName}</Text>
              <Text style={styles.authorRole}>
                {item.authorRole || 'Church Administration'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.dateMetaRow}>
            <Calendar size={15} color={MemberTheme.primary} />
            <Text style={styles.dateText}>Published on {formattedDate}</Text>
          </View>

          {item.mediaUrls && item.mediaUrls.length > 0 && (
            <Image
              source={{ uri: item.mediaUrls[0] }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          )}

          {/* Announcement Content */}
          <Text style={styles.bodyText}>{item.content}</Text>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.85}>
          <Share2 size={18} color={MemberTheme.textOnDark} />
          <Text style={styles.shareButtonText}>Share Announcement</Text>
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
    paddingTop: 16,
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
  shareHeaderBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  card: {
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
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAF2E7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: MemberTheme.primary,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  pinnedBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pinnedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    fontFamily: 'Inter-Bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    lineHeight: 26,
    marginTop: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MemberTheme.skeleton,
  },
  authorAvatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10233F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorCol: {
    flex: 1,
  },
  authorName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  authorRole: {
    fontSize: 12,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: MemberTheme.divider,
    marginVertical: 4,
  },
  dateMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 13,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginVertical: 6,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MemberTheme.primary,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: MemberTheme.textOnDark,
    fontFamily: 'Inter-Bold',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default AnnouncementDetailsScreen;
