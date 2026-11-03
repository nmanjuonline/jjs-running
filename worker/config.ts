import type { Env } from './types';

export const CONFIG = {
  APP: {
    NAME: 'JJs Running',
    SHORT_NAME: 'JJs',
    VERSION: '1.0.0',
    SUPPORT_EMAIL: 'support@jjsrunning.com',
    DEFAULT_CURRENCY: 'INR'
  },
  SITES: {
    PRODUCTION: 'https://jjsrunning.com',
    STAGING: 'https://staging.jjsrunning.com',
    LOCAL: 'http://localhost:5173'
  },
  LIMITS: {
    MAX_SUBREQUESTS: 50,
    MAX_D1_BATCH_STATEMENTS: 90, // Cloudflare D1 hard safety limit
    MAX_PAYLOAD_BYTES: 1024 * 512, // 512 KB
    MAX_BATCH_RECORDS: 100,
    DEFAULT_RETRY_BACKOFF_MS: 5000,
    MAX_RETRY_ATTEMPTS: 5,
    RATE_LIMIT_PER_MINUTE: 30
  },
  STORAGE: {
    DEFAULT_ENGINE: 'd1',
    FALLBACK_ENGINE: 'memory',
    STATE_TTL_SECONDS: 86400 * 30 // 30 days
  },
  NOTIFICATIONS: {
    ADMIN_NOTIFICATION_ENABLED: true,
    WELCOME_EMAIL_ENABLED: true,
    TELEGRAM_ENABLED: false,
    WEBHOOK_ENABLED: false
  }
} as const;

export function getSiteBaseUrl(env: Env, customUrl?: string): string {
  if (customUrl) return customUrl.replace(/\/+$/, '');
  if (env.SITE_URL) return env.SITE_URL.replace(/\/+$/, '');

  switch (env.ENVIRONMENT) {
    case 'production':
      return CONFIG.SITES.PRODUCTION;
    case 'staging':
    case 'preview':
      return CONFIG.SITES.STAGING;
    default:
      return CONFIG.SITES.LOCAL;
  }
}

export function getExecutionLimits(_env?: Env) {
  return {
    maxSubrequests: CONFIG.LIMITS.MAX_SUBREQUESTS,
    maxD1BatchStatements: CONFIG.LIMITS.MAX_D1_BATCH_STATEMENTS,
    maxPayloadBytes: CONFIG.LIMITS.MAX_PAYLOAD_BYTES,
    retryBackoffMs: CONFIG.LIMITS.DEFAULT_RETRY_BACKOFF_MS,
    maxRetryAttempts: CONFIG.LIMITS.MAX_RETRY_ATTEMPTS
  };
}

export function getStorageConfig(env: Env) {
  const hasD1 = Boolean(env.DB);
  const hasKv = Boolean(env.KV_STATE);
  return {
    engine: hasD1 ? CONFIG.STORAGE.DEFAULT_ENGINE : CONFIG.STORAGE.FALLBACK_ENGINE,
    hasD1,
    hasKv,
    ttlSeconds: CONFIG.STORAGE.STATE_TTL_SECONDS
  };
}

export function getTelemetryConfig(env: Env) {
  return {
    environment: env.ENVIRONMENT || 'development',
    version: CONFIG.APP.VERSION,
    hasWebhook: Boolean(env.WEBHOOK_URL),
    hasTelegram: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
    hasResend: Boolean(env.RESEND_API_KEY)
  };
}
