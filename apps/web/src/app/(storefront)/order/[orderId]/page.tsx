'use client';

import React, { use } from 'react';

import Link from 'next/link';

import { formatCurrency } from '@/lib/utils';
import { useOrderStore } from '@/lib/store';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export default function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
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
    address: 'Banjara Hills, Road No. 12',
    apartment: 'Apt 402',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
  };

  const subtotal = storeOrder?.subtotal || items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = storeOrder?.shipping ?? (subtotal >= 999 ? 0 : 49);
  const total = storeOrder?.total || subtotal + shipping;
  const paymentStatus = storeOrder?.paymentStatus || 'SUBMITTED';
  const orderStatus = storeOrder?.orderStatus || 'PLACED';

  const isVerified = paymentStatus === 'VERIFIED' || orderStatus === 'CONFIRMED' || orderStatus === 'SHIPPED' || orderStatus === 'DELIVERED';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-deep-black text-white pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto printable-receipt">
      
      {/* Top Bar with Status Badge & Print CTA */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-charcoal pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-4xl md:text-5xl uppercase">INVOICE #{cleanId}</h1>
            {isVerified ? (
              <span className="bg-electric-lime text-black font-bold text-xs px-3 py-1 uppercase rounded tracking-wider">
                ✓ CONFIRMED
              </span>
            ) : (
              <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-bold text-xs px-3 py-1 uppercase rounded tracking-wider">
                ⏳ VERIFICATION PENDING
              </span>
            )}
          </div>
          <p className="text-gray-400 font-mono text-xs mt-1">Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button 
            onClick={handlePrint}
            className="bg-white text-black font-bold text-xs px-4 py-3 rounded flex items-center gap-2 hover:bg-electric-lime transition-colors uppercase"
          >
            <span className="material-symbols-outlined text-base">print</span>
            PRINT / DOWNLOAD RECEIPT (PDF)
          </button>
          
          <Link 
            href={`/track-order?orderId=${cleanId}&email=${encodeURIComponent(customer.email)}`}
            className="bg-electric-lime text-black font-bold text-xs px-4 py-3 rounded hover:bg-white transition-colors uppercase"
          >
            LIVE TRACKING
          </Link>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div className="mb-8 no-print">
        {isVerified ? (
          <div className="bg-electric-lime/10 border border-electric-lime/40 p-4 rounded-lg flex items-center gap-4 text-electric-lime text-sm">
            <span className="material-symbols-outlined text-2xl">verified</span>
            <div>
              <p className="font-bold uppercase tracking-wider">ORDER CONFIRMED & PAYMENT VERIFIED</p>
              <p className="text-xs text-gray-300">Your order has been officially verified and queued for express dispatch.</p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg flex items-center gap-4 text-yellow-400 text-sm">
            <span className="material-symbols-outlined text-2xl">hourglass_top</span>
            <div>
              <p className="font-bold uppercase tracking-wider">PAYMENT VERIFICATION PENDING</p>
              <p className="text-xs text-gray-300">Our accounts team is reviewing your UPI transaction screenshot. Once confirmed, your official tax receipt stamp will update automatically.</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Receipt Sheet */}
      <div className="bg-charcoal p-8 border border-gray-800 rounded-xl shadow-2xl space-y-8 print:bg-white print:text-black print:p-0 print:border-0">
        
        {/* Receipt Header */}
        <div className="flex justify-between items-start border-b border-gray-800 print:border-black pb-6">
          <div>
            <h2 className="font-headline-md text-3xl text-white print:text-black uppercase tracking-wider">CLAPCULTURE</h2>
            <p className="text-xs text-gray-400 print:text-gray-700 mt-1">Official E-Commerce Receipt & Tax Invoice</p>
            <p className="text-xs text-gray-500 print:text-gray-700 font-mono">GSTIN: 36AAAAA0000A1Z5</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm text-electric-lime print:text-black font-bold">#{cleanId}</p>
            <p className="text-xs text-gray-400 print:text-gray-700 mt-1">Status: {isVerified ? 'ORDER CONFIRMED' : 'VERIFICATION PENDING'}</p>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
          <div className="bg-[#141414] print:bg-gray-100 p-4 rounded border border-gray-800 print:border-gray-300 text-xs space-y-1">
            <p className="font-label-caps text-electric-lime print:text-black font-bold tracking-widest mb-2">BILLED & SHIPPED TO</p>
            <p className="font-bold text-white print:text-black text-sm">{customer.fullName}</p>
            <p className="text-gray-300 print:text-gray-800">{customer.address}{customer.apartment ? `, ${customer.apartment}` : ''}</p>
            <p className="text-gray-300 print:text-gray-800">{customer.city}, {customer.state} - {customer.pincode}</p>
            <p className="text-gray-400 print:text-gray-600 font-mono mt-2">Ph: {customer.phone}</p>
            <p className="text-gray-400 print:text-gray-600 font-mono">Email: {customer.email}</p>
          </div>

          <div className="bg-[#141414] print:bg-gray-100 p-4 rounded border border-gray-800 print:border-gray-300 text-xs space-y-1">
            <p className="font-label-caps text-electric-lime print:text-black font-bold tracking-widest mb-2">PAYMENT & METHOD</p>
            <p className="text-gray-300 print:text-gray-800"><span className="text-gray-500">Method:</span> UPI / QR Payment</p>
            <p className="text-gray-300 print:text-gray-800">
              <span className="text-gray-500">Status:</span>{' '}
              <span className={`font-bold ${isVerified ? 'text-electric-lime print:text-black' : 'text-yellow-400 print:text-black'}`}>
                {isVerified ? 'VERIFIED & RECEIVED' : 'SUBMITTED (VERIFICATION PENDING)'}
              </span>
            </p>
            {storeOrder?.transactionId && (
              <p className="text-gray-300 print:text-gray-800 font-mono"><span className="text-gray-500">UTR Ref:</span> {storeOrder.transactionId}</p>
            )}
          </div>
        </div>

        {/* Ordered Items Table */}
        <div>
          <h3 className="font-headline-md text-lg text-white print:text-black uppercase mb-4">ORDER ITEMS</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-800 print:border-black text-electric-lime print:text-black font-label-caps">
                  <th className="py-3 px-2">ITEM DESCRIPTION</th>
                  <th className="py-3 px-2 text-center">SIZE</th>
                  <th className="py-3 px-2 text-center">QTY</th>
                  <th className="py-3 px-2 text-right">UNIT PRICE</th>
                  <th className="py-3 px-2 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 print:divide-gray-300 text-gray-300 print:text-black">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-2 font-bold text-white print:text-black uppercase">{item.name}</td>
                    <td className="py-3 px-2 text-center font-mono">{item.size}</td>
                    <td className="py-3 px-2 text-center">{item.quantity}</td>
                    <td className="py-3 px-2 text-right font-mono">{formatCurrency(item.price)}</td>
                    <td className="py-3 px-2 text-right font-mono font-bold">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Breakdown & Total */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-t border-gray-800 print:border-black pt-6 gap-6">
          <div className="text-xs text-gray-500 print:text-gray-700 space-y-1">
            <p>• All prices include applicable GST taxes.</p>
            <p>• Returns & exchanges valid within 7 days of delivery.</p>
            <p className="pt-2 font-mono">Designed & Developed by <a href="https://vcard.stemlen.com/u/surendra" target="_blank" className="text-electric-lime print:text-black font-bold">surendra.codes</a></p>
          </div>

          <div className="w-full md:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-gray-400 print:text-gray-800">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-400 print:text-gray-800">
              <span>Shipping Fee</span>
              <span className="font-mono">{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between text-white print:text-black font-bold text-base border-t border-gray-800 print:border-black pt-2">
              <span>TOTAL PAID</span>
              <span className="font-mono text-electric-lime print:text-black">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Print-Specific Styles */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          nav, footer, .no-print {
            display: none !important;
          }
          .printable-receipt {
            padding-top: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
