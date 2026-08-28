import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MemberTheme } from '../../constants/memberTheme';

export function FeedSkeleton() {
  return (
    <View style={styles.container}>
      {/* Church hero skeleton */}
      <View style={styles.heroCardSkeleton}>
        <View style={styles.avatarSkeleton} />
        <View style={styles.heroTextCol}>
          <View style={[styles.skeletonLine, { width: '60%', height: 16 }]} />
          <View style={[styles.skeletonLine, { width: '40%', height: 12 }]} />
          <View style={[styles.skeletonLine, { width: '50%', height: 10 }]} />
        </View>
      </View>

      {/* Filter pills skeleton */}
      <View style={styles.pillsRow}>
        <View style={[styles.pillSkeleton, { width: 50 }]} />
        <View style={[styles.pillSkeleton, { width: 110 }]} />
        <View style={[styles.pillSkeleton, { width: 80 }]} />
        <View style={[styles.pillSkeleton, { width: 100 }]} />
      </View>

      {/* Featured card skeleton */}
      <View style={styles.featuredCardSkeleton}>
        <View style={[styles.skeletonLine, { width: '40%', height: 12 }]} />
        <View style={[styles.skeletonLine, { width: '80%', height: 18 }]} />
        <View style={[styles.skeletonLine, { width: '95%', height: 14 }]} />
        <View style={[styles.skeletonLine, { width: '65%', height: 14 }]} />
      </View>

      {/* Feed post card skeleton */}
      <View style={styles.postCardSkeleton}>
        <View style={styles.headerRow}>
          <View style={styles.avatarSkeleton} />
          <View style={styles.heroTextCol}>
            <View style={[styles.skeletonLine, { width: '50%', height: 14 }]} />
            <View style={[styles.skeletonLine, { width: '30%', height: 10 }]} />
          </View>
        </View>
        <View style={[styles.skeletonLine, { width: '70%', height: 16 }]} />
        <View style={[styles.skeletonLine, { width: '100%', height: 14 }]} />
        <View style={[styles.skeletonLine, { width: '85%', height: 14 }]} />
        <View style={styles.mediaSkeleton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heroCardSkeleton: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  avatarSkeleton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: MemberTheme.skeleton,
  },
  heroTextCol: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    borderRadius: 6,
    backgroundColor: MemberTheme.skeleton,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  pillSkeleton: {
    height: 34,
    borderRadius: 17,
    backgroundColor: MemberTheme.skeleton,
  },
  featuredCardSkeleton: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 18,
    gap: 10,
    marginBottom: 16,
  },
  postCardSkeleton: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 16,
    gap: 10,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mediaSkeleton: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    backgroundColor: MemberTheme.skeleton,
    marginTop: 6,
  },
});

export default FeedSkeleton;
