import React from 'react';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import CategoryClient from './CategoryClient';

export async function generateStaticParams() {
  return MOCK_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  return <CategoryClient category={category} />;
}
