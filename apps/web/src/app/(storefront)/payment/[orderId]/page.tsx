import React from 'react';
import PaymentClient from './PaymentClient';

export async function generateStaticParams() {
  return [{ orderId: 'CLAP10245' }];
}

export default async function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <PaymentClient orderId={orderId} />;
}
