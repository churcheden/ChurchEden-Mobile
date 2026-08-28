import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Sparkles } from 'lucide-react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();
  const theme = Colors.dark;

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.leftSection}>
        <View style={[styles.logoBadge, { backgroundColor: theme.primary }]}>
          <Sparkles size={20} color="#FFFFFF" />
        </View>
        <View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title || 'ChurchEden'}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
          ) : (
            <Text style={[styles.subtitle, { color: theme.secondary }]}>{user?.campus || 'Grace Cathedral'}</Text>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.background, borderColor: theme.cardBorder }]}>
          <Bell size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        {user?.avatarUrl && (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default Header;
