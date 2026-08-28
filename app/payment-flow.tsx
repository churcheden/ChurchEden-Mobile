import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Construction } from 'lucide-react-native';

const C = {
  background: '#F9F8F4',
  navy: '#10233F',
  muted: '#63738A',
  green: '#4F7F48',
  greenSoft: '#EDF4EA',
} as const;

const METHOD_LABELS: Record<string, string> = {
  momo: 'MoMo',
  bank_transfer: 'Bank Transfer',
  stripe: 'Stripe',
  google_pay: 'Google Pay',
  apple_pay: 'Apple Pay',
};

export default function PaymentFlowScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ method?: string }>();
  const method = params.method || 'momo';
  const label = METHOD_LABELS[method] || 'this payment method';

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
        <Text style={styles.headerTitle}>{label} Payment</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Construction size={34} color={C.green} strokeWidth={2} />
        </View>
        <Text style={styles.title}>{label} flow is on the way</Text>
        <Text style={styles.subtitle}>
          The {label} payment flow will be integrated here. This is a placeholder
          to keep the payment method selection functional.
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
    paddingHorizontal: 24,
    paddingTop: 16,
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
    fontSize: 17,
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
    backgroundColor: C.greenSoft,
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
