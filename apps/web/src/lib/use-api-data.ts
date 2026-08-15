/**
 * useApiData — Bootstrap-powered data hooks for the storefront.
 * 
 * Instead of 4 separate API calls per page load, everything comes from
 * a single /api/bootstrap call. Data is cached in localStorage with a
 * build-hash stamp so deploys automatically bust stale mobile caches.
 * 
 * For 2M monthly visitors on Appwrite free tier:
 *   - Server cache (10 min) → ~576 Appwrite reads/day
 *   - CDN cache (Cloudflare) → most requests never hit the API
 *   - localStorage (30 min + build hash) → repeat visitors hit zero APIs
 */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Product, Collection, Category } from '@clapculture/shared';

// ─── Build-version cache busting ─────────────────────────────────────
const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || 'dev';
const STORAGE_KEY = `cc_bootstrap`;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes client-side

interface BootstrapData {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  homepage: Record<string, unknown> | null;
  buildId: string;
  cachedAt: string;
}

interface CachedBootstrap {
  data: BootstrapData;
  storedAt: number;
  buildId: string;
}

// ─── Module-level singleton ──────────────────────────────────────────
// This ensures all hooks share the same data and only one fetch happens.
let bootstrapPromise: Promise<BootstrapData | null> | null = null;
let bootstrapData: BootstrapData | null = null;
let bootstrapListeners: Array<() => void> = [];

function notifyListeners() {
  bootstrapListeners.forEach(fn => fn());
}

function getLocalCache(): BootstrapData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cached: CachedBootstrap = JSON.parse(raw);
    
    // Build mismatch → stale from a previous deploy
    if (cached.buildId !== BUILD_ID) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    // TTL expired
    if (Date.now() - cached.storedAt > CACHE_TTL) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    return cached.data;
  } catch {
    return null;
  }
}

function setLocalCache(data: BootstrapData): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CachedBootstrap = {
      data,
      storedAt: Date.now(),
      buildId: BUILD_ID,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — that's fine, we still have in-memory
  }
}

async function fetchBootstrap(): Promise<BootstrapData | null> {
  try {
    const res = await fetch('/api/bootstrap');
    if (!res.ok) throw new Error(`Bootstrap API ${res.status}`);
    const json = await res.json();
    if (json.success && json.data) {
      return json.data as BootstrapData;
    }
    return null;
  } catch (err) {
    console.error('Bootstrap fetch failed:', err);
    return null;
  }
}

function ensureBootstrap(): Promise<BootstrapData | null> {
  // Already loaded in memory for this session
  if (bootstrapData) return Promise.resolve(bootstrapData);
  
  // Already fetching — deduplicate
  if (bootstrapPromise) return bootstrapPromise;
  
  // Check localStorage first
  const cached = getLocalCache();
  if (cached) {
    bootstrapData = cached;
    notifyListeners();
    return Promise.resolve(cached);
  }
  
  // Fetch fresh
  bootstrapPromise = fetchBootstrap().then(data => {
    if (data) {
      bootstrapData = data;
      setLocalCache(data);
      notifyListeners();
    }
    bootstrapPromise = null;
    return data;
  });
  
  return bootstrapPromise;
}

// ─── React hook ──────────────────────────────────────────────────────
function useBootstrap(): { data: BootstrapData | null; loading: boolean; refetch: () => void } {
  const [data, setData] = useState<BootstrapData | null>(() => bootstrapData || getLocalCache());
  const [loading, setLoading] = useState(!data);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const listener = () => {
      if (mountedRef.current && bootstrapData) {
        setData(bootstrapData);
        setLoading(false);
      }
    };
    bootstrapListeners.push(listener);

    if (!bootstrapData) {
      ensureBootstrap().then(() => {
        if (mountedRef.current) {
          setData(bootstrapData);
          setLoading(false);
        }
      });
    }

    return () => {
      mountedRef.current = false;
      bootstrapListeners = bootstrapListeners.filter(fn => fn !== listener);
    };
  }, []);

  const refetch = useCallback(() => {
    bootstrapData = null;
    bootstrapPromise = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(true);
    ensureBootstrap().then(() => {
      if (mountedRef.current) {
        setData(bootstrapData);
        setLoading(false);
      }
    });
  }, []);

  return { data, loading, refetch };
}

// ─── Typed data hooks (same API surface as before) ───────────────────

export function useProducts() {
  const { data: boot, loading, refetch } = useBootstrap();
  const products = boot?.products || [];

  const normalized = products.map((p: Product, idx: number) => {
    const raw = p as unknown as Record<string, unknown>;
    return {
      ...p,
      id: String(raw.id || raw.$id || raw.slug || `prod-${idx}`),
      sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L', 'XL', 'XXL'],
      images: Array.isArray(p.images) ? p.images : [],
      badges: Array.isArray(p.badges) ? p.badges : [],
    } as Product;
  });

  return { data: normalized, loading, error: null, refetch };
}

export function useProduct(slug: string) {
  const { data: boot, loading, refetch } = useBootstrap();
  const products = boot?.products || [];

  const p = products.find((prod: Product) => {
    const raw = prod as unknown as Record<string, unknown>;
    return prod.slug === slug || raw.$id === slug;
  }) || null;

  const raw = p as unknown as Record<string, unknown> | null;
  const normalized = p && raw
    ? ({
        ...p,
        id: String(raw.id || raw.$id || raw.slug || slug),
        sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L', 'XL', 'XXL'],
        images: Array.isArray(p.images) ? p.images : [],
        badges: Array.isArray(p.badges) ? p.badges : [],
      } as Product)
    : null;

  return { data: normalized, loading, error: null, refetch };
}

export function useCollections() {
  const { data: boot, loading, refetch } = useBootstrap();
  const collections = boot?.collections || [];

  const normalized = collections.map((c: Collection, idx: number) => {
    const raw = c as unknown as Record<string, unknown>;
    return {
      ...c,
      id: String(raw.id || raw.$id || raw.slug || `col-${idx}`),
      productIds: Array.isArray(c.productIds) ? c.productIds : [],
    } as Collection;
  });

  return { data: normalized, loading, error: null, refetch };
}

export function useCategories() {
  const { data: boot, loading, refetch } = useBootstrap();
  const categories = boot?.categories || [];

  const normalized = categories.map((c: Category, idx: number) => {
    const raw = c as unknown as Record<string, unknown>;
    return {
      ...c,
      id: String(raw.id || raw.$id || raw.slug || `cat-${idx}`),
    } as Category;
  });

  return { data: normalized, loading, error: null, refetch };
}

// Star collections derived from collections data
export interface StarCollection {
  name: string;
  slug: string;
  title: string;
  tagline: string;
  image: string;
  count: string;
}

const STAR_SLUGS = ['pawan-kalyan', 'mahesh-babu', 'prabhas', 'allu-arjun', 'ram-charan', 'ntr'];

const STAR_META: Record<string, { title: string; tagline: string; image: string }> = {
  'pawan-kalyan': { title: 'POWER STAR COLLECTION', tagline: 'SENANI & OG ERA FITS', image: '6a7fa5f80010fcd2bc85' },
  'mahesh-babu': { title: 'MAHESH BABU COLLECTION', tagline: 'SUPERSTAR & POKIRI EDITIONS', image: '6a7fa5f700082ba1bbc3' },
  'prabhas': { title: 'PRABHAS COLLECTION', tagline: 'REBEL STAR & RAJA SAAB DROPS', image: '6a7fa5fb001234ea8799' },
  'allu-arjun': { title: 'ALLU ARJUN COLLECTION', tagline: 'ICON STAR & PUSHPA 2 EDITION', image: '6a7fa5f5002dd6861328' },
  'ram-charan': { title: 'RAM CHARAN COLLECTION', tagline: 'GLOBAL STAR GAME CHANGER', image: '6a7fa5ff00162b33637d' },
  'ntr': { title: 'JR NTR COLLECTION', tagline: 'MAN OF MASSES DEVARA', image: '6a7fa6010011985f8642' },
};

export function useStarCollections(): StarCollection[] {
  const { data: collections } = useCollections();

  const stars: StarCollection[] = STAR_SLUGS.map((slug) => {
    const col = collections.find((c: Collection) => c.slug === slug);
    const meta = STAR_META[slug];
    const name = col?.name?.replace(' Collection', '') || meta?.title?.split(' ').slice(0, -1).join(' ') || slug;
    const productCount = col?.productIds?.length || 0;
    return {
      name,
      slug,
      title: meta?.title || `${name} COLLECTION`,
      tagline: meta?.tagline || '',
      image: meta?.image || '6a7fa922002c9b023447',
      count: `${productCount} DROPS`,
    };
  });

  return stars;
}

// ─── Bootstrap homepage data accessor (for cms-store) ────────────────
export function getBootstrapHomepage(): Record<string, unknown> | null {
  if (bootstrapData?.homepage) return bootstrapData.homepage;
  const cached = getLocalCache();
  return cached?.homepage || null;
}

// Re-export for backward compat
function useApiData<T>(endpoint: string, fallback: T): { data: T; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setError(null);
      } else if (json.error) {
        throw new Error(json.error);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Fetch failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchData();
  }, [endpoint, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export { useApiData };
