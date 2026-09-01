import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../hooks/useAuth';
import { AppTheme } from '../constants/appTheme';
import { AppHeader } from '../components/common/AppHeader';
import { ProfileAvatar } from '../components/common/ProfileAvatar';
import { SettingsSection, SettingsRow } from '../components/common/settings';
import { Config } from '../constants/Config';
import {
  loadMemberProfile,
  toOverview,
} from '../services/profileService';
import {
  UserCircle2,
  Lock,
  Mail,
  Church as ChurchIcon,
  BadgeCheck,
  ArrowLeftRight,
  CreditCard,
  ReceiptText,
  Repeat,
  Bell,
  Mail as MailIcon,
  CalendarClock,
  Languages,
  Moon,
  CircleDollarSign,
  LifeBuoy,
  Headset,
  FileText,
  LogOut,
  Trash2,
  ChevronRight,
} from 'lucide-react-native';

export function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const [overview, setOverview] = useState<ReturnType<typeof toOverview> | null>(null);

  useEffect(() => {
    let mounted = true;
    loadMemberProfile(user?.avatarUrl)
      .then((res) => {
        if (mounted && res.success) {
          setOverview(toOverview(res.data, user?.avatarUrl));
        }
      })
      .catch(() => {
        if (mounted) setOverview(null);
      });
    return () => {
      mounted = false;
    };
  }, [user?.avatarUrl]);

  const goto = (path: any, params?: Record<string, string>) =>
    router.push({ pathname: path, params });

  const confirmSignOut = () => {
    Alert.alert('Sign out?', 'Are you sure you want to sign out of ChurchEden?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete account?',
      'This will permanently delete your ChurchEden account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => Alert.alert('Delete Account', 'Account deletion requires backend confirmation and will be available soon.'),
        },
      ]
    );
  };

  return (    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <AppHeader title="Settings" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile summary card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => router.push('/profile')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Open your profile"
        >
          <ProfileAvatar size={56} navigateToProfile={false} />
          <View style={styles.profileMeta}>
            <Text style={styles.profileName} numberOfLines={1}>
              {overview?.fullName || user?.fullName || 'Church Member'}
            </Text>
            <Text style={styles.profileChurch} numberOfLines={1}>
              {overview?.churchName || user?.campus || 'Your church'}
            </Text>
            {overview?.membershipStatus ? (
              <View style={styles.profileBadge}>
                <Text style={styles.profileBadgeText}>{overview.membershipStatus}</Text>
              </View>
            ) : null}
          </View>
          <ChevronRight size={20} color={AppTheme.textFaint} strokeWidth={2} />
        </TouchableOpacity>

        {/* Account */}
        <SettingsSection title="Account">
          <SettingsRow
            icon={<UserCircle2 size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Personal Information"
            onPress={() => goto('/account/personal-information')}
          />
          <SettingsRow
            icon={<Lock size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Change Password"
            onPress={() => goto('/coming-soon', { title: 'Change Password' })}
          />
          <SettingsRow
            icon={<Mail size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Email & Phone"
            onPress={() => goto('/coming-soon', { title: 'Email & Phone' })}
          />
        </SettingsSection>

        {/* Church */}
        <SettingsSection title="Church">
          <SettingsRow
            icon={<ChurchIcon size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="My Church"
            value={overview?.churchName || undefined}
            onPress={() => router.push('/my-church')}
          />
          <SettingsRow
            icon={<BadgeCheck size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Membership Status"
            onPress={() => goto('/coming-soon', { title: 'Membership Status' })}
          />
          <SettingsRow
            icon={<ArrowLeftRight size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Switch / Leave Church"
            onPress={() => router.push('/change-church')}
          />
        </SettingsSection>

        {/* Giving & Payments */}
        <SettingsSection title="Giving & Payments">
          <SettingsRow
            icon={<CreditCard size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Payment Methods"
            onPress={() => router.push('/payment-method')}
          />
          <SettingsRow
            icon={<ReceiptText size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Giving History"
            onPress={() => router.push('/giving-history')}
          />
          <SettingsRow
            icon={<Repeat size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Recurring Giving"
            onPress={() => goto('/coming-soon', { title: 'Recurring Giving' })}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          <SettingsRow
            icon={<Bell size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Push Notifications"
            switchValue={pushEnabled}
            onSwitchChange={setPushEnabled}
            showChevron={false}
          />
          <SettingsRow
            icon={<MailIcon size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Email Notifications"
            switchValue={emailEnabled}
            onSwitchChange={setEmailEnabled}
            showChevron={false}
          />
          <SettingsRow
            icon={<CalendarClock size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Event Reminders"
            switchValue={remindersEnabled}
            onSwitchChange={setRemindersEnabled}
            showChevron={false}
          />
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection title="Preferences">
          <SettingsRow
            icon={<Languages size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Language"
            value="English"
            onPress={() => goto('/coming-soon', { title: 'Language' })}
          />
          <SettingsRow
            icon={<Moon size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Dark Mode"
            switchValue={darkModeEnabled}
            onSwitchChange={setDarkModeEnabled}
            showChevron={false}
          />
          <SettingsRow
            icon={<CircleDollarSign size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Currency"
            value="GHS"
            onPress={() => goto('/coming-soon', { title: 'Currency' })}
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="Support">
          <SettingsRow
            icon={<LifeBuoy size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Help Center"
            onPress={() => goto('/coming-soon', { title: 'Help Center' })}
          />
          <SettingsRow
            icon={<Headset size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Contact Us"
            onPress={() => goto('/coming-soon', { title: 'Contact Us' })}
          />
          <SettingsRow
            icon={<FileText size={20} color={AppTheme.gold} strokeWidth={1.8} />}
            label="Terms & Privacy Policy"
            onPress={() => goto('/coming-soon', { title: 'Terms & Privacy Policy' })}
          />
        </SettingsSection>

        {/* App Version (static row) */}
        <View style={styles.staticRow}>
          <View style={styles.staticRowLeft}>
            <View style={styles.iconWrap}>
              <Text style={styles.versionIcon}>{'v'}</Text>
            </View>
            <Text style={styles.staticLabel}>App Version</Text>
          </View>
          <Text style={styles.versionValue}>v{Config.appVersion}</Text>
        </View>

        {/* Account Actions */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerSectionTitle}>Account Actions</Text>
          <View style={styles.dangerCard}>
            <TouchableOpacity style={styles.dangerRow} onPress={confirmSignOut} activeOpacity={0.7} accessibilityRole="button">
              <View style={styles.dangerLeft}>
                <View style={[styles.iconWrap, styles.dangerIconWrap]}>
                  <LogOut size={20} color={AppTheme.danger} strokeWidth={1.8} />
                </View>
                <Text style={styles.dangerLabel}>Sign Out</Text>
              </View>
              <ChevronRight size={18} color={AppTheme.textFaint} strokeWidth={2} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.dangerRow} onPress={confirmDeleteAccount} activeOpacity={0.7} accessibilityRole="button">
              <View style={styles.dangerLeft}>
                <View style={[styles.iconWrap, styles.dangerIconWrap]}>
                  <Trash2 size={20} color={AppTheme.danger} strokeWidth={1.8} />
                </View>
                <Text style={styles.dangerLabel}>Delete Account</Text>
              </View>
              <ChevronRight size={18} color={AppTheme.textFaint} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.surfaceBorder,
    padding: 16,
    gap: 14,
    marginBottom: 24,
    shadowColor: AppTheme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  profileMeta: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: AppTheme.navy,
    fontFamily: 'Inter-Bold',
  },
  profileChurch: {
    fontSize: 13,
    color: AppTheme.textMuted,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  profileBadge: {
    alignSelf: 'flex-start',
    backgroundColor: AppTheme.goldSoft,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  profileBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A5B0A',
    fontFamily: 'Inter-SemiBold',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: AppTheme.goldPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  staticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.surfaceBorder,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 24,
  },
  staticRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staticLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: AppTheme.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  versionIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: AppTheme.gold,
    fontFamily: 'Inter-Bold',
  },
  versionValue: {
    fontSize: 14,
    color: AppTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  dangerSection: {
    marginBottom: 24,
  },
  dangerSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppTheme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 4,
    fontFamily: 'Inter-SemiBold',
  },
  dangerCard: {
    backgroundColor: AppTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.surfaceBorder,
    paddingHorizontal: 14,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    minHeight: 60,
  },
  dangerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dangerIconWrap: {
    backgroundColor: AppTheme.dangerSoft,
  },
  dangerLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: AppTheme.danger,
    fontFamily: 'Inter-SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.divider,
  },
  bottomSpacer: {
    height: 8,
  },
});

export default SettingsScreen;
