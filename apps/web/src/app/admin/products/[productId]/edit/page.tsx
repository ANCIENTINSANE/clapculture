import React from 'react';
import EditProductClient from './EditProductClient';

export function generateStaticParams() {
  return [{ productId: '1' }];
}

export default async function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  return <EditProductClient productId={productId} />;
}