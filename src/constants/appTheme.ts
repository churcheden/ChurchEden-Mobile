/**
 * ChurchEden warm design tokens.
 * Shared by Profile, Settings, AppHeader and related components so the UI
 * color language stays consistent across the application.
 */
export const AppTheme = {
  background: '#F8F7F3',
  surface: '#FFFFFF',
  surfaceBorder: '#ECE7DF',
  divider: '#EFEBE3',

  navy: '#10233F',
  navySoft: '#3A4A63',

  textPrimary: '#172033',
  textSecondary: '#475467',
  textMuted: '#667085',
  textFaint: '#8A99AD',

  gold: '#C98A16',
  goldSoft: '#F5ECD7',
  goldPale: '#FBF6EA',

  danger: '#C23A3A',
  dangerSoft: '#FBEAEA',

  success: '#3F7A3A',
  successSoft: '#EAF2E7',

  shadow: '#000000',
  skeleton: '#E7E3DA',
} as const;

export type AppThemeColors = typeof AppTheme;
export default AppTheme;
