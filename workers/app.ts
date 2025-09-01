import { createRequestHandler } from "react-router";
import { CONFIG } from "../site.config";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    // biome-ignore lint: (biome lint/suspicious/noExplicitAny)
    const cache = (caches as any).default;
    const cacheKey = new Request(request.url, request);

    let response = await cache.match(cacheKey);

    if (response) {
      const cacheTime = response.headers.get("cf-cache-time");
      if (cacheTime) {
        const now = Date.now();
        const cached = parseInt(cacheTime, 10);
        const maxAge = CONFIG.cache.maxAge;

        if (now - cached < maxAge) {
          return response;
        }
      }
    }

    response = await requestHandler(request, {
      cloudflare: { env, ctx },
    });

    if (request.method === "GET" && new URL(request.url).pathname === "/") {
      const responseToCache = response.clone();

      const headers = new Headers(responseToCache.headers);
      headers.set("cf-cache-time", Date.now().toString());
      const maxAgeSeconds = Math.floor(CONFIG.cache.maxAge / 1000);
      const staleWhileRevalidateSeconds = Math.floor(CONFIG.cache.staleWhileRevalidate / 1000);
      headers.set(
        "Cache-Control",
        `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`,
      );
      headers.set("CDN-Cache-Control", `public, max-age=${maxAgeSeconds * 2}`);

      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });

      ctx.waitUntil(cache.put(cacheKey, cachedResponse));
    }

    return response;
  },
} satisfies ExportedHandler<Env>;
