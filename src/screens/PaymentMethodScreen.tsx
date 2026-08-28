import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../hooks/useAuth';
import {
  ArrowLeft,
  ArrowRight,
  Smartphone,
  Landmark,
  CreditCard,
  ShieldCheck,
  WalletCards,
} from 'lucide-react-native';
import { PaymentMethodCard } from '../components/wallet/PaymentMethodCard';

const C = {
  background: '#F9F8F4',
  navy: '#10233F',
  muted: '#63738A',
  mutedLight: '#8A99AD',
  green: '#4F7F48',
  greenSoft: '#EDF4EA',
  headerBtn: '#F1EFEA',
  white: '#FFFFFF',
} as const;

type PaymentMethodId =
  | 'momo'
  | 'bank_transfer'
  | 'stripe'
  | 'google_pay'
  | 'apple_pay';

interface PaymentMethodConfig {
  id: PaymentMethodId;
  title: string;
  description: string;
  icon: React.ReactNode;
  accessory: React.ReactNode;
  route: string;
}

function SupportingRow({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <View style={styles.supportingRow}>
      {icon}
      <Text style={styles.supportingText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

export function PaymentMethodScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ category?: string; amount?: string }>();
  const contextCategory = params.category || '';
  const contextAmount = params.amount || '';

  const [selected, setSelected] = useState<PaymentMethodId>('momo');

  const methods: PaymentMethodConfig[] = [
    {
      id: 'momo',
      title: 'MoMo',
      description: 'Pay with Mobile Money',
      icon: <Smartphone size={26} color={C.green} strokeWidth={2} />,
      accessory: (
        <SupportingRow
          icon={<Smartphone size={13} color={C.mutedLight} strokeWidth={2} />}
          text="MTN, Vodafone, AirtelTigo"
        />
      ),
      route: 'momo',
    },
    {
      id: 'bank_transfer',
      title: 'Bank Transfer',
      description: 'Pay directly from your bank account',
      icon: <Landmark size={26} color={C.green} strokeWidth={2} />,
      accessory: (
        <SupportingRow
          icon={<ShieldCheck size={13} color={C.mutedLight} strokeWidth={2} />}
          text="Secure & reliable"
        />
      ),
      route: 'bank_transfer',
    },
    {
      id: 'stripe',
      title: 'Stripe',
      description: 'Pay with card (US only)',
      icon: <CreditCard size={26} color={C.green} strokeWidth={2} />,
      accessory: (
        <SupportingRow
          icon={<CreditCard size={13} color={C.mutedLight} strokeWidth={2} />}
          text="Visa, Mastercard, American Express"
        />
      ),
      route: 'stripe',
    },
    {
      id: 'google_pay',
      title: 'Google Pay',
      description: 'Pay quickly and securely with Google Pay',
      icon: <WalletCards size={26} color={C.green} strokeWidth={2} />,
      accessory: (
        <SupportingRow
          icon={<ShieldCheck size={13} color={C.mutedLight} strokeWidth={2} />}
          text="Fast, easy & secure"
        />
      ),
      route: 'google_pay',
    },
    {
      id: 'apple_pay',
      title: 'Apple Pay',
      description: 'Pay quickly and securely with Apple Pay',
      icon: <WalletCards size={26} color={C.green} strokeWidth={2} />,
      accessory: (
        <SupportingRow
          icon={<ShieldCheck size={13} color={C.mutedLight} strokeWidth={2} />}
          text="Fast, easy & secure"
        />
      ),
      route: 'apple_pay',
    },
  ];

  const selectedMethod =
    methods.find((m) => m.id === selected) ?? methods[0];

  const handleContinue = () => {
    // TODO: wire each route to its real payment flow once integrated.
    router.push({
      pathname: '/payment-flow',
      params: {
        method: selectedMethod.route,
        category: contextCategory,
        amount: contextAmount,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={20} color={C.navy} strokeWidth={2.2} />
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={styles.walletTitle}>My Wallet</Text>
            <Text style={styles.walletSubtitle}>Give • Track • Make an Impact</Text>
          </View>
        </View>

        <View style={styles.avatarWrap}>
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitials}>
                {(user?.fullName || 'U')
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.statusDot} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text style={styles.pageTitle}>Choose Payment Method</Text>
        <Text style={styles.pageSubtitle}>
          Select your preferred payment method to make your donation or payment
          securely.
        </Text>

        {/* Payment methods */}
        <View style={styles.methodList}>
          {methods.map((m) => (
            <PaymentMethodCard
              key={m.id}
              title={m.title}
              description={m.description}
              icon={m.icon}
              accessory={m.accessory}
              selected={selected === m.id}
              onPress={() => setSelected(m.id)}
              accessibilityLabel={`${m.title}, ${m.description}`}
            />
          ))}
        </View>

        {/* Security notice */}
        <View style={styles.securityCard}>
          <View style={styles.securityIconWrap}>
            <ShieldCheck size={22} color={C.green} strokeWidth={2} />
          </View>
          <View style={styles.securityBody}>
            <Text style={styles.securityTitle}>Your payment is secure</Text>
            <Text style={styles.securityText}>
              We use industry-standard encryption to keep your information safe
              and secure.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Continue with ${selectedMethod.title}`}
        >
          <Text style={styles.continueText}>Continue</Text>
          <ArrowRight size={20} color={C.white} strokeWidth={2.4} />
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.headerBtn,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    justifyContent: 'center',
  },
  walletTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: C.navy,
    fontFamily: 'Inter-Bold',
  },
  walletSubtitle: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  avatarWrap: {
    width: 44,
    height: 44,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    backgroundColor: C.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: '700',
    color: C.green,
    fontFamily: 'Inter-Bold',
  },
  statusDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3BB548',
    borderWidth: 2,
    borderColor: C.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.navy,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.2,
  },
  pageSubtitle: {
    fontSize: 14,
    color: C.muted,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 22,
    fontFamily: 'Inter-Regular',
  },
  methodList: {
    gap: 11,
  },
  supportingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  supportingText: {
    fontSize: 12,
    color: C.mutedLight,
    fontFamily: 'Inter-Regular',
    flexShrink: 1,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.greenSoft,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 18,
  },
  securityIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(79,127,72,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityBody: {
    flex: 1,
    marginLeft: 12,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.green,
    fontFamily: 'Inter-Bold',
  },
  securityText: {
    fontSize: 12,
    color: C.muted,
    lineHeight: 17,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  continueButton: {
    height: 48,
    borderRadius: 16,
    backgroundColor: C.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
    color: C.white,
    fontFamily: 'Inter-SemiBold',
  },
});

export default PaymentMethodScreen;
