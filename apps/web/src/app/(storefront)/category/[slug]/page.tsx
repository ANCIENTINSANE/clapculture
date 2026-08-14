import React from 'react';
import CategoryClient from './CategoryClient';
import { getServerCategories } from '@/lib/server-data';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getServerCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    const name = slug.charAt(0).toUpperCase() + slug.slice(1);
    return <CategoryClient category={{ id: slug, name, slug }} />;
  }

  return <CategoryClient category={category} />;
}
