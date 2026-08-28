import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { MemberTheme } from '../../constants/memberTheme';

export function DashboardSkeleton() {
  const shimmer = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 0.75,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const opacity = { opacity: shimmer };

  return (
    <View style={styles.root}>
      {/* Greeting */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Animated.View style={[styles.line, { width: 120, height: 16 }, opacity]} />
          <Animated.View style={[styles.line, { width: 150, height: 26, marginTop: 6 }, opacity]} />
          <Animated.View style={[styles.line, { width: 180, height: 13, marginTop: 10 }, opacity]} />
        </View>
        <View style={styles.headerRight}>
          <Animated.View style={[styles.circle, { width: 42, height: 42 }, opacity]} />
          <Animated.View style={[styles.circle, { width: 44, height: 44 }, opacity]} />
        </View>
      </View>

      {/* Church identity card */}
      <Animated.View style={[styles.card, styles.churchCard, opacity]}>
        <Animated.View style={[styles.square, { width: 76, height: 76, borderRadius: 16 }, opacity]} />
        <View style={styles.churchCardBody}>
          <Animated.View style={[styles.line, { width: 80, height: 12 }, opacity]} />
          <Animated.View style={[styles.line, { width: 160, height: 18, marginTop: 8 }, opacity]} />
          <Animated.View style={[styles.line, { width: 110, height: 13, marginTop: 8 }, opacity]} />
        </View>
      </Animated.View>

      {/* Summary card */}
      <Animated.View style={[styles.card, styles.summaryCard, opacity]}>
        <View style={styles.summaryRow}>
          <Animated.View style={[styles.circle, { width: 46, height: 46 }, opacity]} />
          <View style={styles.summaryCol}>
            <Animated.View style={[styles.line, { width: 100, height: 14 }, opacity]} />
            <Animated.View style={[styles.line, { width: 90, height: 12, marginTop: 8 }, opacity]} />
          </View>
        </View>
        <Animated.View style={[styles.line, { width: '100%', height: 34, marginTop: 18 }, opacity]} />
        <Animated.View style={[styles.line, { width: '60%', height: 34, marginTop: 10 }, opacity]} />
        <Animated.View style={[styles.lineDivider, { marginTop: 18 }, opacity]} />
      </Animated.View>

      {/* Section heading */}
      <View style={styles.sectionRow}>
        <Animated.View style={[styles.line, { width: 140, height: 18 }, opacity]} />
        <Animated.View style={[styles.line, { width: 70, height: 14 }, opacity]} />
      </View>

      {/* Event card */}
      <Animated.View style={[styles.eventCard, opacity]}>
        <Animated.View style={[styles.eventImage, opacity]} />
        <Animated.View style={[styles.line, { width: '85%', height: 15, marginTop: 12 }, opacity]} />
        <Animated.View style={[styles.line, { width: '55%', height: 12, marginTop: 8 }, opacity]} />
      </Animated.View>

      {/* Section heading */}
      <View style={styles.sectionRow}>
        <Animated.View style={[styles.line, { width: 160, height: 18 }, opacity]} />
        <Animated.View style={[styles.line, { width: 70, height: 14 }, opacity]} />
      </View>

      <Animated.View style={[styles.card, styles.announcementCard, opacity]}>
        <Animated.View style={[styles.circle, { width: 42, height: 42 }, opacity]} />
        <View style={styles.announcementBody}>
          <Animated.View style={[styles.line, { width: '90%', height: 14 }, opacity]} />
          <Animated.View style={[styles.line, { width: '100%', height: 12, marginTop: 8 }, opacity]} />
          <Animated.View style={[styles.line, { width: '45%', height: 11, marginTop: 8 }, opacity]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  card: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  churchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  churchCardBody: {
    flex: 1,
  },
  square: {
    backgroundColor: MemberTheme.skeleton,
    borderRadius: 14,
  },
  summaryCard: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  summaryCol: {
    flex: 1,
  },
  circle: {
    backgroundColor: MemberTheme.skeleton,
    borderRadius: 999,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  eventCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    overflow: 'hidden',
    paddingBottom: 16,
  },
  eventImage: {
    height: 120,
    backgroundColor: MemberTheme.skeleton,
  },
  announcementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  announcementBody: {
    flex: 1,
  },
  lineDivider: {
    height: 1,
    backgroundColor: MemberTheme.divider,
    alignSelf: 'stretch',
  },
  line: {
    backgroundColor: MemberTheme.skeleton,
    borderRadius: 6,
  },
});

export default DashboardSkeleton;
