/**
 * useApiData — a custom hook for fetching data from internal API routes.
 * Provides client-side SWR-like caching so components don't refetch needlessly.
 * All storefront pages use this hook to replace mock-data imports.
 */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Product, Collection, Category } from '@clapculture/shared';

// ─── Client-side in-memory cache ─────────────────────────────────────
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const clientCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = clientCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    clientCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  clientCache.set(key, { data, timestamp: Date.now() });
}

// ─── Generic fetch hook ──────────────────────────────────────────────
function useApiData<T>(endpoint: string, fallback: T): { data: T; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<T>(() => {
    const cached = getCached<T>(endpoint);
    return cached ?? fallback;
  });
  const [loading, setLoading] = useState(() => !getCached(endpoint));
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
        setCache(endpoint, json.data);
        setError(null);
      } else if (json.error) {
        throw new Error(json.error);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Fetch failed';
      setError(msg);
      // Keep existing data (cached or fallback) on error
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const cached = getCached<T>(endpoint);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }
    fetchData();
  }, [endpoint, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ─── Typed data hooks ────────────────────────────────────────────────

export function useProducts() {
  const result = useApiData<Product[]>('/api/products?limit=100', []);
  const normalized = (result.data || []).map((p: Product, idx: number) => {
    const raw = p as unknown as Record<string, unknown>;
    return {
      ...p,
      id: String(raw.id || raw.$id || raw.slug || `prod-${idx}`),
      sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L', 'XL', 'XXL'],
      images: Array.isArray(p.images) ? p.images : [],
      badges: Array.isArray(p.badges) ? p.badges : [],
    } as Product;
  });

  return {
    ...result,
    data: normalized,
  };
}

export function useProduct(slug: string) {
  const result = useApiData<Product | null>(`/api/products/${slug}`, null);
  const p = result.data;
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

  return {
    ...result,
    data: normalized,
  };
}

export function useCollections() {
  const result = useApiData<Collection[]>('/api/collections', []);
  const normalized = (result.data || []).map((c: Collection, idx: number) => {
    const raw = c as unknown as Record<string, unknown>;
    return {
      ...c,
      id: String(raw.id || raw.$id || raw.slug || `col-${idx}`),
      productIds: Array.isArray(c.productIds) ? c.productIds : [],
    } as Collection;
  });

  return {
    ...result,
    data: normalized,
  };
}

export function useCategories() {
  const result = useApiData<Category[]>('/api/categories', []);
  const normalized = (result.data || []).map((c: Category, idx: number) => {
    const raw = c as unknown as Record<string, unknown>;
    return {
      ...c,
      id: String(raw.id || raw.$id || raw.slug || `cat-${idx}`),
    } as Category;
  });

  return {
    ...result,
    data: normalized,
  };
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
  'pawan-kalyan': { title: 'POWER STAR COLLECTION', tagline: 'SENANI & OG ERA FITS', image: '/pawankalyan.jpeg' },
  'mahesh-babu': { title: 'MAHESH BABU COLLECTION', tagline: 'SUPERSTAR & POKIRI EDITIONS', image: '/mahesh-babu.jpeg' },
  'prabhas': { title: 'PRABHAS COLLECTION', tagline: 'REBEL STAR & RAJA SAAB DROPS', image: '/prabhas.jpeg' },
  'allu-arjun': { title: 'ALLU ARJUN COLLECTION', tagline: 'ICON STAR & PUSHPA 2 EDITION', image: '/allu-arjun.jpeg' },
  'ram-charan': { title: 'RAM CHARAN COLLECTION', tagline: 'GLOBAL STAR GAME CHANGER', image: '/ramcharan.jpeg' },
  'ntr': { title: 'JR NTR COLLECTION', tagline: 'MAN OF MASSES DEVARA', image: '/ntr.jpeg' },
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
      image: meta?.image || '/herobg1-desktop.png',
      count: `${productCount} DROPS`,
    };
  });

  return stars;
}

export { useApiData };
