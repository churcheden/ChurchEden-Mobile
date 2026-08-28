/**
 * selectedChurchStore.ts
 *
 * A lightweight singleton that persists the user's chosen church ID
 * across the onboarding → dashboard flow using AsyncStorage.
 *
 * Used by:
 *   - CompleteProfileScreen / ChurchDetailsScreen (write on join)
 *   - memberDashboardService (read on dashboard load)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'churcheden.selected_church_id';

/** In-memory cache so reads don't hit AsyncStorage every time */
let cached: string | null = null;

/**
 * Persist the church the user selected / joined.
 */
export async function setSelectedChurchId(churchId: string): Promise<void> {
  cached = churchId;
  try {
    await AsyncStorage.setItem(KEY, churchId);
  } catch {
    // Non-blocking: will fall back to in-memory cache for this session.
  }
}

/**
 * Read the persisted church ID.
 * Falls back to 'church_1' (Grace Community Church) when nothing is stored.
 */
export async function getSelectedChurchId(): Promise<string> {
  if (cached) return cached;
  try {
    const stored = await AsyncStorage.getItem(KEY);
    if (stored) {
      cached = stored;
      return stored;
    }
  } catch {
    // Ignored
  }
  return 'church_1';
}

/**
 * Clear persisted selection (e.g. on logout).
 */
export async function clearSelectedChurchId(): Promise<void> {
  cached = null;
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // Ignored
  }
}
