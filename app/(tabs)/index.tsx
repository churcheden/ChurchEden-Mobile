import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { Header } from '../../src/components/common/Header';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';
import { useRouter } from 'expo-router';
import { Users, QrCode, HeartHandshake, CalendarDays, TrendingUp, ShieldCheck } from 'lucide-react-native';

export default function DashboardScreen() {
  const theme = Colors.dark;
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="ChurchEden" subtitle="Main Grace Cathedral" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Banner */}
        <Card style={styles.bannerCard}>
          <View style={styles.bannerHeader}>
            <Badge label="Active Service" type="success" />
            <Text style={[styles.bannerDate, { color: theme.textSecondary }]}>Sunday Worship Service</Text>
          </View>
          <Text style={[styles.bannerTitle, { color: theme.textPrimary }]}>Welcome to ChurchEden</Text>
          <Text style={[styles.bannerDescription, { color: theme.textSecondary }]}>
            Empowering ministry operations, member check-ins, online giving, and spiritual community engagement.
          </Text>
        </Card>

        {/* Key Metrics Stats */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Overview Statistics</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: '#312E81' }]}>
              <Users size={20} color="#818CF8" />
            </View>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>1,420</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Active Members</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: '#064E3B' }]}>
              <QrCode size={20} color="#34D399" />
            </View>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>894</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Sunday Check-ins</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: '#78350F' }]}>
              <HeartHandshake size={20} color="#FBBF24" />
            </View>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>$24.5k</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Monthly Giving</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: '#1E3A8A' }]}>
              <TrendingUp size={20} color="#60A5FA" />
            </View>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>18</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Small Groups</Text>
          </Card>
        </View>

        {/* Quick Action Shortcuts */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => router.push('/attendance')}
          >
            <QrCode size={24} color={theme.primary} />
            <Text style={[styles.actionText, { color: theme.textPrimary }]}>Scan Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => router.push('/donations')}
          >
            <HeartHandshake size={24} color={theme.secondary} />
            <Text style={[styles.actionText, { color: theme.textPrimary }]}>Give Online</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => router.push('/events')}
          >
            <CalendarDays size={24} color={theme.accentSuccess} />
            <Text style={[styles.actionText, { color: theme.textPrimary }]}>View Events</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Announcements */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recent Announcements</Text>
        <Card style={styles.announcementCard}>
          <View style={styles.announcementHeader}>
            <ShieldCheck size={20} color={theme.secondary} />
            <Text style={[styles.announcementTitle, { color: theme.textPrimary }]}>Night of Victory & Worship</Text>
          </View>
          <Text style={[styles.announcementBody, { color: theme.textSecondary }]}>
            Join us this Friday at 6:30 PM for our monthly worship service. All departments and life groups are invited!
          </Text>
        </Card>

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
    gap: 20,
  },
  bannerCard: {
    gap: 8,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerDate: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter-Regular',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
    fontFamily: 'Inter-Bold',
  },
  bannerDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    gap: 8,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  announcementCard: {
    gap: 8,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  announcementTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  announcementBody: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
});
