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
 * Returns null when nothing is stored — callers must resolve the real church
 * from the member's membership (GET /auth/me) rather than a hardcoded mock ID.
 */
export async function getSelectedChurchId(): Promise<string | null> {
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
  return null;
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
