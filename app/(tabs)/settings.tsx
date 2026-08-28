import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Image, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { Header } from '../../src/components/common/Header';
import { Card } from '../../src/components/common/Card';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { Config } from '../../src/constants/Config';
import { useAuth } from '../../src/hooks/useAuth';
import { Bell, Lock, Globe, Smartphone, LogOut, ChevronRight, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const theme = Colors.dark;
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of ChurchEden?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Settings & Profile" subtitle="Preferences & App Information" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <Image source={{ uri: user?.avatarUrl }} style={styles.avatar} />
          <View style={styles.profileMeta}>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>{user?.fullName || 'Church Member'}</Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email}</Text>
            <View style={styles.roleBadgeRow}>
              <Badge label={user?.role?.toUpperCase() || 'MEMBER'} type="primary" />
              <Badge label={user?.campus || 'Main Grace'} type="success" />
            </View>
          </View>
        </Card>

        {/* Environment & SDK Diagnostics */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Environment & Build Config</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Globe size={18} color={theme.primary} />
              <Text style={[styles.infoLabel, { color: theme.textPrimary }]}>Current Environment</Text>
            </View>
            <Badge
              label={Config.env.toUpperCase()}
              type={Config.env === 'production' ? 'success' : Config.env === 'staging' ? 'warning' : 'info'}
            />
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Smartphone size={18} color={theme.secondary} />
              <Text style={[styles.infoLabel, { color: theme.textPrimary }]}>Bundle Identifier</Text>
            </View>
            <Text style={[styles.infoVal, { color: theme.textSecondary }]}>{Config.bundleId}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Info size={18} color={theme.accentInfo} />
              <Text style={[styles.infoLabel, { color: theme.textPrimary }]}>Expo SDK Version</Text>
            </View>
            <Text style={[styles.infoVal, { color: theme.textSecondary }]}>SDK 54.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Info size={18} color={theme.textMuted} />
              <Text style={[styles.infoLabel, { color: theme.textPrimary }]}>App Version & Build</Text>
            </View>
            <Text style={[styles.infoVal, { color: theme.textSecondary }]}>
              v{Config.appVersion} ({Config.buildNumber})
            </Text>
          </View>
        </Card>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Preferences</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Bell size={18} color={theme.textSecondary} />
              <Text style={[styles.switchLabel, { color: theme.textPrimary }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#334155', true: theme.primary }}
            />
          </View>

          <View style={[styles.switchRow, { borderTopColor: theme.cardBorder, borderTopWidth: 1 }]}>
            <View style={styles.switchLeft}>
              <Lock size={18} color={theme.textSecondary} />
              <Text style={[styles.switchLabel, { color: theme.textPrimary }]}>Biometric Passcode / FaceID</Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: '#334155', true: theme.primary }}
            />
          </View>
        </Card>

        {/* Logout */}
        <Button
          title="Sign Out of ChurchEden"
          onPress={handleLogout}
          variant="danger"
          icon={<LogOut size={18} color="#FFFFFF" />}
          style={styles.logoutBtn}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileMeta: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  userEmail: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  roleBadgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  infoCard: {
    gap: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  infoVal: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  settingsCard: {
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  logoutBtn: {
    marginTop: 10,
  },
});
