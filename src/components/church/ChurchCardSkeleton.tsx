import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export function ChurchCardSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  return (
    <View style={styles.card}>
      {/* Icon Placeholder */}
      <Animated.View style={[styles.iconBox, { opacity: shimmerAnim }]} />

      {/* Info Placeholders */}
      <View style={styles.infoCol}>
        <Animated.View style={[styles.nameLine, { opacity: shimmerAnim }]} />
        <Animated.View style={[styles.locationLine, { opacity: shimmerAnim }]} />
      </View>

      {/* Chevron Placeholder */}
      <Animated.View style={[styles.chevronBox, { opacity: shimmerAnim }]} />
    </View>
  );
}

export function ChurchListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <ChurchCardSkeleton key={`skeleton_${index}`} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#E5E0D8',
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
    gap: 8,
  },
  nameLine: {
    height: 16,
    width: '70%',
    borderRadius: 6,
    backgroundColor: '#E5E0D8',
  },
  locationLine: {
    height: 12,
    width: '45%',
    borderRadius: 5,
    backgroundColor: '#ECE7DF',
  },
  chevronBox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ECE7DF',
    marginLeft: 8,
  },
});

export default ChurchCardSkeleton;
