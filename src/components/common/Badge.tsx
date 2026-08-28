import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

interface BadgeProps {
  label: string;
  type?: 'success' | 'warning' | 'danger' | 'info' | 'primary';
  style?: StyleProp<ViewStyle>;
}

export function Badge({ label, type = 'primary', style }: BadgeProps) {
  const theme = Colors.dark;

  const getColors = () => {
    switch (type) {
      case 'success':
        return { bg: '#064E3B', text: '#34D399' };
      case 'warning':
        return { bg: '#78350F', text: '#FBBF24' };
      case 'danger':
        return { bg: '#7F1D1D', text: '#FCA5A5' };
      case 'info':
        return { bg: '#1E3A8A', text: '#93C5FD' };
      case 'primary':
      default:
        return { bg: theme.badgeBackground, text: theme.tabBarActive };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});

export default Badge;
