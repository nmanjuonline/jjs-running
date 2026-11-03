import type { Env } from '../types';
import { CONFIG } from '../config';

export interface AlertPayload {
  title: string;
  message: string;
  details?: Record<string, unknown>;
  severity?: 'info' | 'warning' | 'critical';
  clientIp?: string;
  country?: string;
  userAgent?: string;
}

export interface NotificationTransport {
  id: string;
  send(payload: AlertPayload, env: Env): Promise<boolean>;
}

export class WebhookTransport implements NotificationTransport {
  id = 'webhook';

  async send(payload: AlertPayload, env: Env): Promise<boolean> {
    if (!env.WEBHOOK_URL) return false;
    try {
      const res = await fetch(env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: CONFIG.APP.NAME,
          title: payload.title,
          message: payload.message,
          severity: payload.severity || 'info',
          client: {
            ip: payload.clientIp,
            country: payload.country,
            agent: payload.userAgent
          },
          details: payload.details,
          timestamp: new Date().toISOString()
        })
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export class TelegramTransport implements NotificationTransport {
  id = 'telegram';

  async send(payload: AlertPayload, env: Env): Promise<boolean> {
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false;
    const emoji = payload.severity === 'critical' ? '🚨' : payload.severity === 'warning' ? '⚠️' : '🏃';
    const text = `${emoji} *[${CONFIG.APP.SHORT_NAME}] ${payload.title}*\n\n${payload.message}\n` +
      (payload.clientIp ? `📍 IP: \`${payload.clientIp}\` (${payload.country || 'Unknown'})\n` : '') +
      (payload.details ? `\n\`\`\`json\n${JSON.stringify(payload.details, null, 2)}\n\`\`\`` : '');

    try {
      const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'Markdown'
        })
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export class NotificationBroadcaster {
  private transports: NotificationTransport[] = [
    new WebhookTransport(),
    new TelegramTransport()
  ];

  registerTransport(transport: NotificationTransport) {
    this.transports.push(transport);
  }

  async broadcast(payload: AlertPayload, env: Env): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    await Promise.all(
      this.transports.map(async (t) => {
        try {
          results[t.id] = await t.send(payload, env);
        } catch {
          results[t.id] = false;
        }
      })
    );

    return results;
  }
}

export const broadcaster = new NotificationBroadcaster();

