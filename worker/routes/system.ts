import { Router } from './router';
import { CONFIG, getSiteBaseUrl, getStorageConfig, getTelemetryConfig } from '../config';
import { getStorage } from '../storage';

export const systemRouter = new Router();

systemRouter.get('/health', async (_req, ctx) => {
  const storageConfig = getStorageConfig(ctx.env);
  const telemetry = getTelemetryConfig(ctx.env);
  const storage = getStorage(ctx.env);
  const counts = await storage.subscribers.getCounts();

  return Response.json({
    success: true,
    data: {
      status: 'healthy',
      brand: CONFIG.APP.NAME,
      version: CONFIG.APP.VERSION,
      environment: telemetry.environment,
      siteUrl: getSiteBaseUrl(ctx.env),
      storage: {
        engine: storageConfig.engine,
        hasD1: storageConfig.hasD1,
        hasKv: storageConfig.hasKv
      },
      metrics: {
        subscribers: counts
      }
    },
    timestamp: new Date().toISOString()
  });
});

