import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../hooks/useAuth';
import { AppTheme } from '../constants/appTheme';
import { ProfileAvatar } from '../components/common/ProfileAvatar';
import { ReadOnlyInfoCard } from '../components/common/ReadOnlyInfoCard';
import { loadMemberProfile, toOverview, MemberProfile } from '../services/profileService';
import { ChevronLeft, PencilLine } from 'lucide-react-native';

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <View style={styles.pillDot} />
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

export function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [profile, setProfile] = useState<MemberProfile | null>(null);

  const load = () => {
    setLoading(true);
    setError(false);
    loadMemberProfile(user?.avatarUrl)
      .then((res) => {
        if (res.success) {
          setProfile(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [user?.avatarUrl]);

  const overview = useMemo(
    () => (profile ? toOverview(profile, user?.avatarUrl) : null),
    [profile, user?.avatarUrl]
  );

  const handleEdit = () => {
    // Profile => Settings => Account => Personal Information
    router.push('/account/personal-information');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
        <ProfileScreenHeader onEdit={handleEdit} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={[styles.skeleton, styles.skeletonAvatar]} />
            <View style={[styles.skeleton, { width: 180, height: 20, marginTop: 16 }]} />
            <View style={[styles.skeleton, { width: 110, height: 28, marginTop: 12, borderRadius: 14 }]} />
            <View style={[styles.skeleton, { width: 200, height: 14, marginTop: 12 }]} />
          </View>
          {[0, 1, 2].map((c) => (
            <View key={c} style={styles.skeletonCard}>
              <View style={[styles.skeleton, { width: 110, height: 14, marginBottom: 12 }]} />
              <View style={[styles.skeleton, { width: '100%', height: 48, borderRadius: 14 }]} />
              <View style={[styles.skeleton, { width: '100%', height: 48, borderRadius: 14, marginTop: 8 }]} />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error || !overview) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
        <ProfileScreenHeader onEdit={handleEdit} />
        <View style={styles.centerFill}>
          <Text style={styles.errorTitle}>We couldn&apos;t load your profile.</Text>
          <Text style={styles.errorBody}>Please try again.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={load} activeOpacity={0.85} accessibilityRole="button">
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const contactCity = profile?.member?.campus || overview.churchLocation;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ProfileScreenHeader onEdit={handleEdit} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <ProfileAvatar size={112} />
          <Text style={styles.fullName}>{overview.fullName}</Text>
          <Pill label={overview.membershipStatus} />
          <Text style={styles.churchLine} numberOfLines={2}>
            {overview.churchName}
            {overview.churchLocation ? ` · ${overview.churchLocation}` : ''}
          </Text>
        </View>

        {/* Personal Information */}
        <ReadOnlyInfoCard
          title="Personal Information"
          fields={[{ label: 'Full Name', value: overview.fullName }]}
        />

        {/* Contact Information */}
        <ReadOnlyInfoCard
          title="Contact Information"
          fields={[
            { label: 'Phone Number', value: overview.phone || 'Not provided' },
            { label: 'Email', value: overview.email || 'Not provided' },
            { label: 'Address / City', value: contactCity || 'Not provided' },
          ]}
        />

        {/* Church Information */}
        <ReadOnlyInfoCard
          title="Church Information"
          fields={[
            {
              label: 'Member Since',
              value: overview.membershipDate
                ? new Date(overview.membershipDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })
                : '—',
            },
            { label: 'Membership Status', value: overview.membershipStatus },
          ]}
        >
          <View style={styles.groupsBlock}>
            <Text style={styles.fieldLabel}>GROUPS / MINISTRIES JOINED</Text>
            <Text style={styles.emptyGroups}>No groups joined yet.</Text>
          </View>
        </ReadOnlyInfoCard>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileScreenHeader({ onEdit }: { onEdit: () => void }) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ChevronLeft size={22} color={AppTheme.navy} strokeWidth={2.2} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Profile</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={onEdit}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Edit profile information"
      >
        <Text style={styles.editText}>Edit</Text>
        <PencilLine size={16} color={AppTheme.gold} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppTheme.navy,
    fontFamily: 'Inter-Bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  editText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppTheme.gold,
    fontFamily: 'Inter-SemiBold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  fullName: {
    fontSize: 24,
    fontWeight: '700',
    color: AppTheme.navy,
    marginTop: 16,
    fontFamily: 'Inter-Bold',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.goldSoft,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: AppTheme.gold,
    marginRight: 7,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A5B0A',
    fontFamily: 'Inter-SemiBold',
  },
  churchLine: {
    fontSize: 13.5,
    color: AppTheme.textMuted,
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'Inter-Regular',
  },
  skeletonCard: {
    backgroundColor: AppTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.surfaceBorder,
    padding: 16,
    marginBottom: 16,
  },
  skeleton: {
    backgroundColor: AppTheme.skeleton,
    borderRadius: 8,
  },
  skeletonAvatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppTheme.textPrimary,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  errorBody: {
    fontSize: 14,
    color: AppTheme.textMuted,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: AppTheme.gold,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  groupsBlock: {
    paddingVertical: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppTheme.textFaint,
    letterSpacing: 0.6,
    fontFamily: 'Inter-SemiBold',
  },
  emptyGroups: {
    fontSize: 15,
    fontWeight: '600',
    color: AppTheme.textPrimary,
    marginTop: 4,
    fontFamily: 'Inter-SemiBold',
  },
  bottomSpacer: {
    height: 8,
  },
});

export default ProfileScreen;
