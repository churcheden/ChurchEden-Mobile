import React from 'react';
import { Image, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

interface ProfileAvatarProps {
  size?: number;
  onPress?: () => void;
  navigateToProfile?: boolean;
}

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts
    .map((p) => p[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Shared circular profile avatar used across ChurchEden.
 * Falls back to initials, then the default avatar, then a generic user icon.
 * By default it navigates to the Profile screen when tapped.
 */
export function ProfileAvatar({
  size = 40,
  onPress,
  navigateToProfile = true,
}: ProfileAvatarProps) {
  const router = useRouter();
  const { user } = useAuth();

  const imageUri = user?.avatarUrl;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (navigateToProfile) {
      router.push('/profile');
    }
  };

  const fallbackInitials = buildInitials(user?.fullName || 'U');

  return (
    <TouchableOpacity
      style={[styles.wrapper, { width: size, height: size }]}
      activeOpacity={0.8}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${user?.fullName || 'Profile'}, open profile`}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.34 }]}>
            {fallbackInitials}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const AVATAR_PALETTE = {
  gold: '#C98A16',
  goldSoft: '#F5ECD7',
} as const;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 999,
    backgroundColor: AVATAR_PALETTE.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderRadius: 999,
    backgroundColor: AVATAR_PALETTE.goldSoft,
  },
  fallback: {
    backgroundColor: AVATAR_PALETTE.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
    color: AVATAR_PALETTE.gold,
    fontFamily: 'Inter-Bold',
  },
});

export default ProfileAvatar;
