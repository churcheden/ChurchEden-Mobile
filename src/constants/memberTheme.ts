export const MemberTheme = {
  background: '#F8F7F3',
  surface: '#FFFFFF',
  surfaceBorder: '#ECE7DF',
  primary: '#3F7A3A',
  primarySoft: '#EAF2E7',
  primaryMuted: '#6F9368',
  primaryPale: '#F3F8F1',
  textPrimary: '#172033',
  textSecondary: '#475467',
  textMuted: '#667085',
  textOnDark: '#FFFFFF',
  danger: '#D14343',
  divider: '#EFEBE3',
  gold: '#C98A16',
  shadow: '#000000',
  skeleton: '#E7E3DA',
  skeletonLight: '#EFEBE3',
} as const;

export type MemberThemeColors = typeof MemberTheme;
export default MemberTheme;
