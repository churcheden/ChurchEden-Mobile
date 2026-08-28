import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MemberTheme } from '../../src/constants/memberTheme';
import { AppHeader } from '../../src/components/common/AppHeader';
import { useAuth } from '../../src/hooks/useAuth';
import {
  QrCode,
  Camera,
  CheckCircle2,
  Flame,
  Award,
  CalendarDays,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react-native';

interface MonthlyMetric {
  month: string;
  attended: number;
  total: number;
  percentage: number;
}

const MONTHLY_METRICS: MonthlyMetric[] = [
  { month: 'August 2026', attended: 4, total: 4, percentage: 100 },
  { month: 'July 2026', attended: 4, total: 4, percentage: 100 },
  { month: 'June 2026', attended: 3, total: 4, percentage: 75 },
  { month: 'May 2026', attended: 4, total: 4, percentage: 100 },
];

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedMember, setLastScannedMember] = useState<string | null>(null);
  const [streakCount, setStreakCount] = useState(4);
  const [totalAttended, setTotalAttended] = useState(15);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const scannedName = user?.fullName || 'Samuel Eden';
      setLastScannedMember(scannedName);
      setStreakCount((prev) => prev + 1);
      setTotalAttended((prev) => prev + 1);
      Alert.alert(
        'Check-in Successful! 🎉',
        `Checked in: ${scannedName}\nService: Sunday Worship Celebration\nCampus: ${user?.campus || 'Main Grace Cathedral'}`
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Shared App Header matching Home and My Church */}
      <AppHeader title="Scan & Check-In" subtitle="Service Attendance Pass" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Digital Member Pass */}
        <View style={styles.passCard}>
          <View style={styles.passHeader}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.memberAvatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>
                  {user?.fullName?.charAt(0) || 'S'}
                </Text>
              </View>
            )}

            <View style={styles.memberInfoCol}>
              <Text style={styles.memberName}>{user?.fullName || 'Samuel Eden'}</Text>
              <Text style={styles.memberRole}>
                {user?.role || 'Member'} • {user?.campus || 'Main Grace Cathedral'}
              </Text>
              <View style={styles.passStatusPill}>
                <View style={styles.statusDot} />
                <Text style={styles.passStatusText}>Active Member Pass</Text>
              </View>
            </View>
          </View>

          <View style={styles.passDivider} />

          <View style={styles.passFooter}>
            <View style={styles.qrIconBox}>
              <QrCode size={36} color={MemberTheme.textPrimary} />
            </View>
            <View style={styles.passMetaCol}>
              <Text style={styles.passMetaLabel}>Member Pass ID</Text>
              <Text style={styles.passMetaCode}>MBR-2026-9042</Text>
            </View>
            <View style={styles.passBadgeTag}>
              <ShieldCheck size={14} color="#3F7A3A" />
              <Text style={styles.passBadgeText}>Verified</Text>
            </View>
          </View>
        </View>

        {/* QR Scanner Viewfinder Card */}
        <View style={styles.scannerCard}>
          <View style={styles.viewfinderBox}>
            <Camera size={38} color={MemberTheme.primary} strokeWidth={1.8} />
            <Text style={styles.viewfinderTitle}>Attendance Scanner</Text>
            <Text style={styles.viewfinderDesc}>
              Position the digital QR code pass within the camera viewfinder to check in for today’s service.
            </Text>

            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleSimulateScan}
              disabled={isScanning}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Scan member QR code"
            >
              <QrCode size={18} color={MemberTheme.textOnDark} />
              <Text style={styles.scanButtonText}>
                {isScanning ? 'Processing Scan...' : 'Scan Member QR Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scan Confirmation Notice */}
        {lastScannedMember && (
          <View style={styles.confirmationCard}>
            <CheckCircle2 size={24} color="#3F7A3A" />
            <View style={styles.confirmationTextCol}>
              <Text style={styles.confirmationTitle}>Check-in Confirmed!</Text>
              <Text style={styles.confirmationBody}>
                {lastScannedMember} marked present for Sunday Celebration.
              </Text>
            </View>
          </View>
        )}

        {/* Attendance Consistency Metrics Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Attendance Consistency</Text>
          <View style={styles.badgePillHeader}>
            <Award size={13} color="#C98A16" />
            <Text style={styles.badgePillHeaderText}>Faithful Member</Text>
          </View>
        </View>

        {/* Key Metrics Stats Row */}
        <View style={styles.metricsGrid}>
          {/* Active Streak */}
          <View style={styles.metricCard}>
            <View style={styles.metricIconWrapGold}>
              <Flame size={20} color="#C98A16" />
            </View>
            <Text style={styles.metricValue}>{streakCount} Weeks</Text>
            <Text style={styles.metricLabel}>Worship Streak</Text>
          </View>

          {/* Consistency Rate */}
          <View style={styles.metricCard}>
            <View style={styles.metricIconWrapGreen}>
              <TrendingUp size={20} color="#3F7A3A" />
            </View>
            <Text style={styles.metricValue}>94%</Text>
            <Text style={styles.metricLabel}>Consistency Rate</Text>
          </View>

          {/* Total Attended */}
          <View style={styles.metricCard}>
            <View style={styles.metricIconWrapNavy}>
              <CalendarDays size={20} color="#10233F" />
            </View>
            <Text style={styles.metricValue}>{totalAttended}</Text>
            <Text style={styles.metricLabel}>Services Attended</Text>
          </View>
        </View>

        {/* Monthly Attendance Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Monthly Attendance Breakdown</Text>
          <Text style={styles.breakdownSubtitle}>
            Your service participation performance over recent months
          </Text>

          <View style={styles.monthlyList}>
            {MONTHLY_METRICS.map((item) => (
              <View key={item.month} style={styles.monthlyRow}>
                <View style={styles.monthlyHeader}>
                  <Text style={styles.monthName}>{item.month}</Text>
                  <Text style={styles.monthScore}>
                    {item.attended}/{item.total} Services ({item.percentage}%)
                  </Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${item.percentage}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Spiritual Guidance Tip */}
        <View style={styles.tipCard}>
          <Sparkles size={20} color="#3F7A3A" />
          <Text style={styles.tipText}>
            Regular attendance strengthens community bond and encourages consistent spiritual growth. Keep your streak alive!
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
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
    gap: 16,
  },
  // Pass Card
  passCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 16,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  passHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  memberAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: MemberTheme.skeleton,
  },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: MemberTheme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: MemberTheme.primary,
    fontFamily: 'Inter-Bold',
  },
  memberInfoCol: {
    flex: 1,
    gap: 2,
  },
  memberName: {
    fontSize: 16.5,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  memberRole: {
    fontSize: 12.5,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  passStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EAF2E7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: MemberTheme.primary,
    marginRight: 5,
  },
  passStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
  passDivider: {
    height: 1,
    backgroundColor: MemberTheme.divider,
    marginVertical: 14,
  },
  passFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qrIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F8F7F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
  },
  passMetaCol: {
    flex: 1,
    marginLeft: 12,
  },
  passMetaLabel: {
    fontSize: 11,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
  passMetaCode: {
    fontSize: 14,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  passBadgeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF2E7',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  passBadgeText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
  // Scanner Card
  scannerCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 18,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  viewfinderBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: MemberTheme.primaryMuted,
    backgroundColor: '#F8F7F3',
    gap: 10,
  },
  viewfinderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  viewfinderDesc: {
    fontSize: 13,
    color: MemberTheme.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 12,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MemberTheme.primary, // ChurchEden Green #3F7A3A
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    gap: 8,
    marginTop: 6,
    width: '100%',
  },
  scanButtonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: MemberTheme.textOnDark,
    fontFamily: 'Inter-Bold',
  },
  // Confirmation Card
  confirmationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2E7',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3F7A3A',
    padding: 14,
    gap: 12,
  },
  confirmationTextCol: {
    flex: 1,
  },
  confirmationTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  confirmationBody: {
    fontSize: 12.5,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  // Section Headers & Consistency Metrics
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  badgePillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgePillHeaderText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
    fontFamily: 'Inter-Bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: MemberTheme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  metricIconWrapGold: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  metricIconWrapGreen: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF2E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  metricIconWrapNavy: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  metricLabel: {
    fontSize: 11,
    color: MemberTheme.textMuted,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  // Breakdown Card
  breakdownCard: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 18,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  breakdownTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
  },
  breakdownSubtitle: {
    fontSize: 12.5,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
    marginBottom: 14,
  },
  monthlyList: {
    gap: 12,
  },
  monthlyRow: {
    gap: 6,
  },
  monthlyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthName: {
    fontSize: 13,
    fontWeight: '600',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  monthScore: {
    fontSize: 12,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F8F7F3',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: MemberTheme.primary,
    borderRadius: 4,
  },
  // Tip Card
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2E7',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
  },
  tipText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  bottomSpacer: {
    height: 20,
  },
});
