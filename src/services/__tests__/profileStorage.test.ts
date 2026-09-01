import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearProfileDraft,
  loadProfileDraft,
  saveProfileDraft,
} from '@/services/profileStorage';

const mocked = vi.hoisted(() => {
  const store = new Map<string, string>();
  return {
    store,
    asyncStorage: {
      getItem: async (k: string) => store.get(k) ?? null,
      setItem: async (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: async (k: string) => {
        store.delete(k);
      },
    },
  };
});

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: mocked.asyncStorage,
}));

beforeEach(() => {
  mocked.store.clear();
});

describe('profileStorage', () => {
  it('round-trips a draft for a church', async () => {
    await saveProfileDraft('church-1', { fullName: 'Grace', phoneCountry: 'GH' });
    await expect(loadProfileDraft('church-1')).resolves.toEqual({
      fullName: 'Grace',
      phoneCountry: 'GH',
    });
  });

  it('returns null when nothing is stored', async () => {
    await expect(loadProfileDraft('nope')).resolves.toBeNull();
  });

  it('keys drafts by churchId', async () => {
    await saveProfileDraft('a', { fullName: 'A' });
    await saveProfileDraft('b', { fullName: 'B' });
    await expect(loadProfileDraft('a')).resolves.toEqual({ fullName: 'A' });
    await expect(loadProfileDraft('b')).resolves.toEqual({ fullName: 'B' });
  });

  it('clears a draft', async () => {
    await saveProfileDraft('a', { fullName: 'A' });
    await clearProfileDraft('a');
    await expect(loadProfileDraft('a')).resolves.toBeNull();
  });

  it('returns null on corrupted JSON', async () => {
    mocked.store.set('churcheden.profile.draft.c', '{bad json');
    await expect(loadProfileDraft('c')).resolves.toBeNull();
  });
});
