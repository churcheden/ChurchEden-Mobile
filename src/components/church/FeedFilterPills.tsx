import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FeedCategoryFilter } from '../../types';
import { MemberTheme } from '../../constants/memberTheme';
import {
  Megaphone,
  CalendarDays,
  Heart,
  Users,
  Building2,
} from 'lucide-react-native';

interface FilterOption {
  key: FeedCategoryFilter;
  label: string;
  icon?: React.ReactNode;
}

interface FeedFilterPillsProps {
  selectedFilter: FeedCategoryFilter;
  onSelectFilter: (filter: FeedCategoryFilter) => void;
}

export function FeedFilterPills({
  selectedFilter,
  onSelectFilter,
}: FeedFilterPillsProps) {
  const filters: FilterOption[] = [
    { key: 'all', label: 'All' },
    {
      key: 'announcements',
      label: 'Announcements',
      icon: (
        <Megaphone
          size={14}
          color={selectedFilter === 'announcements' ? '#10233F' : MemberTheme.textSecondary}
          strokeWidth={2}
        />
      ),
    },
    {
      key: 'events',
      label: 'Events',
      icon: (
        <CalendarDays
          size={14}
          color={selectedFilter === 'events' ? '#10233F' : MemberTheme.textSecondary}
          strokeWidth={2}
        />
      ),
    },
    {
      key: 'praise_reports',
      label: 'Praise Reports',
      icon: (
        <Heart
          size={14}
          color={selectedFilter === 'praise_reports' ? '#10233F' : MemberTheme.textSecondary}
          strokeWidth={2}
        />
      ),
    },
    {
      key: 'ministries',
      label: 'Ministries',
      icon: (
        <Users
          size={14}
          color={selectedFilter === 'ministries' ? '#10233F' : MemberTheme.textSecondary}
          strokeWidth={2}
        />
      ),
    },
    {
      key: 'projects',
      label: 'Projects',
      icon: (
        <Building2
          size={14}
          color={selectedFilter === 'projects' ? '#10233F' : MemberTheme.textSecondary}
          strokeWidth={2}
        />
      ),
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.wrapper}
    >
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter.key;
        return (
          <TouchableOpacity
            key={filter.key}
            style={[styles.pill, isSelected ? styles.pillSelected : styles.pillUnselected]}
            onPress={() => onSelectFilter(filter.key)}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Filter: ${filter.label}`}
          >
            {filter.icon && <View style={styles.iconWrap}>{filter.icon}</View>}
            <Text
              style={[
                styles.pillText,
                isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillSelected: {
    backgroundColor: '#EAF2E7', // Soft light green/gold tinted background
    borderColor: '#3F7A3A',
  },
  pillUnselected: {
    backgroundColor: MemberTheme.surface,
    borderColor: MemberTheme.surfaceBorder,
  },
  iconWrap: {
    marginRight: 6,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  pillTextSelected: {
    color: '#10233F',
    fontWeight: '700',
  },
  pillTextUnselected: {
    color: MemberTheme.textSecondary,
  },
});

export default FeedFilterPills;
