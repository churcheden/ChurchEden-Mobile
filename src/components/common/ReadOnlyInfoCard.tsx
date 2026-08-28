import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppTheme } from '../../constants/appTheme';

interface InfoFieldProps {
  label: string;
  value: string;
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

interface ReadOnlyInfoCardProps {
  title: string;
  fields: InfoFieldProps[];
  children?: React.ReactNode;
}

/**
 * A strictly informational grouped card (no row actions, no chevrons).
 */
export function ReadOnlyInfoCard({ title, fields, children }: ReadOnlyInfoCardProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {fields.map((f, index) => (
          <React.Fragment key={f.label}>
            {index > 0 && <View style={styles.divider} />}
            <InfoField label={f.label} value={f.value} />
          </React.Fragment>
        ))}
        {children ? (
          <>
            <View style={styles.divider} />
            {children}
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppTheme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 4,
    fontFamily: 'Inter-SemiBold',
  },
  card: {
    backgroundColor: AppTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.surfaceBorder,
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: AppTheme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  field: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: AppTheme.textFaint,
    letterSpacing: 0.6,
    fontFamily: 'Inter-SemiBold',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: AppTheme.textPrimary,
    marginTop: 4,
    fontFamily: 'Inter-SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.divider,
  },
});

export default ReadOnlyInfoCard;
