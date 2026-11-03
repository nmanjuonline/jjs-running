import type {
  StorageAdapter,
  StateStore,
  EntityStore,
  SubscriberStore,
  RetryQueueStore,
  RetryTarget
} from './adapter';
import { CONFIG } from '../config';

/**
 * Cloudflare D1 imposes a hard limit of 90 statements per batch execution.
 * This helper slices any array of prepared statements into safe chunks <= 90.
 */
async function executeInChunks(db: D1Database, statements: D1PreparedStatement[]): Promise<void> {
  const chunkSize = CONFIG.LIMITS.MAX_D1_BATCH_STATEMENTS;
  for (let i = 0; i < statements.length; i += chunkSize) {
    const chunk = statements.slice(i, i + chunkSize);
    if (chunk.length > 0) {
      await db.batch(chunk);
    }
  }
}

export class D1StateStore implements StateStore {
  constructor(private db: D1Database) {}

  async get<T = unknown>(key: string): Promise<T | null> {
    const row = await this.db
      .prepare('SELECT value, expires_at FROM state_store WHERE key = ?')
      .bind(key)
      .first<{ value: string; expires_at?: number }>();

    if (!row) return null;
    if (row.expires_at && Date.now() > row.expires_at) {
      await this.delete(key);
      return null;
    }
    try {
      return JSON.parse(row.value) as T;
    } catch {
      return row.value as unknown as T;
    }
  }

  async getMany<T = unknown>(keys: string[]): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};
    for (const key of keys) {
      result[key] = await this.get<T>(key);
    }
    return result;
  }

  async set<T = unknown>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;

    await this.db
      .prepare(
        'INSERT INTO state_store (key, value, expires_at) VALUES (?, ?, ?) ' +
          'ON CONFLICT(key) DO UPDATE SET value = excluded.value, expires_at = excluded.expires_at'
      )
      .bind(key, serialized, expiresAt)
      .run();
  }

  async setMany<T = unknown>(entries: Record<string, T>, ttlSeconds?: number): Promise<void> {
    const statements: D1PreparedStatement[] = [];
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;

    for (const [key, value] of Object.entries(entries)) {
      statements.push(
        this.db
          .prepare(
            'INSERT INTO state_store (key, value, expires_at) VALUES (?, ?, ?) ' +
              'ON CONFLICT(key) DO UPDATE SET value = excluded.value, expires_at = excluded.expires_at'
          )
          .bind(key, JSON.stringify(value), expiresAt)
      );
    }

    await executeInChunks(this.db, statements);
  }

  async delete(key: string): Promise<void> {
    await this.db.prepare('DELETE FROM state_store WHERE key = ?').bind(key).run();
  }
}

export class D1LeadsStore
  implements
    EntityStore<{
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
    }>
{
  constructor(private db: D1Database) {}

  async getById(id: string) {
    const row = await this.db
      .prepare('SELECT * FROM leads WHERE id = ?')
      .bind(id)
      .first<{
        id: string;
        name: string;
        email: string;
        mobile: string;
        center: string | null;
        program: string | null;
        experience_level: string | null;
        notes: string | null;
        source: string | null;
        created_at: string;
      }>();

    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      mobile: row.mobile,
      center: row.center || undefined,
      program: row.program || undefined,
      experienceLevel: row.experience_level || undefined,
      notes: row.notes || undefined,
      source: row.source || undefined,
      createdAt: row.created_at
    };
  }

  async getRecent(limit = 50) {
    const { results } = await this.db
      .prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT ?')
      .bind(limit)
      .all<{
        id: string;
        name: string;
        email: string;
        mobile: string;
        center: string | null;
        program: string | null;
        experience_level: string | null;
        notes: string | null;
        source: string | null;
        created_at: string;
      }>();

    return results.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      mobile: r.mobile,
      center: r.center || undefined,
      program: r.program || undefined,
      experienceLevel: r.experience_level || undefined,
      notes: r.notes || undefined,
      source: r.source || undefined,
      createdAt: r.created_at
    }));
  }

  async save(item: {
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
  }) {
    const id = item.id || crypto.randomUUID();
    const createdAt = item.createdAt || new Date().toISOString();

    await this.db
      .prepare(
        'INSERT INTO leads (id, name, email, mobile, center, program, experience_level, notes, source, created_at) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ' +
          'ON CONFLICT(id) DO UPDATE SET name = excluded.name, email = excluded.email, mobile = excluded.mobile'
      )
      .bind(
        id,
        item.name,
        item.email,
        item.mobile,
        item.center || null,
        item.program || null,
        item.experienceLevel || null,
        item.notes || null,
        item.source || null,
        createdAt
      )
      .run();

    return { ...item, id, createdAt };
  }

  async saveBatch(items: Parameters<typeof this.save>[0][]) {
    const statements: D1PreparedStatement[] = [];
    const results: ReturnType<typeof this.save> extends Promise<infer R> ? R[] : never = [];

    for (const item of items) {
      const id = item.id || crypto.randomUUID();
      const createdAt = item.createdAt || new Date().toISOString();
      results.push({ ...item, id, createdAt });

      statements.push(
        this.db
          .prepare(
            'INSERT INTO leads (id, name, email, mobile, center, program, experience_level, notes, source, created_at) ' +
              'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
          )
          .bind(
            id,
            item.name,
            item.email,
            item.mobile,
            item.center || null,
            item.program || null,
            item.experienceLevel || null,
            item.notes || null,
            item.source || null,
            createdAt
          )
      );
    }

    await executeInChunks(this.db, statements);
    return results;
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.db.prepare('DELETE FROM leads WHERE id = ?').bind(id).run();
    return (res.meta.changes || 0) > 0;
  }
}

export class D1RegistrationsStore
  implements
    EntityStore<{
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
    }>
{
  constructor(private db: D1Database) {}

  async getById(id: string) {
    const row = await this.db
      .prepare('SELECT * FROM registrations WHERE id = ?')
      .bind(id)
      .first<{
        id: string;
        program_id: string;
        program_title: string;
        runner_name: string;
        email: string;
        mobile: string;
        center_name: string;
        level: string;
        total_amount: number | null;
        payment_status: string | null;
        raw_payload: string | null;
        created_at: string;
      }>();

    if (!row) return null;
    return {
      id: row.id,
      programId: row.program_id,
      programTitle: row.program_title,
      runnerName: row.runner_name,
      email: row.email,
      mobile: row.mobile,
      centerName: row.center_name,
      level: row.level,
      totalAmount: row.total_amount ?? undefined,
      paymentStatus: row.payment_status || undefined,
      rawPayload: row.raw_payload || undefined,
      createdAt: row.created_at
    };
  }

  async getRecent(limit = 50) {
    const { results } = await this.db
      .prepare('SELECT * FROM registrations ORDER BY created_at DESC LIMIT ?')
      .bind(limit)
      .all<{
        id: string;
        program_id: string;
        program_title: string;
        runner_name: string;
        email: string;
        mobile: string;
        center_name: string;
        level: string;
        total_amount: number | null;
        payment_status: string | null;
        raw_payload: string | null;
        created_at: string;
      }>();

    return results.map((row) => ({
      id: row.id,
      programId: row.program_id,
      programTitle: row.program_title,
      runnerName: row.runner_name,
      email: row.email,
      mobile: row.mobile,
      centerName: row.center_name,
      level: row.level,
      totalAmount: row.total_amount ?? undefined,
      paymentStatus: row.payment_status || undefined,
      rawPayload: row.raw_payload || undefined,
      createdAt: row.created_at
    }));
  }

  async save(item: {
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
  }) {
    const id =
      item.id ||
      `JJs-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdAt = item.createdAt || new Date().toISOString();

    await this.db
      .prepare(
        'INSERT INTO registrations (id, program_id, program_title, runner_name, email, mobile, center_name, level, total_amount, payment_status, raw_payload, created_at) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ' +
          'ON CONFLICT(id) DO UPDATE SET runner_name = excluded.runner_name, payment_status = excluded.payment_status'
      )
      .bind(
        id,
        item.programId,
        item.programTitle,
        item.runnerName,
        item.email,
        item.mobile,
        item.centerName,
        item.level,
        item.totalAmount ?? null,
        item.paymentStatus || 'pending',
        item.rawPayload || null,
        createdAt
      )
      .run();

    return { ...item, id, createdAt };
  }

  async saveBatch(items: Parameters<typeof this.save>[0][]) {
    const statements: D1PreparedStatement[] = [];
    const saved: Parameters<typeof this.save>[0][] = [];

    for (const item of items) {
      const id =
        item.id ||
        `JJs-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const createdAt = item.createdAt || new Date().toISOString();
      saved.push({ ...item, id, createdAt });

      statements.push(
        this.db
          .prepare(
            'INSERT INTO registrations (id, program_id, program_title, runner_name, email, mobile, center_name, level, total_amount, payment_status, raw_payload, created_at) ' +
              'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
          )
          .bind(
            id,
            item.programId,
            item.programTitle,
            item.runnerName,
            item.email,
            item.mobile,
            item.centerName,
            item.level,
            item.totalAmount ?? null,
            item.paymentStatus || 'pending',
            item.rawPayload || null,
            createdAt
          )
      );
    }

    await executeInChunks(this.db, statements);
    return saved;
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.db.prepare('DELETE FROM registrations WHERE id = ?').bind(id).run();
    return (res.meta.changes || 0) > 0;
  }
}

export class D1SubscriberStore implements SubscriberStore {
  constructor(private db: D1Database) {}

  async addEmail(email: string, topics: string[] = ['general']): Promise<boolean> {
    const id = crypto.randomUUID();
    const cleanEmail = email.toLowerCase().trim();
    await this.db
      .prepare(
        'INSERT INTO subscribers (id, email, topics, status, created_at) ' +
          'VALUES (?, ?, ?, ?, ?) ' +
          'ON CONFLICT(email) DO UPDATE SET status = "active", topics = excluded.topics'
      )
      .bind(id, cleanEmail, JSON.stringify(topics), 'active', new Date().toISOString())
      .run();
    return true;
  }

  async upsertPushToken(token: {
    endpoint: string;
    p256dh: string;
    auth: string;
    topics?: string[];
  }): Promise<boolean> {
    const id = crypto.randomUUID();
    await this.db
      .prepare(
        'INSERT INTO subscribers (id, push_endpoint, push_p256dh, push_auth, topics, status, created_at) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?) ' +
          'ON CONFLICT(push_endpoint) DO UPDATE SET push_p256dh = excluded.push_p256dh, push_auth = excluded.push_auth, status = "active"'
      )
      .bind(
        id,
        token.endpoint,
        token.p256dh,
        token.auth,
        JSON.stringify(token.topics || ['broadcast']),
        'active',
        new Date().toISOString()
      )
      .run();
    return true;
  }

  async prunePushEndpoint(endpoint: string): Promise<boolean> {
    await this.db.prepare('DELETE FROM subscribers WHERE push_endpoint = ?').bind(endpoint).run();
    return true;
  }

  async getCounts(): Promise<{ emailCount: number; pushCount: number }> {
    const emailRes = await this.db
      .prepare('SELECT COUNT(*) as count FROM subscribers WHERE email IS NOT NULL AND status = "active"')
      .first<{ count: number }>();
    const pushRes = await this.db
      .prepare('SELECT COUNT(*) as count FROM subscribers WHERE push_endpoint IS NOT NULL AND status = "active"')
      .first<{ count: number }>();

    return {
      emailCount: emailRes?.count || 0,
      pushCount: pushRes?.count || 0
    };
  }
}

export class D1RetryQueueStore<TTarget = unknown> implements RetryQueueStore<TTarget> {
  constructor(private db: D1Database) {}

  async getRetryTargets(limit = 20): Promise<RetryTarget<TTarget>[]> {
    const now = new Date().toISOString();
    const { results } = await this.db
      .prepare('SELECT * FROM retry_queue WHERE next_retry_at <= ? ORDER BY next_retry_at ASC LIMIT ?')
      .bind(now, limit)
      .all<{
        id: string;
        target_type: string;
        payload: string;
        attempts: number;
        last_attempt_at: string | null;
        next_retry_at: string;
        last_error: string | null;
      }>();

    return results.map((row) => ({
      id: row.id,
      targetType: row.target_type,
      payload: JSON.parse(row.payload) as TTarget,
      attempts: row.attempts,
      lastAttemptAt: row.last_attempt_at || undefined,
      nextRetryAt: row.next_retry_at,
      lastError: row.last_error || undefined
    }));
  }

  async recordAttempt(id: string, success: boolean, error?: string): Promise<void> {
    if (success) {
      await this.clearTarget(id);
      return;
    }

    const row = await this.db
      .prepare('SELECT attempts FROM retry_queue WHERE id = ?')
      .bind(id)
      .first<{ attempts: number }>();

    if (!row) return;

    if (row.attempts + 1 >= CONFIG.LIMITS.MAX_RETRY_ATTEMPTS) {
      await this.clearTarget(id);
      return;
    }

    const nextDelay = CONFIG.LIMITS.DEFAULT_RETRY_BACKOFF_MS * Math.pow(2, row.attempts);
    const nextRetryAt = new Date(Date.now() + nextDelay).toISOString();

    await this.db
      .prepare(
        'UPDATE retry_queue SET attempts = attempts + 1, last_attempt_at = ?, next_retry_at = ?, last_error = ? WHERE id = ?'
      )
      .bind(new Date().toISOString(), nextRetryAt, error || null, id)
      .run();
  }

  async clearTarget(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM retry_queue WHERE id = ?').bind(id).run();
  }

  async enqueue(targetType: string, payload: TTarget): Promise<string> {
    const id = crypto.randomUUID();
    await this.db
      .prepare(
        'INSERT INTO retry_queue (id, target_type, payload, attempts, next_retry_at) VALUES (?, ?, ?, ?, ?)'
      )
      .bind(id, targetType, JSON.stringify(payload), 0, new Date().toISOString())
      .run();
    return id;
  }
}

export class D1StorageAdapter implements StorageAdapter {
  state: D1StateStore;
  leads: D1LeadsStore;
  registrations: D1RegistrationsStore;
  subscribers: D1SubscriberStore;
  retryQueue: D1RetryQueueStore;

  constructor(private db: D1Database) {
    this.state = new D1StateStore(db);
    this.leads = new D1LeadsStore(db);
    this.registrations = new D1RegistrationsStore(db);
    this.subscribers = new D1SubscriberStore(db);
    this.retryQueue = new D1RetryQueueStore(db);
  }

  async ensureSchema(): Promise<void> {
    // In production, migrations handle D1 schema.
  }
}

