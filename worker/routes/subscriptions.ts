import { Router } from './router';
import { getStorage } from '../storage';

export const subscriptionsRouter = new Router();

// Newsletter / updates subscription
subscriptionsRouter.post('/newsletter', async (request, ctx) => {
  try {
    const { email, topics } = (await request.json()) as { email?: string; topics?: string[] };
    if (!email || !email.includes('@')) {
      return Response.json(
        { success: false, error: 'Valid email address required', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const storage = getStorage(ctx.env);
    await storage.subscribers.addEmail(email, topics);

    return Response.json(
      {
        success: true,
        data: { message: 'Subscribed to JJs Running updates' },
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Invalid subscription request';
    return Response.json({ success: false, error, timestamp: new Date().toISOString() }, { status: 400 });
  }
});

// Push notification subscription
subscriptionsRouter.post('/push', async (request, ctx) => {
  try {
    const body = (await request.json()) as {
      endpoint: string;
      keys?: { p256dh: string; auth: string };
      topics?: string[];
    };

    if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
      return Response.json(
        { success: false, error: 'Valid PushSubscription required', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const storage = getStorage(ctx.env);
    await storage.subscribers.upsertPushToken({
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
      topics: body.topics
    });

    return Response.json(
      {
        success: true,
        data: { message: 'Push subscription registered' },
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Invalid push token';
    return Response.json({ success: false, error, timestamp: new Date().toISOString() }, { status: 400 });
  }
});

