'use client';

import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useOrderStore, OrderData, CheckoutInfo } from '@/lib/store';

export default function OrderClient({ orderId }: { orderId: string }) {
  const { getOrder, currentOrder, checkoutInfo } = useOrderStore();
  const cleanId = orderId.replace('#', '');
  const localOrder = getOrder(cleanId) || (currentOrder?.orderId === cleanId ? currentOrder : null);

  const [dbOrder, setDbOrder] = React.useState<OrderData | null>(null);
  const [accessDenied, setAccessDenied] = React.useState(false);

  React.useEffect(() => {
    async function loadDbOrder() {
      try {
        // Pass contact info for user-scoped access verification
        const contact = localOrder?.customer?.email || checkoutInfo?.email || '';
        const url = contact
          ? `/api/orders/${cleanId}?contact=${encodeURIComponent(contact)}`
          : `/api/orders/${cleanId}`;
        const res = await fetch(url);
        if (res.status === 403) {
          setAccessDenied(true);
          return;
        }
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const doc = json.data;
            let parsedCustomer = doc.customer;
            if (typeof doc.customer === 'string') {
              try { parsedCustomer = JSON.parse(doc.customer); } catch {}
            }
            let parsedItems = doc.items;
            if (typeof doc.items === 'string') {
              try { parsedItems = JSON.parse(doc.items); } catch {}
            }

            setDbOrder({
              ...doc,
              customer: parsedCustomer,
              items: parsedItems,
            });
          }
        }
      } catch (e) {
        console.error('Failed to fetch DB order:', e);
      }
    }
    loadDbOrder();
  }, [cleanId, localOrder?.customer?.email, checkoutInfo?.email]);

  const activeOrder = dbOrder || localOrder;
  const items = activeOrder?.items || [];
  const customer: Partial<CheckoutInfo> = activeOrder?.customer || {};

  const total = activeOrder?.total || 1099;
  const paymentStatus = activeOrder?.paymentStatus || 'SUBMITTED';

  if (accessDenied) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-white pt-24 pb-16 px-4 md:px-8 flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-red-500 mb-4">lock</span>
        <h1 className="text-2xl font-headline-md mb-2">ACCESS DENIED</h1>
        <p className="text-gray-400 text-sm text-center max-w-md mb-6">
          You do not have permission to view this order. Orders can only be viewed by the person who placed them.
        </p>
        <Link href="/track-order" className="bg-electric-lime text-black px-6 py-3 font-bold font-label-caps rounded-lg hover:bg-white transition-colors">
          TRACK YOUR ORDER
        </Link>
      </div>
    );
  }

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
              <p className="font-bold text-sm text-white mt-1 print-black-text">{customer.fullName || 'Customer'}</p>
              <p className="text-xs text-[#a3a3a3]">{customer.address ? `${customer.address}, ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}` : 'Address on file'}</p>
            </div>
            <div className="md:text-right">
              <span className="text-[10px] text-electric-lime font-mono uppercase font-bold tracking-wider">CONTACT:</span>
              <p className="text-xs text-white mt-1 print-black-text">{customer.email || '—'}</p>
              <p className="text-xs text-[#a3a3a3]">{customer.phone || '—'}</p>
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
                {items.map((item: { name: string; size?: string; quantity?: number; price: number }, idx: number) => (
                  <tr key={idx} className="hover:bg-[#1a1a1a]/50">
                    <td className="p-3 font-bold text-white print-black-text">{item.name}</td>
                    <td className="p-3 font-mono text-[#a3a3a3]">{item.size || 'M'}</td>
                    <td className="p-3 text-center font-mono">{item.quantity || 1}</td>
                    <td className="p-3 text-right font-mono font-bold text-white print-black-text">{formatCurrency(item.price * (item.quantity || 1))}</td>
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
