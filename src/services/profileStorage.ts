import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ProfileDraft {
  churchId?: string;
  fullName?: string;
  photoUri?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  city?: string;
  fullAddress?: string;
  maritalStatus?: string;
  occupation?: string;
}

const KEY_PREFIX = 'churcheden.profile.draft.';

function keyFor(churchId: string): string {
  return `${KEY_PREFIX}${churchId}`;
}

export async function loadProfileDraft(churchId: string): Promise<ProfileDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(churchId));
    if (!raw) return null;
    return JSON.parse(raw) as ProfileDraft;
  } catch {
    return null;
  }
}

export async function saveProfileDraft(churchId: string, draft: ProfileDraft): Promise<void> {
  try {
    await AsyncStorage.setItem(keyFor(churchId), JSON.stringify(draft));
  } catch {
    // Non-blocking: form can still proceed without persistence.
  }
}

export async function clearProfileDraft(churchId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(keyFor(churchId));
  } catch {
    // Ignore.
  }
}
