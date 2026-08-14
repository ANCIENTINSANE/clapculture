/**
 * Server-side Direct Database Data Fetchers
 * Used by Server Components (e.g. product/[slug], collections/[slug], category/[slug])
 * directly querying Appwrite with server memory cache to eliminate self-HTTP loops during build.
 */
import { Query } from 'node-appwrite';
import { getAppwriteClient } from '@/api/lib/appwrite';
import { getCached, setCached } from '@/api/lib/cache';
import { Product, Collection, Category } from '@clapculture/shared';

const DB_ID = process.env.APPWRITE_DATABASE_ID || 'clapculture_db';

export async function getServerProducts(limit = 100): Promise<Product[]> {
  const cacheKey = `server_products_${limit}`;
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    const { databases } = getAppwriteClient();
    const res = await databases.listDocuments(DB_ID, 'products', [Query.limit(limit)]);
    const products = res.documents.map((d) => ({
      ...d,
      id: d.$id || d.id,
    })) as unknown as Product[];
    setCached(cacheKey, products, 120);
    return products;
  } catch (e) {
    console.log('getServerProducts error:', (e as Error).message);
    return [];
  }
}

export async function getServerProductBySlug(slugOrId: string): Promise<Product | null> {
  const cacheKey = `server_product_${slugOrId}`;
  const cached = getCached<Product | null>(cacheKey);
  if (cached !== null && cached !== undefined) return cached;

  try {
    const { databases } = getAppwriteClient();
    
    // 1. Try by document ID first
    try {
      const doc = await databases.getDocument(DB_ID, 'products', slugOrId);
      if (doc) {
        const product = {
          ...doc,
          id: doc.$id || doc.id,
        } as unknown as Product;
        setCached(cacheKey, product, 120);
        return product;
      }
    } catch {
      // Continue to slug lookup
    }

    // 2. Query by slug
    const res = await databases.listDocuments(DB_ID, 'products', [
      Query.equal('slug', slugOrId),
      Query.limit(1),
    ]);
    if (res.documents.length === 0) return null;
    const doc = res.documents[0];
    const product = {
      ...doc,
      id: doc.$id || doc.id,
    } as unknown as Product;
    setCached(cacheKey, product, 120);
    return product;
  } catch (e) {
    console.log('getServerProductBySlug error:', (e as Error).message);
    return null;
  }
}

export async function getServerCollections(): Promise<Collection[]> {
  const cacheKey = 'server_collections_all';
  const cached = getCached<Collection[]>(cacheKey);
  if (cached) return cached;

  try {
    const { databases } = getAppwriteClient();
    const res = await databases.listDocuments(DB_ID, 'collections', [Query.limit(100)]);
    const collections = res.documents.map((d) => ({
      ...d,
      id: d.$id || d.id,
    })) as unknown as Collection[];
    setCached(cacheKey, collections, 120);
    return collections;
  } catch (e) {
    console.log('getServerCollections error:', (e as Error).message);
    return [];
  }
}

export async function getServerCollectionBySlug(slug: string): Promise<Collection | null> {
  const cacheKey = `server_collection_${slug}`;
  const cached = getCached<Collection | null>(cacheKey);
  if (cached !== null && cached !== undefined) return cached;

  try {
    const { databases } = getAppwriteClient();
    const res = await databases.listDocuments(DB_ID, 'collections', [
      Query.equal('slug', slug),
      Query.limit(1),
    ]);
    if (res.documents.length === 0) return null;
    const doc = res.documents[0];
    const collection = {
      ...doc,
      id: doc.$id || doc.id,
    } as unknown as Collection;
    setCached(cacheKey, collection, 120);
    return collection;
  } catch (e) {
    console.log('getServerCollectionBySlug error:', (e as Error).message);
    return null;
  }
}

export async function getServerCategories(): Promise<Category[]> {
  const cacheKey = 'server_categories_all';
  const cached = getCached<Category[]>(cacheKey);
  if (cached) return cached;

  try {
    const { databases } = getAppwriteClient();
    const res = await databases.listDocuments(DB_ID, 'categories', [Query.limit(100)]);
    const categories = res.documents.map((d) => ({
      ...d,
      id: d.$id || d.id,
    })) as unknown as Category[];
    setCached(cacheKey, categories, 120);
    return categories;
  } catch (e) {
    console.log('getServerCategories error:', (e as Error).message);
    return [];
  }
}
