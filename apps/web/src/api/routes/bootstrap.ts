/**
 * /api/bootstrap — Single endpoint that bundles ALL storefront data.
 * 
 * Returns products, categories, collections, and homepage CMS in one response.
 * Server-side cached for 10 minutes. CDN-cacheable via Cache-Control headers.
 * This reduces Appwrite reads from ~8M/month to ~17K/month for 2M visitors.
 */
import { Hono } from 'hono';
import { Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { getCached, setCached } from '../lib/cache';

const bootstrap = new Hono();

const BOOTSTRAP_CACHE_KEY = 'bootstrap_all';
const BOOTSTRAP_TTL = 300; // 5 minutes server cache (busted instantly on mutations)

bootstrap.get('/', async (c) => {
  try {
    const refresh = c.req.query('refresh') === 'true';
    const cacheUrl = new URL(c.req.url);
    const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });

    let cfCache: Cache | undefined;
    if (!refresh) {
      // 1. Check Cloudflare Edge Cache
      try {
        if (typeof caches !== 'undefined' && (caches as unknown as Record<string, Cache>).default) {
          cfCache = (caches as unknown as Record<string, Cache>).default;
          const edgeCached = await cfCache.match(cacheKey);
          if (edgeCached) {
            const edgeClone = new Response(edgeCached.body, edgeCached);
            edgeClone.headers.set('X-Cache', 'CF-EDGE-HIT');
            return edgeClone;
          }
        }
      } catch {}

      // 2. Check In-Memory Isolate Cache
      const cached = getCached<Record<string, unknown>>(BOOTSTRAP_CACHE_KEY);
      if (cached) {
        c.header('X-Cache', 'HIT');
        c.header('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
        c.header('X-Build-Id', process.env.NEXT_PUBLIC_BUILD_ID || 'dev');
        return c.json({ success: true, data: cached });
      }
    }

    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);

    // Fetch all 4 collections in parallel — 4 Appwrite reads per cache miss
    const [productsRes, categoriesRes, collectionsRes, homepageDoc] = await Promise.all([
      databases.listDocuments(dbId, 'products', [Query.limit(100)]).catch(() => ({ documents: [] })),
      databases.listDocuments(dbId, 'categories').catch(() => ({ documents: [] })),
      databases.listDocuments(dbId, 'collections').catch(() => ({ documents: [] })),
      databases.getDocument(dbId, 'homepage_sections', 'homepage_config').catch(() => null),
    ]);

    // Parse homepage CMS content
    let homepage = null;
    if (homepageDoc && homepageDoc.content) {
      try {
        homepage = typeof homepageDoc.content === 'string'
          ? JSON.parse(homepageDoc.content)
          : homepageDoc.content;
      } catch {
        homepage = null;
      }
    }

    const isProductActive = (d: Record<string, unknown>) => {
      if (d.isActive === false) return false;
      if (Array.isArray(d.badges)) {
        if (d.badges.includes('HIDDEN') || d.badges.includes('DISABLED')) return false;
      }
      return true;
    };

    const payload = {
      products: productsRes.documents.filter(isProductActive),
      categories: categoriesRes.documents,
      collections: collectionsRes.documents,
      homepage,
      buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'dev',
      cachedAt: new Date().toISOString(),
    };

    setCached(BOOTSTRAP_CACHE_KEY, payload, BOOTSTRAP_TTL);

    const resHeaders = new Headers({
      'Content-Type': 'application/json',
      'X-Cache': 'MISS',
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
      'X-Build-Id': process.env.NEXT_PUBLIC_BUILD_ID || 'dev',
    });

    const response = new Response(JSON.stringify({ success: true, data: payload }), {
      status: 200,
      headers: resHeaders,
    });

    // Save to Cloudflare Edge Cache
    if (cfCache && !refresh) {
      try {
        c.executionCtx.waitUntil(cfCache.put(cacheKey, response.clone()));
      } catch {
        try {
          await cfCache.put(cacheKey, response.clone());
        } catch {}
      }
    }

    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default bootstrap;
