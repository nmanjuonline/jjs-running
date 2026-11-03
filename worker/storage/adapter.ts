export interface StateStore {
  get<T = unknown>(key: string): Promise<T | null>;
  getMany<T = unknown>(keys: string[]): Promise<Record<string, T | null>>;
  set<T = unknown>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  setMany<T = unknown>(entries: Record<string, T>, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface EntityStore<T extends { id?: string }> {
  getById(id: string): Promise<T | null>;
  getRecent(limit?: number): Promise<T[]>;
  save(item: T): Promise<T>;
  saveBatch(items: T[]): Promise<T[]>;
  delete(id: string): Promise<boolean>;
  ensureSchema?(): Promise<void>;
}

export interface RetryTarget<T = unknown> {
  id: string;
  targetType: string;
  payload: T;
  attempts: number;
  lastAttemptAt?: string;
  nextRetryAt: string;
  lastError?: string;
}

export interface RetryQueueStore<TTarget = unknown> {
  getRetryTargets(limit?: number): Promise<RetryTarget<TTarget>[]>;
  recordAttempt(id: string, success: boolean, error?: string): Promise<void>;
  clearTarget(id: string): Promise<void>;
  enqueue(targetType: string, payload: TTarget): Promise<string>;
}

export interface SubscriberRecord {
  id?: string;
  email?: string;
  pushEndpoint?: string;
  pushP256dh?: string;
  pushAuth?: string;
  topics?: string[];
  createdAt?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
}

export interface SubscriberStore {
  addEmail(email: string, topics?: string[]): Promise<boolean>;
  upsertPushToken(token: { endpoint: string; p256dh: string; auth: string; topics?: string[] }): Promise<boolean>;
  prunePushEndpoint(endpoint: string): Promise<boolean>;
  getCounts(): Promise<{ emailCount: number; pushCount: number }>;
}

export interface StorageAdapter {
  state: StateStore;
  leads: EntityStore<{
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
  }>;
  registrations: EntityStore<{
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
  }>;
  subscribers: SubscriberStore;
  retryQueue: RetryQueueStore;
  ensureSchema(): Promise<void>;
}

