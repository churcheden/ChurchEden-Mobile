import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MemberTheme } from '../../src/constants/memberTheme';
import { Church } from '../../src/types';
import { churchService } from '../../src/services/churchService';
import {
  MapPin,
  Users,
  Clock,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react-native';

const DEFAULT_CHURCH_IMAGE =
  'https://images.unsplash.com/photo-1548625361-195fe57876a3?q=80&w=1200&auto=format&fit=crop';

export default function MyChurchScreen() {
  const router = useRouter();
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    churchService
      .getChurchById('church_1')
      .then((res) => {
        if (res.success) {
          setChurch(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={22} color={MemberTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Church</Text>
          <View style={styles.headerSpacer} />
        </View>

        {loading ? (
          <View style={styles.centerFill}>
            <ActivityIndicator color={MemberTheme.primary} />
          </View>
        ) : error || !church ? (
          <View style={styles.centerFill}>
            <Text style={styles.errorTitle}>Couldn&apos;t load your church.</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={load}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Image
              source={{ uri: church.imageUrl || DEFAULT_CHURCH_IMAGE }}
              style={styles.heroImage}
              resizeMode="cover"
            />

            <View style={styles.card}>
              <View style={styles.nameRow}>
                <Text style={styles.churchName}>{church.name}</Text>
                {church.isRegistered && (
                  <View style={styles.verifiedBadge}>
                    <CheckCircle2 size={13} color={MemberTheme.primary} />
                    <Text style={styles.verifiedText}>Registered</Text>
                  </View>
                )}
              </View>

              <View style={styles.locationRow}>
                <MapPin size={15} color={MemberTheme.textMuted} />
                <Text style={styles.locationText}>
                  {church.city && church.country
                    ? `${church.city}, ${church.country}`
                    : church.address || 'Your church'}
                </Text>
              </View>

              {church.shortDescription ? (
                <Text style={styles.description}>{church.shortDescription}</Text>
              ) : null}

              <View style={styles.divider} />

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Users size={18} color={MemberTheme.primary} />
                  <Text style={styles.statValue}>{church.memberCount?.toLocaleString() || '—'}</Text>
                  <Text style={styles.statLabel}>Members</Text>
                </View>
                <View style={styles.statItem}>
                  <CalendarDays size={18} color={MemberTheme.primary} />
                  <Text style={styles.statValue}>{church.serviceCount || '—'}</Text>
                  <Text style={styles.statLabel}>Services</Text>
                </View>
                <View style={styles.statItem}>
                  <Clock size={18} color={MemberTheme.primary} />
                  <Text style={styles.statValue}>{church.foundedYear || '—'}</Text>
                  <Text style={styles.statLabel}>Founded</Text>
                </View>
              </View>
            </View>

            {church.serviceTimes && church.serviceTimes.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Service Times</Text>
                {church.serviceTimes.map((time) => (
                  <View key={time} style={styles.timeRow}>
                    <View style={styles.timeDot} />
                    <Text style={styles.timeText}>{time}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {church.expectations && church.expectations.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>What to Expect</Text>
                {church.expectations.map((item) => (
                  <View key={item} style={styles.expectationRow}>
                    <CheckCircle2 size={16} color={MemberTheme.primaryMuted} />
                    <Text style={styles.expectationText}>{item}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MemberTheme.background,
  },
  container: {
    flex: 1,
    backgroundColor: MemberTheme.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MemberTheme.surface,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  headerSpacer: {
    width: 40,
  },
  centerFill: {
    paddingTop: 80,
    alignItems: 'center',
    gap: 12,
  },
  errorTitle: {
    fontSize: 16,
    color: MemberTheme.textSecondary,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  primaryButton: {
    backgroundColor: MemberTheme.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: MemberTheme.textOnDark,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: 22,
    backgroundColor: MemberTheme.skeleton,
  },
  card: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 20,
    marginTop: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  churchName: {
    fontSize: 20,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    flexShrink: 1,
    fontFamily: 'Inter-Bold',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: MemberTheme.primarySoft,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  locationText: {
    fontSize: 13,
    color: MemberTheme.textSecondary,
    flexShrink: 1,
    fontFamily: 'Inter-Regular',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: MemberTheme.textSecondary,
    marginTop: 14,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: MemberTheme.divider,
    marginVertical: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    marginTop: 6,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    marginBottom: 14,
    fontFamily: 'Inter-Bold',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MemberTheme.primary,
  },
  timeText: {
    fontSize: 14,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  expectationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  expectationText: {
    fontSize: 14,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
});
