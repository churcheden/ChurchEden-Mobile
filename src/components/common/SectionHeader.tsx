import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { MemberTheme } from '../../constants/memberTheme';
import { ChevronRight } from 'lucide-react-native';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Reusable Section Header component enforcing consistent horizontal row layout
 * and exact vertical centering between section titles and View All navigation actions.
 */
export function SectionHeader({
  title,
  actionLabel,
  onPress,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.headerRow, style]}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {actionLabel && onPress ? (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} ${title}`}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
          <ChevronRight size={16} color={MemberTheme.primary} strokeWidth={2.2} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    flexShrink: 1,
    marginRight: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  actionText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
});

export default SectionHeader;
