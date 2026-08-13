'use client';

import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useOrderStore } from '@/lib/store';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export default function OrderClient({ orderId }: { orderId: string }) {
  const { getOrder, currentOrder } = useOrderStore();
  const cleanId = orderId.replace('#', '');
  const storeOrder = getOrder(cleanId) || (currentOrder?.orderId === cleanId ? currentOrder : null);

  // Fallback dynamic items
  const items = storeOrder?.items || [
    { id: '1', productId: '1', name: MOCK_PRODUCTS[0].name, image: MOCK_PRODUCTS[0].images[0], size: 'L' as const, price: MOCK_PRODUCTS[0].price, quantity: 1 },
    { id: '2', productId: '2', name: MOCK_PRODUCTS[1].name, image: MOCK_PRODUCTS[1].images[0], size: 'M' as const, price: MOCK_PRODUCTS[1].price, quantity: 1 },
  ];

  const customer = storeOrder?.customer || {
    fullName: 'Customer',
    email: 'customer@example.com',
    phone: '+91 9876543210',
    address: 'Street address',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
  };

  const total = storeOrder?.total || 3498;
  const paymentStatus = storeOrder?.paymentStatus || 'SUBMITTED';

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto border border-[#262626] bg-[#141414] rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Printable CSS Optimization */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body { background: white !important; color: black !important; }
            .no-print { display: none !important; }
            .print-only-border { border: 1px solid #ddd !important; background: white !important; color: black !important; }
            .print-black-text { color: black !important; }
          }
        ` }} />

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-[#262626] no-print">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-headline-md tracking-wider">OFFICIAL RECEIPT</h1>
              {paymentStatus === 'VERIFIED' ? (
                <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  ✓ ORDER CONFIRMED & VERIFIED
                </span>
              ) : (
                <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  PAYMENT VERIFICATION PENDING
                </span>
              )}
            </div>
            <p className="text-xs text-[#a3a3a3] font-mono mt-1">ORDER ID: #{cleanId}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="bg-[#262626] hover:bg-[#333333] text-white font-label-caps px-4 py-2 rounded-lg text-xs uppercase font-bold transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              PRINT / DOWNLOAD RECEIPT (PDF)
            </button>
            <Link
              href={`/track-order?orderId=${cleanId}`}
              className="bg-electric-lime text-black hover:bg-white font-label-caps px-4 py-2 rounded-lg text-xs uppercase font-bold transition-all flex items-center gap-1.5"
            >
              TRACK ORDER
            </Link>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="space-y-8">
          <div className="flex justify-between items-start border-b border-[#262626] pb-6">
            <div>
              <h2 className="text-3xl font-headline-md text-electric-lime tracking-widest print-black-text">CLAPCULTURE</h2>
              <p className="text-xs text-[#737373] mt-1 font-mono">STREETWEAR FOR THE CULTURE</p>
            </div>
            <div className="text-right text-xs font-mono text-[#a3a3a3]">
              <p className="text-white font-bold print-black-text">CLAPCULTURE INC.</p>
              <p>TAX INVOICE / ORDER RECEIPT</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] print-only-border">
            <div>
              <span className="text-[10px] text-electric-lime font-mono uppercase font-bold tracking-wider">BILLED TO:</span>
              <p className="font-bold text-sm text-white mt-1 print-black-text">{customer.fullName}</p>
              <p className="text-xs text-[#a3a3a3]">{customer.address}, {customer.city}, {customer.state} - {customer.pincode}</p>
            </div>
            <div className="md:text-right">
              <span className="text-[10px] text-electric-lime font-mono uppercase font-bold tracking-wider">CONTACT:</span>
              <p className="text-xs text-white mt-1 print-black-text">{customer.email}</p>
              <p className="text-xs text-[#a3a3a3]">{customer.phone}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-[#262626] rounded-xl overflow-hidden print-only-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1a1a1a] text-[#737373] uppercase font-mono border-b border-[#262626]">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3">Size</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#1a1a1a]/50">
                    <td className="p-3 font-bold text-white print-black-text">{item.name}</td>
                    <td className="p-3 font-mono text-[#a3a3a3]">{item.size}</td>
                    <td className="p-3 text-center font-mono">{item.quantity}</td>
                    <td className="p-3 text-right font-mono font-bold text-white print-black-text">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Summary */}
          <div className="flex justify-between items-center pt-4 border-t border-[#262626]">
            <span className="text-xs text-[#737373] font-mono">ALL TAXES INCLUDED</span>
            <div className="text-right">
              <span className="text-xs text-[#a3a3a3] font-mono">TOTAL PAID:</span>
              <p className="text-3xl font-headline-md text-electric-lime print-black-text">{formatCurrency(total)}</p>
            </div>
          </div>

          {/* Developer Credit Footer */}
          <div className="text-center pt-6 border-t border-[#262626] text-[11px] font-label-caps text-[#737373]">
            Design and developed by <a href="https://vcard.stemlen.com/u/surendra" target="_blank" rel="noopener noreferrer" className="text-electric-lime font-bold hover:underline">surendra.codes</a>
          </div>
        </div>
      </div>
    </div>
  );
}
