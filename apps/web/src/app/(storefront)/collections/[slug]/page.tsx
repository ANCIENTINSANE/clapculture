import React from 'react';
import { MOCK_COLLECTIONS } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import CollectionClient from './CollectionClient';

export async function generateStaticParams() {
  return MOCK_COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = MOCK_COLLECTIONS.find((c) => c.slug === slug);

  if (!collection) {
    notFound();
  }

  return <CollectionClient collection={collection} />;
}
