import React from 'react';
import OrderClient from './OrderClient';

export async function generateStaticParams() {
  return [{ orderId: 'CLAP10245' }];
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <OrderClient orderId={orderId} />;
}
