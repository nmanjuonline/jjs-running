import type { Env } from '../types';
import type { StorageAdapter } from './adapter';
import { D1StorageAdapter } from './d1';
import { MemoryStorageAdapter } from './memory';

const storageCache = new WeakMap<Env, StorageAdapter>();
let fallbackMemoryStorage: StorageAdapter | null = null;

export function getStorage(env: Env): StorageAdapter {
  // If env is an object, use WeakMap memoization
  if (typeof env === 'object' && env !== null) {
    const cached = storageCache.get(env);
    if (cached) return cached;

    let adapter: StorageAdapter;
    if (env.DB) {
      adapter = new D1StorageAdapter(env.DB);
    } else {
      adapter = new MemoryStorageAdapter();
    }

    storageCache.set(env, adapter);
    return adapter;
  }

  // Fallback if env is undefined/mock
  if (!fallbackMemoryStorage) {
    fallbackMemoryStorage = new MemoryStorageAdapter();
  }
  return fallbackMemoryStorage;
}

export * from './adapter';

