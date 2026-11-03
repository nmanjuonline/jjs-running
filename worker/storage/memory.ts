import type {
  StorageAdapter,
  StateStore,
  EntityStore,
  SubscriberStore,
  RetryQueueStore,
  RetryTarget
} from './adapter';
import { CONFIG } from '../config';

export class MemoryStateStore implements StateStore {
  private map = new Map<string, { value: unknown; expiresAt?: number }>();

  async get<T = unknown>(key: string): Promise<T | null> {
    const entry = this.map.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async getMany<T = unknown>(keys: string[]): Promise<Record<string, T | null>> {
    const res: Record<string, T | null> = {};
    for (const k of keys) {
      res[k] = await this.get<T>(k);
    }
    return res;
  }

  async set<T = unknown>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.map.set(key, { value, expiresAt });
  }

  async setMany<T = unknown>(entries: Record<string, T>, ttlSeconds?: number): Promise<void> {
    for (const [key, value] of Object.entries(entries)) {
      await this.set(key, value, ttlSeconds);
    }
  }

  async delete(key: string): Promise<void> {
    this.map.delete(key);
  }
}

export class MemoryEntityStore<T extends { id?: string; createdAt?: string }> implements EntityStore<T> {
  private items = new Map<string, T>();

  async getById(id: string): Promise<T | null> {
    return this.items.get(id) || null;
  }

  async getRecent(limit = 50): Promise<T[]> {
    return Array.from(this.items.values())
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, limit);
  }

  async save(item: T): Promise<T> {
    const id = item.id || crypto.randomUUID();
    const entity = {
      ...item,
      id,
      createdAt: item.createdAt || new Date().toISOString()
    };
    this.items.set(id, entity);
    return entity;
  }

  async saveBatch(items: T[]): Promise<T[]> {
    const saved: T[] = [];
    for (const item of items) {
      saved.push(await this.save(item));
    }
    return saved;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}

export class MemorySubscriberStore implements SubscriberStore {
  private emails = new Set<string>();
  private pushEndpoints = new Map<string, { endpoint: string; p256dh: string; auth: string; topics?: string[] }>();

  async addEmail(email: string): Promise<boolean> {
    this.emails.add(email.toLowerCase().trim());
    return true;
  }

  async upsertPushToken(token: { endpoint: string; p256dh: string; auth: string; topics?: string[] }): Promise<boolean> {
    this.pushEndpoints.set(token.endpoint, token);
    return true;
  }

  async prunePushEndpoint(endpoint: string): Promise<boolean> {
    return this.pushEndpoints.delete(endpoint);
  }

  async getCounts(): Promise<{ emailCount: number; pushCount: number }> {
    return {
      emailCount: this.emails.size,
      pushCount: this.pushEndpoints.size
    };
  }
}

export class MemoryRetryQueueStore<TTarget = unknown> implements RetryQueueStore<TTarget> {
  private queue = new Map<string, RetryTarget<TTarget>>();

  async getRetryTargets(limit = 20): Promise<RetryTarget<TTarget>[]> {
    const now = new Date().toISOString();
    return Array.from(this.queue.values())
      .filter((target) => target.nextRetryAt <= now)
      .slice(0, limit);
  }

  async recordAttempt(id: string, success: boolean, error?: string): Promise<void> {
    const target = this.queue.get(id);
    if (!target) return;

    if (success || target.attempts + 1 >= CONFIG.LIMITS.MAX_RETRY_ATTEMPTS) {
      this.queue.delete(id);
      return;
    }

    const nextDelay = CONFIG.LIMITS.DEFAULT_RETRY_BACKOFF_MS * Math.pow(2, target.attempts);
    target.attempts += 1;
    target.lastAttemptAt = new Date().toISOString();
    target.nextRetryAt = new Date(Date.now() + nextDelay).toISOString();
    target.lastError = error;
    this.queue.set(id, target);
  }

  async clearTarget(id: string): Promise<void> {
    this.queue.delete(id);
  }

  async enqueue(targetType: string, payload: TTarget): Promise<string> {
    const id = crypto.randomUUID();
    this.queue.set(id, {
      id,
      targetType,
      payload,
      attempts: 0,
      nextRetryAt: new Date().toISOString()
    });
    return id;
  }
}

export class MemoryStorageAdapter implements StorageAdapter {
  state = new MemoryStateStore();
  leads = new MemoryEntityStore<{
    id?: string;
    name: string;
    email: string;
    mobile: string;
    center?: string;
    program?: string;
    experienceLevel?: string;
    notes?: string;
    source?: string;
    createdAt?: string;
  }>();
  registrations = new MemoryEntityStore<{
    id?: string;
    programId: string;
    programTitle: string;
    runnerName: string;
    email: string;
    mobile: string;
    centerName: string;
    level: string;
    totalAmount?: number;
    paymentStatus?: string;
    rawPayload?: string;
    createdAt?: string;
  }>();
  subscribers = new MemorySubscriberStore();
  retryQueue = new MemoryRetryQueueStore();

  async ensureSchema(): Promise<void> {
    // No-op for in-memory
  }
}

