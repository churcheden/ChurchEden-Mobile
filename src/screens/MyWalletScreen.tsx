import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../hooks/useAuth';
import {
  Bell,
  ChevronRight,
  HeartHandshake,
  Church,
  Building2,
  FileText,
  Flame,
} from 'lucide-react-native';

const P = {
  background: '#F8F7F3',
  surface: '#FFFFFF',
  surfaceBorder: '#ECE7DF',
  navy: '#10233F',
  textSecondary: '#475467',
  textMuted: '#667085',
  gold: '#C98A16',
  goldSoft: '#F5ECD7',
  goldPale: '#FBF6EA',
  shadow: '#000000',
  flame: '#E8853B',
} as const;

function ProgressBar({ ratio }: { ratio: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.min(ratio, 1) * 100}%` }]} />
    </View>
  );
}

export function MyWalletScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const goToPayment = (category: string, amount: number) => {
    router.push({
      pathname: '/payment-method',
      params: { category, amount: String(amount) },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.walletTitle}>My Wallet</Text>
          <Text style={styles.walletSubtitle}>Give · Track · Make an Impact</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => {
              // Opens the Notifications screen when available
            }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Bell size={20} color={P.navy} strokeWidth={2} />
          </TouchableOpacity>

          <ProfileAvatar size={40} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary hero card */}
        <TouchableOpacity
          style={styles.heroCard}
          activeOpacity={0.85}
          onPress={() => router.push('/giving-history')}
          accessibilityRole="button"
          accessibilityLabel="View your giving summary and history"
        >
          <View style={styles.heroTop}>
            <View style={styles.heroTotal}>
              <Text style={styles.heroLabel}>Total Given This Year</Text>
              <Text style={styles.heroAmount}>GHS 4,250.00</Text>
            </View>
            <View style={styles.heroStreak}>
              <Text style={styles.heroLabelSmall}>Giving Streak</Text>
              <View style={styles.streakRow}>
                <Flame size={16} color={P.flame} strokeWidth={2.2} />
                <Text style={styles.heroStreakValue}>12 Weeks</Text>
              </View>
            </View>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroPledgeRow}>
            <View style={styles.heroPledgeLeft}>
              <Text style={styles.heroLabelSmall2}>Pledge Progress</Text>
              <Text style={styles.heroPledgeText}>
                GHS 1,200.00 of GHS 2,000.00
              </Text>
              <View style={styles.heroProgressRow}>
                <View style={styles.heroProgressTrack}>
                  <View style={styles.heroProgressFill} />
                </View>
                <Text style={styles.heroPercent}>60%</Text>
              </View>
            </View>
            <ChevronRight size={20} color={P.gold} strokeWidth={2.4} />
          </View>
        </TouchableOpacity>

        {/* Active Giving Opportunities */}
        <Text style={styles.sectionTitle}>Active Giving Opportunities</Text>

        {/* Card 1: Sunday Offering */}
        <View style={styles.opportunityCard}>
          <View style={styles.oppHead}>
            <View style={styles.iconBadge}>
              <HeartHandshake size={22} color={P.gold} strokeWidth={1.8} />
            </View>
            <View style={styles.oppTitleWrap}>
              <Text style={styles.oppTitle}>Sunday Offering</Text>
              <Text style={styles.oppSubtitle}>
                Support this week&apos;s ministry and church activities.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.goldButton}
            onPress={() => goToPayment('Sunday Offering', 100)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Give Now for Sunday Offering"
          >
            <Text style={styles.goldButtonText}>Give Now</Text>
          </TouchableOpacity>
        </View>

        {/* Card 2: Pay Your Tithe */}
        <View style={styles.opportunityCard}>
          <View style={styles.oppHead}>
            <View style={styles.iconBadge}>
              <Church size={22} color={P.gold} strokeWidth={1.8} />
            </View>
            <View style={styles.oppTitleWrap}>
              <Text style={styles.oppTitle}>Pay Your Tithe</Text>
              <Text style={styles.oppSubtitle}>Give your regular tithe securely.</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.goldButton}
            onPress={() => goToPayment('Tithe', 250)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Pay your tithe"
          >
            <Text style={styles.goldButtonText}>Pay Tithe</Text>
          </TouchableOpacity>
        </View>

        {/* Card 3: Building Project */}
        <View style={styles.opportunityCard}>
          <View style={styles.oppHead}>
            <View style={styles.iconBadge}>
              <Building2 size={22} color={P.gold} strokeWidth={1.8} />
            </View>
            <View style={styles.oppTitleWrap}>
              <Text style={styles.oppTitle}>Building Project</Text>
              <Text style={styles.oppSubtitle}>
                Help us reach our goal of GHS 250,000.
              </Text>
            </View>
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.progressText}>GHS 162,500 of GHS 250,000</Text>
            <Text style={styles.progressPercent}>65%</Text>
          </View>
          <ProgressBar ratio={0.65} />
          <TouchableOpacity
            style={[styles.goldButton, styles.compactButton]}
            onPress={() => goToPayment('Building Project', 500)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Contribute to Building Project"
          >
            <Text style={styles.goldButtonText}>Contribute</Text>
          </TouchableOpacity>
        </View>

        {/* Card 4: Building Fund Pledge */}
        <View style={styles.opportunityCard}>
          <View style={styles.oppHead}>
            <View style={styles.iconBadge}>
              <FileText size={22} color={P.gold} strokeWidth={1.8} />
            </View>
            <View style={styles.oppTitleWrap}>
              <Text style={styles.oppTitle}>Building Fund Pledge</Text>
              <Text style={styles.oppSubtitle}>
                Fulfill your outstanding pledge of GHS 2,000.
              </Text>
            </View>
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.progressText}>GHS 800.00 paid of GHS 2,000.00</Text>
            <Text style={styles.progressPercent}>40%</Text>
          </View>
          <ProgressBar ratio={0.4} />
          <TouchableOpacity
            style={[styles.goldButton, styles.compactButton]}
            onPress={() => goToPayment('Building Fund Pledge', 200)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Pay your building fund pledge"
          >
            <Text style={styles.goldButtonText}>Pay Pledge</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: P.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    width: 42,
    height: 42,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatarFallback: {
    backgroundColor: P.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: P.gold,
    fontFamily: 'Inter-Bold',
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: P.navy,
    fontFamily: 'Inter-Bold',
  },
  walletSubtitle: {
    fontSize: 11.5,
    color: P.textMuted,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: P.surface,
    borderWidth: 1,
    borderColor: P.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: P.navy,
    borderRadius: 20,
    padding: 20,
    shadowColor: P.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTotal: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 12,
    color: '#B9C3D4',
    fontFamily: 'Inter-Regular',
  },
  heroAmount: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 6,
    fontFamily: 'Inter-Bold',
  },
  heroStreak: {
    alignItems: 'flex-end',
  },
  heroLabelSmall: {
    fontSize: 11,
    color: '#B9C3D4',
    fontFamily: 'Inter-Regular',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  heroStreakValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginVertical: 16,
  },
  heroPledgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroPledgeLeft: {
    flex: 1,
  },
  heroLabelSmall2: {
    fontSize: 11,
    color: '#B9C3D4',
    fontFamily: 'Inter-Regular',
  },
  heroPledgeText: {
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 4,
    fontFamily: 'Inter-SemiBold',
  },
  heroProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  heroProgressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  heroProgressFill: {
    width: '60%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: P.gold,
  },
  heroPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: P.gold,
    fontFamily: 'Inter-Bold',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: P.navy,
    marginTop: 24,
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
  },
  opportunityCard: {
    backgroundColor: P.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: P.surfaceBorder,
    padding: 16,
    marginBottom: 12,
    shadowColor: P.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  oppHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: P.goldPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oppTitleWrap: {
    flex: 1,
  },
  oppTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: P.navy,
    fontFamily: 'Inter-Bold',
  },
  oppSubtitle: {
    fontSize: 13,
    color: P.textSecondary,
    lineHeight: 18,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  goldButton: {
    alignSelf: 'flex-start',
    backgroundColor: P.gold,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 20,
    shadowColor: P.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  compactButton: {
    marginTop: 12,
  },
  goldButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: P.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: P.gold,
    fontFamily: 'Inter-Bold',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: P.goldSoft,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: P.gold,
  },
  bottomSpacer: {
    height: 8,
  },
});

export default MyWalletScreen;
