import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { ChurchEdenLogo } from '../common/ChurchEdenLogo';

import churchService from '../../services/churchService';

interface SplashScreenProps {
  /**
   * Optional custom callback when splash duration finishes.
   * If omitted, defaults to navigating to `/find-church` (or `/pending-approval` if request active).
   */
  onFinish?: () => void;
  /**
   * Total splash visibility duration in milliseconds before navigation.
   * Defaults to 3000ms.
   */
  durationMs?: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function SplashScreen({ onFinish, durationMs = 3000 }: SplashScreenProps) {
  // Animated opacity values for staggered fade-in
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Staggered fade-in animations for branding elements
    const animationGroup = Animated.stagger(250, [
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(wordmarkOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    animationGroup.start();

    // 2. Start exit fade animation slightly before navigation timeout
    const exitFadeTimer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }, Math.max(0, durationMs - 350));

    // 3. Navigation timeout (approx 3000ms total)
    const navTimer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      } else {
        const activeRequest = churchService.getActiveJoinRequest();
        if (activeRequest && activeRequest.status === 'pending') {
          router.replace('/pending-approval');
        } else {
          router.replace('/find-church');
        }
      }
    }, durationMs);

    // Cleanup timers and animations on unmount to prevent memory leaks
    return () => {
      animationGroup.stop();
      clearTimeout(exitFadeTimer);
      clearTimeout(navTimer);
    };
  }, [durationMs, logoOpacity, wordmarkOpacity, taglineOpacity, screenOpacity, onFinish]);

  return (
    <Animated.View style={[styles.rootContainer, { opacity: screenOpacity }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredWrapper}>
          <View style={styles.brandingGroup}>
            {/* 1. ChurchEden Gold Logo */}
            <Animated.View style={{ opacity: logoOpacity }}>
              <ChurchEdenLogo size={135} color="#C98A16" />
            </Animated.View>

            {/* 2. ChurchEden Wordmark */}
            <Animated.View style={[styles.wordmarkContainer, { opacity: wordmarkOpacity }]}>
              <Text style={styles.wordmarkText}>ChurchEden</Text>
            </Animated.View>

            {/* 3. Brand Tagline */}
            <Animated.View style={[styles.taglineContainer, { opacity: taglineOpacity }]}>
              <Text style={styles.taglineText}>FAITH. PEOPLE. PURPOSE.</Text>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F5F0E8', // Soft premium beige / warm cream background
  },
  safeArea: {
    flex: 1,
  },
  centeredWrapper: {
    flex: 1,
    alignItems: 'center',
    // Position branding group slightly above exact vertical center (~45% screen height)
    paddingTop: SCREEN_HEIGHT * 0.28,
  },
  brandingGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkContainer: {
    marginTop: 24,
  },
  wordmarkText: {
    fontSize: 46,
    color: '#07182F', // Dark navy
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  taglineContainer: {
    marginTop: 18,
  },
  taglineText: {
    fontSize: 14,
    color: '#C98A16', // ChurchEden Gold
    fontFamily: Platform.select({
      ios: 'Inter-SemiBold',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    }),
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 5, // Uppercase letter spacing
  },
});

export default SplashScreen;
