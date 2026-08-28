import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Header } from '../../src/components/common/Header';
import { Card } from '../../src/components/common/Card';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { Donation } from '../../src/types';
import { HeartHandshake, CreditCard, ShieldCheck, CheckCircle, Smartphone, ChevronRight } from 'lucide-react-native';

const CATEGORIES = ['Tithe', 'Offering', 'Building Fund', 'Missions', 'Special Seed'] as const;
const PRESET_AMOUNTS = [25, 50, 100, 250, 500];
const GATEWAYS: Array<Donation['paymentGateway']> = ['Paystack', 'Flutterwave', 'Stripe', 'Mobile Money (MoMo)'];

export default function DonationsScreen() {
  const theme = Colors.dark;
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Donation['category']>('Tithe');
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedGateway, setSelectedGateway] = useState<Donation['paymentGateway']>('Paystack');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGive = () => {
    const amountToGive = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!amountToGive || amountToGive <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid donation amount.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Thank You for Your Giving!',
        `Your ${selectedCategory} of $${amountToGive.toFixed(2)} via ${selectedGateway} was received successfully.`
      );
    }, 1800);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Online Giving" subtitle="Tithes, Offerings & Seeds" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Payment method selection */}
        <TouchableOpacity
          style={styles.methodEntry}
          onPress={() => router.push('/payment-method')}
          accessibilityRole="button"
          accessibilityLabel="Choose a payment method"
        >
          <View style={[styles.methodEntryLeft, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <CreditCard size={20} color={theme.primary} />
            <Text style={[styles.methodEntryText, { color: theme.textPrimary }]}>Choose Payment Method</Text>
          </View>
          <ChevronRight size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Category Picker */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Select Giving Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === cat ? theme.primary : theme.card,
                  borderColor: selectedCategory === cat ? theme.primary : theme.cardBorder,
                },
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.chipText, { color: selectedCategory === cat ? '#FFFFFF' : theme.textSecondary }]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Amount Selector */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Select Amount (USD)</Text>
        <View style={styles.amountGrid}>
          {PRESET_AMOUNTS.map((amt) => (
            <TouchableOpacity
              key={amt}
              style={[
                styles.amountBox,
                {
                  backgroundColor: selectedAmount === amt && !customAmount ? theme.secondary : theme.card,
                  borderColor: selectedAmount === amt && !customAmount ? theme.secondary : theme.cardBorder,
                },
              ]}
              onPress={() => {
                setSelectedAmount(amt);
                setCustomAmount('');
              }}
            >
              <Text style={[styles.amountText, { color: selectedAmount === amt && !customAmount ? '#FFFFFF' : theme.textPrimary }]}>
                ${amt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Amount Input */}
        <View style={[styles.inputBox, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}>
          <Text style={[styles.currencyPrefix, { color: theme.textSecondary }]}>$</Text>
          <TextInput
            style={[styles.customInput, { color: theme.textPrimary }]}
            placeholder="Or enter custom amount..."
            placeholderTextColor={theme.textMuted}
            keyboardType="numeric"
            value={customAmount}
            onChangeText={(val) => {
              setCustomAmount(val);
            }}
          />
        </View>

        {/* Payment Gateway Picker */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Choose Payment Gateway</Text>
        <View style={styles.gatewayList}>
          {GATEWAYS.map((gw) => (
            <TouchableOpacity
              key={gw}
              style={[
                styles.gatewayOption,
                {
                  backgroundColor: theme.card,
                  borderColor: selectedGateway === gw ? theme.primary : theme.cardBorder,
                  borderWidth: selectedGateway === gw ? 2 : 1,
                },
              ]}
              onPress={() => setSelectedGateway(gw)}
            >
              <View style={styles.gwLeft}>
                {gw === 'Mobile Money (MoMo)' ? (
                  <Smartphone size={20} color={theme.secondary} />
                ) : (
                  <CreditCard size={20} color={theme.primary} />
                )}
                <Text style={[styles.gwName, { color: theme.textPrimary }]}>{gw}</Text>
              </View>
              {selectedGateway === gw && <CheckCircle size={20} color={theme.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Giving Action Button */}
        <Button
          title={isProcessing ? 'Processing Gateway Payment...' : `Complete Giving of $${customAmount || selectedAmount}`}
          onPress={handleGive}
          isLoading={isProcessing}
          variant="secondary"
          icon={<HeartHandshake size={20} color="#FFFFFF" />}
          style={styles.giveBtn}
        />

        <View style={styles.securityFooter}>
          <ShieldCheck size={16} color={theme.accentSuccess} />
          <Text style={[styles.securityText, { color: theme.textSecondary }]}>
            256-Bit Encrypted Secure SSL Payment Gateway
          </Text>
        </View>

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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  methodEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  methodEntryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  methodEntryText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  categoryRow: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  amountGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  amountBox: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  customInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  gatewayList: {
    gap: 10,
  },
  gatewayOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
  },
  gwLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gwName: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  giveBtn: {
    marginTop: 10,
    height: 52,
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});
