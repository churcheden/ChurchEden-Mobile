import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { AppTheme } from '../../constants/appTheme';

interface SettingsRowProps {
  icon: React.ReactNode;
  iconBg?: string;
  label: string;
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  value?: string;
  showChevron?: boolean;
  destructive?: boolean;
  accessibilityLabel?: string;
}

/**
 * A single settings row: icon badge, label, optional value, then either
 * a ChevronRight (navigation) or a Switch (toggle).
 */
export function SettingsRow({
  icon,
  iconBg = AppTheme.goldPale,
  label,
  onPress,
  switchValue,
  onSwitchChange,
  value,
  showChevron = true,
  destructive = false,
  accessibilityLabel,
}: SettingsRowProps) {
  if (switchValue !== undefined && onSwitchChange) {
    return (
      <View style={[styles.row, styles.spaceBetween]} accessibilityRole="switch" accessibilityState={{ checked: switchValue }}>
        <View style={styles.left}>
          <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>{icon}</View>
          <Text style={styles.label}>{label}</Text>
        </View>
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#D5DBE4', true: AppTheme.gold }}
          thumbColor="#FFFFFF"
          accessibilityLabel={accessibilityLabel || label}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel || label}
    >
      <View style={styles.left}>
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>{icon}</View>
        <Text style={[styles.label, destructive && styles.destructiveLabel]}>{label}</Text>
      </View>

      {value ? <Text style={styles.value} numberOfLines={1}>{value}</Text> : null}

      {showChevron && onPress && (
        <ChevronRight size={18} color={AppTheme.textFaint} strokeWidth={2} />
      )}
    </TouchableOpacity>
  );
}

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * A titled group of settings rows rendered inside a single rounded card.
 */
export function SettingsSection({ title, children, footer }: SettingsSectionProps) {
  const rows = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {rows.map((child, index) => (
          <React.Fragment key={index}>
            {index > 0 && <View style={styles.divider} />}
            {child}
          </React.Fragment>
        ))}
        {footer ? (
          <>
            <View style={styles.divider} />
            {footer}
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
    paddingHorizontal: 14,
    shadowColor: AppTheme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    minHeight: 60,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: AppTheme.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  destructiveLabel: {
    color: AppTheme.danger,
  },
  value: {
    fontSize: 14,
    color: AppTheme.textMuted,
    marginRight: 8,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.divider,
  },
});

export { SettingsRow as ToggleRow, SettingsSection };
export default SettingsRow;
