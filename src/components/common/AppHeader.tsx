import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { ProfileAvatar } from './ProfileAvatar';

const APP_HEADER_PALETTE = {
  navy: '#10233F',
  muted: '#667085',
  background: '#F8F7F3',
  surface: '#FFFFFF',
  surfaceBorder: '#ECE7DF',
  gold: '#C98A16',
} as const;

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  left?: React.ReactNode;
  unreadCount?: number;
  onBellPress?: () => void;
}

/**
 * Shared application header.
 * Right side is always [ Notification Bell ][ Profile Avatar ].
 * Tapping the avatar navigates to the Profile screen (handled by ProfileAvatar).
 */
export function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  left,
  unreadCount = 0,
  onBellPress,
}: AppHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={22} color={APP_HEADER_PALETTE.navy} strokeWidth={2.2} />
          </TouchableOpacity>
        ) : null}

        {left ? (
          left
        ) : (
          <View style={styles.titleWrap}>
            {title ? (
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            ) : null}
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        )}
      </View>

      <View style={styles.right}>
        <TouchableOpacity
          style={styles.bellButton}
          onPress={onBellPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        >
          <Bell size={20} color={APP_HEADER_PALETTE.navy} strokeWidth={2} />
          {unreadCount > 0 && <View style={styles.unreadDot} />}
        </TouchableOpacity>

        <ProfileAvatar size={40} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: APP_HEADER_PALETTE.surface,
    borderWidth: 1,
    borderColor: APP_HEADER_PALETTE.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleWrap: {
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_HEADER_PALETTE.navy,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 11.5,
    color: APP_HEADER_PALETTE.muted,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 12,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: APP_HEADER_PALETTE.surface,
    borderWidth: 1,
    borderColor: APP_HEADER_PALETTE.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: APP_HEADER_PALETTE.gold,
    borderWidth: 1.5,
    borderColor: APP_HEADER_PALETTE.surface,
  },
});

export default AppHeader;
