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

    if (!refresh) {
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

    const payload = {
      products: productsRes.documents,
      categories: categoriesRes.documents,
      collections: collectionsRes.documents,
      homepage,
      buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'dev',
      cachedAt: new Date().toISOString(),
    };

    setCached(BOOTSTRAP_CACHE_KEY, payload, BOOTSTRAP_TTL);

    c.header('X-Cache', 'MISS');
    c.header('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    c.header('X-Build-Id', process.env.NEXT_PUBLIC_BUILD_ID || 'dev');
    return c.json({ success: true, data: payload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default bootstrap;
