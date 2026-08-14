import React from 'react';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';
import { getServerProductBySlug, getServerProducts } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getServerProductBySlug(slug);
  if (!product) return { title: 'Product Not Found | CLAPCULTURE' };
  
  return {
    title: `${product.name} | CLAPCULTURE`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getServerProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  // Get related products from DB
  const allProducts = await getServerProducts(20);
  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);
  
  if (relatedProducts.length < 4) {
    const extras = allProducts
      .filter((p) => p.id !== product.id && !relatedProducts.find((r) => r.id === p.id))
      .slice(0, 4 - relatedProducts.length);
    relatedProducts.push(...extras);
  }

  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}
