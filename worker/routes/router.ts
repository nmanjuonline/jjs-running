import type { Env } from '../types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export interface RouteContext {
  params: Record<string, string>;
  url: URL;
  env: Env;
  clientIp?: string;
  country?: string;
}

export type RouteHandler = (
  request: Request,
  ctx: RouteContext
) => Promise<Response> | Response;

interface RouteDefinition {
  method: HttpMethod;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

export class Router {
  private routes: RouteDefinition[] = [];
  private subRouters: { prefix: string; router: Router }[] = [];

  private add(method: HttpMethod, path: string, handler: RouteHandler) {
    const paramNames: string[] = [];
    // Convert /api/items/:id to regex and capture param names
    const regexPath = path
      .replace(/\/+$/, '')
      .replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
      });

    const pattern = new RegExp(`^${regexPath || '/'}/?$`);
    this.routes.push({ method, pattern, paramNames, handler });
  }

  get(path: string, handler: RouteHandler) {
    this.add('GET', path, handler);
  }

  post(path: string, handler: RouteHandler) {
    this.add('POST', path, handler);
  }

  put(path: string, handler: RouteHandler) {
    this.add('PUT', path, handler);
  }

  delete(path: string, handler: RouteHandler) {
    this.add('DELETE', path, handler);
  }

  options(path: string, handler: RouteHandler) {
    this.add('OPTIONS', path, handler);
  }

  mount(prefix: string, subRouter: Router) {
    this.subRouters.push({
      prefix: prefix.replace(/\/+$/, ''),
      router: subRouter
    });
  }

  async handle(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method as HttpMethod;

    // Standard CORS preflight handler
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // Check mounted sub-routers
    for (const { prefix, router } of this.subRouters) {
      if (pathname.startsWith(prefix)) {
        // Strip prefix for sub-router matching
        const subPath = pathname.slice(prefix.length) || '/';
        const subUrl = new URL(url.toString());
        subUrl.pathname = subPath;

        const subRequest = new Request(subUrl.toString(), request);
        const response = await router.handle(subRequest, env);
        if (response.status !== 404) {
          return withCors(response);
        }
      }
    }

    // Context metadata
    const clientIp = request.headers.get('cf-connecting-ip') || undefined;
    const country = request.headers.get('cf-ipcountry') || undefined;

    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = pathname.match(route.pattern);
      if (match) {
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, i) => {
          params[name] = decodeURIComponent(match[i + 1]);
        });

        try {
          const res = await route.handler(request, {
            params,
            url,
            env,
            clientIp,
            country
          });
          return withCors(res);
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
          return withCors(
            Response.json(
              {
                success: false,
                error: errorMessage,
                timestamp: new Date().toISOString()
              },
              { status: 500 }
            )
          );
        }
      }
    }

    return withCors(
      Response.json(
        {
          success: false,
          error: 'Route not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      )
    );
  }
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

