import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../src/constants/Colors';
import { Card } from '../src/components/common/Card';
import { Badge } from '../src/components/common/Badge';

export default function ModalScreen() {
  const theme = Colors.dark;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card style={styles.card}>
        <Badge label="CHURCHEDEN MOBILE" type="primary" />
        <Text style={[styles.title, { color: theme.textPrimary }]}>About ChurchEden App</Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          ChurchEden Mobile is engineered for modern church operations, digital attendance check-ins, online tithes & offerings, and member engagement.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    gap: 12,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
});
