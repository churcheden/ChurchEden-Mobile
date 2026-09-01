import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearSelectedChurchId,
  getSelectedChurchId,
  setSelectedChurchId,
} from '@/services/selectedChurchStore';

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

describe('selectedChurchStore', () => {
  it('returns null when nothing is stored', async () => {
    await expect(getSelectedChurchId()).resolves.toBeNull();
  });

  it('persists and reads the selected church id', async () => {
    await setSelectedChurchId('church-42');
    await expect(getSelectedChurchId()).resolves.toBe('church-42');
  });

  it('clears the selection', async () => {
    await setSelectedChurchId('church-42');
    await clearSelectedChurchId();
    await expect(getSelectedChurchId()).resolves.toBeNull();
  });

  it('reads a value persisted to the underlying store', async () => {
    mocked.store.set('churcheden.selected_church_id', 'church-9');
    await expect(getSelectedChurchId()).resolves.toBe('church-9');
  });
});
