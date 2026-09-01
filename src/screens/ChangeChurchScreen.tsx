import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Search, X, Church as ChurchIcon, AlertCircle } from 'lucide-react-native';
import { MemberTheme } from '../constants/memberTheme';
import { Church } from '../types';
import { AuthMeResponse, MembershipSummary } from '../types/api';
import { apiClient } from '../lib/apiClient';
import churchService from '../services/churchService';
import { AppHeader } from '../components/common/AppHeader';
import { ChurchCard } from '../components/church/ChurchCard';
import { ChurchListSkeleton } from '../components/church/ChurchCardSkeleton';

const toDisplayChurch = (m: MembershipSummary): { id: string; name: string; city: string } | null => {
  if (!m.church?.id) return null;
  return { id: m.church.id, name: m.church.name || 'Your Church', city: m.church.city || '' };
};

export function ChangeChurchScreen() {
  const router = useRouter();

  const [membership, setMembership] = useState<MembershipSummary[]>([]);
  const [meLoading, setMeLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [churches, setChurches] = useState<Church[]>([]);
  const [dirLoading, setDirLoading] = useState(true);
  const [dirError, setDirError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadMembership = useCallback(async () => {
    setMeLoading(true);
    try {
      const me = await apiClient.get<AuthMeResponse>('/auth/me');
      setMembership(me?.user?.memberships ?? []);
    } catch {
      setMembership([]);
    } finally {
      setMeLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembership();
  }, [loadMembership]);

  const currentChurch = useMemo(() => {
    const approved = membership.find((m) => m.status === 'APPROVED');
    return toDisplayChurch(approved!);
  }, [membership]);

  const pendingChurch = useMemo(() => {
    const pending = membership.find((m) => m.status === 'PENDING');
    return toDisplayChurch(pending!);
  }, [membership]);

  const fetchChurches = useCallback(async (query = '') => {
    setDirError(null);
    try {
      const res = await churchService.searchChurches(query);
      if (res.success) {
        setChurches(res.data.filter((c) => c.id !== currentChurch?.id));
      } else {
        setChurches([]);
        setDirError(res.error || 'Failed to load churches.');
      }
    } catch {
      setChurches([]);
      setDirError('Could not connect to the church directory. Please try again.');
    } finally {
      setDirLoading(false);
    }
  }, [currentChurch?.id]);

  useEffect(() => {
    setDirLoading(true);
    fetchChurches(searchQuery);
  }, [searchQuery, fetchChurches]);

  const submitJoinTo = useCallback(
    async (churchId: string) => {
      const res = await churchService.requestToJoinChurch(churchId);
      if (!res.success) {
        Alert.alert('Could not apply', res.error || 'Something went wrong.');
        return false;
      }
      return true;
    },
    [],
  );

  const handleSelectChurch = useCallback(
    (church: Church) => {
      if (church.id === currentChurch?.id) return;

      const proceed = async () => {
        setBusy(true);
        try {
          // Leave the current approved church first (full switch).
          if (currentChurch) {
            const left = await churchService.leaveChurch(currentChurch.id);
            if (!left.success) {
              Alert.alert('Could not leave', left.error || 'Please try again.');
              return;
            }
          }
          // Cancel any pending request before applying elsewhere.
          if (pendingChurch) {
            const pending = membership.find((m) => m.status === 'PENDING');
            if (pending) {
              const cancelled = await churchService.cancelJoinRequest(pending.id);
              if (!cancelled.success) {
                Alert.alert('Could not cancel', cancelled.error || 'Please try again.');
                return;
              }
            }
          }

          const applied = await submitJoinTo(church.id);
          if (!applied) return;

          await loadMembership();
          router.replace({ pathname: '/pending-approval', params: { churchId: church.id } });
        } finally {
          setBusy(false);
        }
      };

      // Compose a clear confirmation based on the member's current state.
      if (currentChurch) {
        Alert.alert(
          'Change church?',
          `You'll leave ${currentChurch.name} and request to join ${church.name}. A pastor will review your request before you become a member.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Leave & Apply', style: 'destructive', onPress: proceed },
          ],
        );
      } else if (pendingChurch) {
        Alert.alert(
          'Change application?',
          `Your pending request to ${pendingChurch.name} will be withdrawn so it no longer appears to that church, and you'll apply to ${church.name} instead.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Change Application', style: 'destructive', onPress: proceed },
          ],
        );
      } else {
        proceed();
      }
    },
    [currentChurch, pendingChurch, membership, submitJoinTo, loadMembership, router],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <AppHeader title="Change Church" subtitle="Move your membership" showBack />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current membership summary */}
        {meLoading ? (
          <View style={styles.statusCard}>
            <ActivityIndicator color={MemberTheme.primary} />
          </View>
        ) : currentChurch ? (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusIconWrap}>
                <ChurchIcon size={22} color={MemberTheme.primary} strokeWidth={1.8} />
              </View>
              <View style={styles.statusTextCol}>
                <Text style={styles.statusLabel}>Current Church</Text>
                <Text style={styles.statusTitle}>{currentChurch.name}</Text>
                {currentChurch.city ? <Text style={styles.statusMeta}>{currentChurch.city}</Text> : null}
              </View>
            </View>
            <Text style={styles.statusHint}>You are an approved member. Choosing a new church below will leave this one and submit a fresh request.</Text>
          </View>
        ) : pendingChurch ? (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={[styles.statusIconWrap, styles.pendingIconWrap]}>
                <ChurchIcon size={22} color={MemberTheme.gold} strokeWidth={1.8} />
              </View>
              <View style={styles.statusTextCol}>
                <Text style={styles.statusLabel}>Pending Application</Text>
                <Text style={styles.statusTitle}>{pendingChurch.name}</Text>
                {pendingChurch.city ? <Text style={styles.statusMeta}>{pendingChurch.city}</Text> : null}
              </View>
            </View>
            <Text style={styles.statusHint}>Your request is still awaiting approval. Choosing a new church below will withdraw it from {pendingChurch.name}.</Text>
          </View>
        ) : (
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>{'You\'re not a member yet'}</Text>
            <Text style={styles.statusHint}>Pick a church below to submit a join request.</Text>
          </View>
        )}

        {/* Search + directory */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#8A95A5" strokeWidth={2.2} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by church name, location..."
            placeholderTextColor="#8A95A5"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search churches"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton} accessibilityLabel="Clear search">
              <X size={16} color="#8A95A5" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>{searchQuery ? 'Search Results' : 'Available Churches'}</Text>

        {dirLoading ? (
          <ChurchListSkeleton count={4} />
        ) : dirError ? (
          <View style={styles.errorCard}>
            <AlertCircle size={36} color="#EF4444" strokeWidth={1.8} />
            <Text style={styles.errorTitle}>{'We couldn\'t load churches'}</Text>
            <Text style={styles.errorSubtitle}>{dirError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setDirLoading(true);
                fetchChurches(searchQuery);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : churches.length === 0 ? (
          <View style={styles.emptyCard}>
            <ChurchIcon size={40} color={MemberTheme.gold} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No other churches found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? `Nothing matched "${searchQuery}".` : 'No other registered churches are available to join right now.'}
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {churches.map((church) =>
              church.id === currentChurch?.id ? null : (
                <ChurchCard
                  key={church.id}
                  church={church}
                  onPress={() => handleSelectChurch(church)}
                />
              ),
            )}
          </View>
        )}

        {busy && (
          <View style={styles.busyOverlay}>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={styles.busyText}>Updating your membership…</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: MemberTheme.background },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  statusCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 16,
    marginBottom: 24,
  },
  statusHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  statusIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: MemberTheme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pendingIconWrap: { backgroundColor: MemberTheme.gold + '22' },
  statusTextCol: { flex: 1 },
  statusLabel: { fontSize: 12, fontWeight: '600', color: MemberTheme.textMuted, fontFamily: 'Inter-SemiBold' },
  statusTitle: { fontSize: 17, fontWeight: '700', color: MemberTheme.textPrimary, fontFamily: 'Inter-Bold', marginTop: 2 },
  statusMeta: { fontSize: 13, color: MemberTheme.textMuted, marginTop: 2, fontFamily: 'Inter-Regular' },
  statusHint: { fontSize: 13, lineHeight: 19, color: MemberTheme.textMuted, fontFamily: 'Inter-Regular' },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14.5, color: MemberTheme.textPrimary, height: '100%', fontFamily: 'Inter-Regular' },
  clearButton: { padding: 6 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    marginVertical: 18,
  },
  listContainer: { gap: 12 },
  errorCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  errorTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  errorSubtitle: { fontSize: 13.5, color: '#6B7280', textAlign: 'center', lineHeight: 19 },
  retryButton: { backgroundColor: MemberTheme.gold, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, marginTop: 6 },
  retryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  emptyCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 8,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: MemberTheme.textPrimary, marginTop: 4 },
  emptySubtitle: { fontSize: 13.5, color: '#647082', textAlign: 'center', lineHeight: 20 },
  busyOverlay: {
    marginTop: 24,
    backgroundColor: 'rgba(23,32,51,0.85)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  busyText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', fontFamily: 'Inter-SemiBold' },
});

export default ChangeChurchScreen;
