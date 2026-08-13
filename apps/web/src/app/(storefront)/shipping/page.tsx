import React from 'react';

export const metadata = { title: 'Shipping Policy | CLAPCULTURE' };

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white pt-32 pb-24 px-4 md:px-8 max-w-3xl mx-auto">
      <h1 className="font-headline-xl text-5xl md:text-7xl uppercase mb-12 text-center">SHIPPING POLICY</h1>
      
      <div className="space-y-8 font-body-sm text-gray-300 leading-relaxed">
        <section>
          <h2 className="font-headline-md text-2xl uppercase mb-4 text-white">PROCESSING TIME</h2>
          <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
        </section>

        <section>
          <h2 className="font-headline-md text-2xl uppercase mb-4 text-white">DOMESTIC SHIPPING RATES</h2>
          <p className="mb-4">We offer flat rate shipping across India:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders below ₹999: ₹49 Flat Rate Shipping</li>
            <li>Orders ₹999 and above: Free Shipping</li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline-md text-2xl uppercase mb-4 text-white">DELIVERY ESTIMATES</h2>
          <p>Standard delivery typically takes 3-5 business days. Remote locations may take up to 7 business days.</p>
        </section>
      </div>
    </div>
  );
}
