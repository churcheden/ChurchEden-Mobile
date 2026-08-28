export const Colors = {
  dark: {
    primary: '#6366F1', // Indigo Vibrant
    primaryHover: '#4F46E5',
    secondary: '#F59E0B', // Amber Gold
    background: '#0F172A', // Slate 900
    card: '#1E293B', // Slate 800
    cardBorder: '#334155', // Slate 700
    textPrimary: '#F8FAFC', // Slate 50
    textSecondary: '#94A3B8', // Slate 400
    textMuted: '#64748B', // Slate 500
    accentSuccess: '#10B981', // Emerald
    accentDanger: '#EF4444', // Red
    accentWarning: '#F59E0B', // Amber
    accentInfo: '#3B82F6', // Blue
    badgeBackground: '#312E81',
    tabBarBackground: '#0B1120',
    tabBarActive: '#818CF8',
    tabBarInactive: '#64748B',
    inputBackground: '#1E293B',
    inputBorder: '#334155',
    divider: '#1E293B'
  },
  light: {
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    secondary: '#D97706',
    background: '#F8FAFC',
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    accentSuccess: '#059669',
    accentDanger: '#DC2626',
    accentWarning: '#D97706',
    accentInfo: '#2563EB',
    badgeBackground: '#EEF2FF',
    tabBarBackground: '#FFFFFF',
    tabBarActive: '#4F46E5',
    tabBarInactive: '#94A3B8',
    inputBackground: '#FFFFFF',
    inputBorder: '#CBD5E1',
    divider: '#F1F5F9'
  }
};

export type ColorTheme = typeof Colors.dark;
export default Colors;
