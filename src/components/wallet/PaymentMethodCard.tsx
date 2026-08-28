import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PaymentMethodCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accessory?: React.ReactNode;
  selected: boolean;
  onPress: () => void;
  tint?: string;
  accessibilityLabel?: string;
}

const WALLET_PALETTE = {
  green: '#4F7F48',
  greenSoft: '#EDF4EA',
  navy: '#10233F',
  border: '#E8E8E3',
  surface: '#FFFFFF',
  muted: '#63738A',
  mutedLight: '#8A99AD',
} as const;

export function PaymentMethodCard({
  title,
  description,
  icon,
  accessory,
  selected,
  onPress,
  tint = WALLET_PALETTE.greenSoft,
  accessibilityLabel,
}: PaymentMethodCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor: selected ? WALLET_PALETTE.green : WALLET_PALETTE.border,
          backgroundColor: selected ? '#FBFDFA' : WALLET_PALETTE.surface,
        },
      ]}
      activeOpacity={0.75}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel || title}
    >
      <View style={[styles.iconWrap, { backgroundColor: tint }]}>{icon}</View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
        {accessory ? <View style={styles.accessory}>{accessory}</View> : null}
      </View>

      <View
        style={[
          styles.radio,
          { borderColor: selected ? WALLET_PALETTE.green : '#CBD2DC' },
        ]}
      >
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 92,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: WALLET_PALETTE.navy,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 13,
    color: WALLET_PALETTE.muted,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  accessory: {
    marginTop: 6,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: WALLET_PALETTE.green,
  },
});

export default PaymentMethodCard;
