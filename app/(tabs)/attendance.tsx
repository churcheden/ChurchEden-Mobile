import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { Header } from '../../src/components/common/Header';
import { Card } from '../../src/components/common/Card';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { AttendanceRecord } from '../../src/types';
import { QrCode, Camera, CheckCircle2, UserCheck, Clock } from 'lucide-react-native';

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att_1', memberId: '1', memberName: 'Grace Addo', serviceName: 'Sunday Celebration', checkInTime: '09:14 AM', method: 'qr_scan', campus: 'Main Grace' },
  { id: 'att_2', memberId: '2', memberName: 'David Osei', serviceName: 'Sunday Celebration', checkInTime: '09:20 AM', method: 'qr_scan', campus: 'Main Grace' },
  { id: 'att_3', memberId: '3', memberName: 'Sarah Mensah', serviceName: 'Sunday Celebration', checkInTime: '09:32 AM', method: 'manual_entry', campus: 'Main Grace' },
];

export default function AttendanceScreen() {
  const theme = Colors.dark;
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedMember, setLastScannedMember] = useState<string | null>(null);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const mockNames = ['Emmanuel Kwame', 'Hannah Ansah', 'Michael Appiah', 'Patience Baah'];
      const scannedName = mockNames[Math.floor(Math.random() * mockNames.length)];
      setLastScannedMember(scannedName);
      Alert.alert('Check-in Successful', `Checked in: ${scannedName}\nService: Sunday Celebration`);
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Attendance Scanner" subtitle="Service & Event Check-in" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Scanner View Box */}
        <Card style={styles.scannerCard}>
          <View style={styles.scannerFrame}>
            <Camera size={48} color={theme.textSecondary} />
            <Text style={[styles.scannerTitle, { color: theme.textPrimary }]}>QR Attendance Scanner</Text>
            <Text style={[styles.scannerDesc, { color: theme.textSecondary }]}>
              Position the member's digital or printed QR code within the viewfinder to record attendance.
            </Text>

            <Button
              title={isScanning ? 'Processing QR Scan...' : 'Scan Member QR Code'}
              onPress={handleSimulateScan}
              isLoading={isScanning}
              icon={<QrCode size={18} color="#FFFFFF" />}
              style={styles.scanButton}
            />
          </View>
        </Card>

        {/* Scan Confirmation Notice */}
        {lastScannedMember && (
          <Card style={[styles.scannedCard, { backgroundColor: '#064E3B', borderColor: '#059669' }]}>
            <CheckCircle2 size={24} color="#34D399" />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15, fontFamily: 'Inter-Bold' }}>
                Check-in Confirmed
              </Text>
              <Text style={{ color: '#A7F3D0', fontSize: 13, fontFamily: 'Inter-Regular' }}>
                {lastScannedMember} marked present for Sunday Celebration
              </Text>
            </View>
          </Card>
        )}

        {/* Attendance Statistics */}
        <View style={styles.statsRow}>
          <Card style={styles.statBox}>
            <Text style={[styles.statNum, { color: theme.primary }]}>894</Text>
            <Text style={[styles.statText, { color: theme.textSecondary }]}>Total Present</Text>
          </Card>
          <Card style={styles.statBox}>
            <Text style={[styles.statNum, { color: theme.accentSuccess }]}>94%</Text>
            <Text style={[styles.statText, { color: theme.textSecondary }]}>QR Scans</Text>
          </Card>
        </View>

        {/* Live Attendance Log */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Live Check-in Log</Text>
        {MOCK_ATTENDANCE.map((item) => (
          <Card key={item.id} style={styles.logCard}>
            <View style={styles.logLeft}>
              <View style={[styles.logIcon, { backgroundColor: theme.primary }]}>
                <UserCheck size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text style={[styles.logName, { color: theme.textPrimary }]}>{item.memberName}</Text>
                <Text style={[styles.logService, { color: theme.textSecondary }]}>{item.serviceName}</Text>
              </View>
            </View>

            <View style={styles.logRight}>
              <Badge label={item.method === 'qr_scan' ? 'QR SCAN' : 'MANUAL'} type="success" />
              <View style={styles.timeRow}>
                <Clock size={12} color={theme.textMuted} />
                <Text style={[styles.timeText, { color: theme.textMuted }]}>{item.checkInTime}</Text>
              </View>
            </View>
          </Card>
        ))}

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
  scannerCard: {
    padding: 24,
  },
  scannerFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#334155',
    borderRadius: 16,
    gap: 12,
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  scannerDesc: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  scanButton: {
    marginTop: 8,
    width: '80%',
  },
  scannedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNum: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  statText: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginTop: 6,
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logName: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  logService: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  logRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
});
