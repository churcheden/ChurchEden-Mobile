import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';

export interface GlassSegmentItem<T extends string = string> {
  key: T;
  label: string;
  badge?: number | string;
}

interface GlassSegmentedNavProps<T extends string = string> {
  items: GlassSegmentItem<T>[];
  activeKey: T;
  onChange: (key: T) => void;
  containerStyle?: ViewStyle;
  dark?: boolean;
}

export function GlassSegmentedNav<T extends string = string>({
  items,
  activeKey,
  onChange,
  containerStyle,
  dark = false,
}: GlassSegmentedNavProps<T>) {
  return (
    <View
      style={[
        styles.outerPill,
        dark ? styles.darkOuterPill : styles.lightOuterPill,
        containerStyle,
      ]}
    >
      {items.map((item) => {
        const isActive = activeKey === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.7}
            onPress={() => onChange(item.key)}
            style={[
              styles.segmentItem,
              isActive && (dark ? styles.activeDarkSegment : styles.activeLightSegment),
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                dark ? styles.darkText : styles.lightText,
                isActive && styles.activeText,
              ]}
            >
              {item.label}
            </Text>

            {item.badge !== undefined && (
              <View
                style={[
                  styles.badge,
                  isActive ? styles.activeBadge : styles.inactiveBadge,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    isActive ? styles.activeBadgeText : styles.inactiveBadgeText,
                  ]}
                >
                  {item.badge}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  outerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 9999,
    borderWidth: 1.5,
    alignSelf: 'center',
    // Glassmorphism shadow & blur effect styling
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  lightOuterPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  darkOuterPill: {
    backgroundColor: 'rgba(30, 41, 59, 0.55)',
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  segmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 9999,
    minWidth: 90,
  },
  activeLightSegment: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  activeDarkSegment: {
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    letterSpacing: 0.2,
  },
  lightText: {
    color: 'rgba(30, 41, 59, 0.65)',
  },
  darkText: {
    color: 'rgba(255, 255, 255, 0.60)',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  activeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  inactiveBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  activeBadgeText: {
    color: '#FFFFFF',
  },
  inactiveBadgeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
