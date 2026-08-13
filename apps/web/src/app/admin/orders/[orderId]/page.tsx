import React from 'react';
import AdminOrderClient from './AdminOrderClient';

export function generateStaticParams() {
  return [{ orderId: 'CLAP10245' }];
}

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <AdminOrderClient orderId={orderId} />;
}
