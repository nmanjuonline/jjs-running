import { Router } from './routes/router';
import { registrationsRouter } from './routes/registrations';
import { subscriptionsRouter } from './routes/subscriptions';
import { systemRouter } from './routes/system';
import type { Env } from './types';

const appRouter = new Router();

// Mount discrete domain sub-routers
appRouter.mount('/api/registrations', registrationsRouter);
appRouter.mount('/api', registrationsRouter); // Serves /api/leads
appRouter.mount('/api/subscriptions', subscriptionsRouter);
appRouter.mount('/api/system', systemRouter);
appRouter.mount('/api', systemRouter); // Serves /api/health

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Dispatch API routes through Edge Router
    if (url.pathname.startsWith('/api')) {
      return appRouter.handle(request, env);
    }

    // Delegate static assets and SPA routes to Cloudflare Assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('JJs Running Edge Platform', { status: 200 });
  }
};

