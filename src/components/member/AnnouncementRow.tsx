import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Announcement } from '../../types';
import { MemberTheme } from '../../constants/memberTheme';
import { BookOpen, Users, Calendar, Megaphone, ChevronRight } from 'lucide-react-native';

interface AnnouncementRowProps {
  announcement: Announcement;
  onPress?: (announcement: Announcement) => void;
  showTopBorder?: boolean;
}

function iconForType(type: Announcement['type']) {
  switch (type) {
    case 'sermon':
      return { Icon: BookOpen, bg: '#EDF3E9', color: MemberTheme.primary };
    case 'community':
      return { Icon: Users, bg: '#EDF3E9', color: MemberTheme.primaryMuted };
    case 'calendar':
      return { Icon: Calendar, bg: '#FBF3E2', color: MemberTheme.gold };
    case 'general':
    default:
      return { Icon: Megaphone, bg: '#EDF3E9', color: MemberTheme.primary };
  }
}

export function AnnouncementRow({ announcement, onPress, showTopBorder }: AnnouncementRowProps) {
  const { Icon, bg, color } = iconForType(announcement.type);

  return (
    <TouchableOpacity
      style={[styles.row, showTopBorder && styles.topBorder]}
      onPress={() => onPress?.(announcement)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${announcement.title}. ${announcement.author}, ${announcement.date}`}
      accessibilityHint="Opens announcement details"
    >
      <View style={[styles.iconWrap, { backgroundColor: bg }]}>
        <Icon size={20} color={color} strokeWidth={2} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {announcement.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {announcement.description}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {announcement.date} • {announcement.author}
        </Text>
      </View>

      <ChevronRight size={20} color={MemberTheme.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  topBorder: {
    borderTopWidth: 1,
    borderTopColor: MemberTheme.divider,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 13,
    color: MemberTheme.textSecondary,
    lineHeight: 17,
    fontFamily: 'Inter-Regular',
  },
  meta: {
    fontSize: 12,
    color: MemberTheme.textMuted,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
});

export default AnnouncementRow;
