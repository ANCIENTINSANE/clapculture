import React from 'react';
import PaymentClient from './PaymentClient';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <PaymentClient orderId={orderId} />;
}
