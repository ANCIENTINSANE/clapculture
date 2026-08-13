import React from 'react';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find(p => p.slug === slug);
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: `${product.name} | CLAPCULTURE`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find(p => p.slug === slug);
  
  if (!product) {
    notFound();
  }

  // Get related products (mock logic)
  const relatedProducts = MOCK_PRODUCTS.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  // If not enough related, just add some
  if (relatedProducts.length < 4) {
    const extras = MOCK_PRODUCTS.filter(p => p.id !== product.id && !relatedProducts.find(r => r.id === p.id)).slice(0, 4 - relatedProducts.length);
    relatedProducts.push(...extras);
  }

  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}
