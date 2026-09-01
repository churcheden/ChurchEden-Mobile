import { describe, expect, it, vi } from 'vitest';
import { withRefreshMutex } from '@/lib/refreshMutex';

describe('withRefreshMutex', () => {
  it('runs the inner function once and resolves', async () => {
    const inner = vi.fn().mockResolvedValue(undefined);
    await withRefreshMutex(inner);
    expect(inner).toHaveBeenCalledTimes(1);
  });

  it('deduplicates concurrent calls while a refresh is in flight', async () => {
    let release!: () => void;
    const inner = vi.fn(
      () => new Promise<void>((resolve) => (release = resolve)),
    );

    const p1 = withRefreshMutex(inner);
    const p2 = withRefreshMutex(inner);
    const p3 = withRefreshMutex(inner);

    await Promise.resolve();
    expect(inner).toHaveBeenCalledTimes(1);

    release();
    await Promise.all([p1, p2, p3]);

    expect(inner).toHaveBeenCalledTimes(1);
  });

  it('allows a new run after the previous completes', async () => {
    const inner = vi.fn().mockResolvedValue(undefined);
    await withRefreshMutex(inner);
    await withRefreshMutex(inner);
    expect(inner).toHaveBeenCalledTimes(2);
  });

  it('clears the mutex even when the inner fn rejects', async () => {
    const inner = vi
      .fn()
      .mockRejectedValueOnce(new Error('refresh failed'))
      .mockResolvedValueOnce(undefined);

    await expect(withRefreshMutex(inner)).rejects.toThrow('refresh failed');
    await withRefreshMutex(inner);
    expect(inner).toHaveBeenCalledTimes(2);
  });
});
