import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, ReceiptText } from 'lucide-react-native';

const C = {
  background: '#F8F7F3',
  navy: '#10233F',
  muted: '#667085',
  gold: '#C98A16',
  goldSoft: '#F5ECD7',
} as const;

export default function GivingHistoryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color={C.navy} strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giving History</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <ReceiptText size={34} color={C.gold} strokeWidth={1.8} />
        </View>
        <Text style={styles.title}>Your giving breakdown is on the way</Text>
        <Text style={styles.subtitle}>
          A detailed giving history and breakdown screen will be integrated here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1EFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.navy,
    fontFamily: 'Inter-Bold',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: C.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: C.navy,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 14,
    color: C.muted,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
    fontFamily: 'Inter-Regular',
  },
});
