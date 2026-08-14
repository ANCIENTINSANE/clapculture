/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useOrderStore, OrderData } from '@/lib/store';
import { formatCurrency, resolveImageUrl } from '@/lib/utils';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const urlOrderId = useMemo(() => (searchParams.get('orderId') || '').replace('#', '').trim(), [searchParams]);
  const urlEmail = useMemo(() => searchParams.get('email') || '', [searchParams]);

  const { getOrder, currentOrder } = useOrderStore();
  const [orderId, setOrderId] = useState(urlOrderId);
  const [email, setEmail] = useState(urlEmail);
  const [dbOrder, setDbOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchDbOrder = async (searchId: string) => {
    if (!searchId.trim()) return;
    setLoading(true);
    setErrorMessage('');
    const cleanId = searchId.replace('#', '').trim();

    try {
      const res = await fetch(`/api/orders/${cleanId}`);
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

          const mappedOrder: OrderData = {
            orderId: String(doc.orderId || cleanId),
            customer: parsedCustomer || {},
            items: Array.isArray(parsedItems) ? parsedItems : [],
            subtotal: doc.subtotal || doc.total || 0,
            shipping: doc.shipping || 0,
            total: doc.total || 0,
            paymentStatus: doc.paymentStatus || 'SUBMITTED',
            orderStatus: doc.orderStatus || 'PLACED',
            transactionId: doc.transactionId,
            createdAt: doc.$createdAt || new Date().toISOString(),
          };

          setDbOrder(mappedOrder);
          return;
        }
      }

      // Local fallback
      const local = getOrder(cleanId) || (currentOrder?.orderId === cleanId ? currentOrder : null);
      if (local) {
        setDbOrder(local);
      } else {
        setErrorMessage(`Order #${cleanId} not found. Please verify the order number.`);
      }
    } catch {
      const local = getOrder(cleanId) || (currentOrder?.orderId === cleanId ? currentOrder : null);
      if (local) {
        setDbOrder(local);
      } else {
        setErrorMessage('Unable to connect to order tracking service. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlOrderId) {
      setTimeout(() => fetchDbOrder(urlOrderId), 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlOrderId]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    fetchDbOrder(orderId);
  };

  const steps = [
    { key: 'PLACED', label: 'ORDER PLACED' },
    { key: 'SUBMITTED', label: 'PAYMENT SUBMITTED' },
    { key: 'VERIFIED', label: 'PAYMENT VERIFIED' },
    { key: 'CONFIRMED', label: 'ORDER CONFIRMED' },
    { key: 'PROCESSING', label: 'PROCESSING & PACKING' },
    { key: 'SHIPPED', label: 'SHIPPED / IN TRANSIT' },
    { key: 'DELIVERED', label: 'DELIVERED' },
  ];

  // Determine current timeline step index strictly based on payment & order status
  const currentStepIndex = useMemo(() => {
    if (!dbOrder) return 0;
    
    const pStatus = dbOrder.paymentStatus || 'PENDING';
    const oStatus = dbOrder.orderStatus || 'PLACED';

    if (oStatus === 'DELIVERED') return 6;
    if (oStatus === 'SHIPPED') return 5;
    if (oStatus === 'PROCESSING' || oStatus === 'PACKED') return 4;
    if (oStatus === 'CONFIRMED' || pStatus === 'VERIFIED') return 3;
    if (pStatus === 'SUBMITTED') return 1;
    
    return 0;
  }, [dbOrder]);

  const isConfirmed = currentStepIndex >= 3;
  const isPaymentVerified = dbOrder?.paymentStatus === 'VERIFIED' || isConfirmed;

  return (
    <div className="min-h-screen bg-deep-black text-white pt-24 pb-12 px-4 md:px-8 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="font-headline-xl text-5xl md:text-6xl uppercase">TRACK ORDER</h1>
        <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm">
          Enter your order ID to view real-time shipment & verification status.
        </p>
      </div>

      {!dbOrder ? (
        <form onSubmit={handleTrack} className="bg-charcoal p-8 border border-gray-800 rounded-xl shadow-2xl space-y-6">
          {errorMessage && (
            <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-label-caps text-electric-lime mb-2 tracking-widest">
              ORDER ID *
            </label>
            <input 
              type="text" 
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. CLAP10245"
              className="w-full bg-black border border-gray-700 p-4 text-white font-mono focus:outline-none focus:border-electric-lime text-base rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-label-caps text-gray-400 mb-2 tracking-widest">
              EMAIL ADDRESS OR MOBILE (OPTIONAL)
            </label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email or mobile number"
              className="w-full bg-black border border-gray-700 p-4 text-white focus:outline-none focus:border-electric-lime text-base rounded"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-electric-lime text-black font-headline-md text-xl py-4 hover:bg-white transition-colors uppercase font-bold rounded cursor-pointer"
          >
            {loading ? 'CHECKING APPWRITE DATABASE...' : 'TRACK SHIPMENT NOW'}
          </button>
        </form>
      ) : (
        <div className="bg-charcoal p-8 border border-gray-800 rounded-xl shadow-2xl space-y-8 animate-in fade-in duration-300">
          {/* Order Header & Status Alert */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-6 gap-4">
            <div>
              <span className="text-xs text-electric-lime font-label-caps tracking-widest font-bold">
                LIVE SHIPMENT TIMELINE
              </span>
              <h2 className="font-headline-md text-3xl md:text-4xl text-white mt-1">
                ORDER #{dbOrder.orderId.replace('#', '')}
              </h2>
              {dbOrder.customer?.email && (
                <p className="text-xs text-gray-400 font-mono mt-1">Customer: {dbOrder.customer.email}</p>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {isPaymentVerified ? (
                <span className="bg-electric-lime text-black text-xs font-bold px-3 py-1.5 uppercase rounded tracking-wider font-mono">
                  ✓ ORDER CONFIRMED & VERIFIED
                </span>
              ) : (
                <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-xs font-bold px-3 py-1.5 uppercase rounded tracking-wider font-mono">
                  ⏳ PAYMENT VERIFICATION PENDING
                </span>
              )}
              <button 
                onClick={() => {
                  setDbOrder(null);
                  setOrderId('');
                  setErrorMessage('');
                }} 
                className="text-[11px] text-gray-400 hover:text-electric-lime underline font-label-caps cursor-pointer"
              >
                Search Another Order
              </button>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div>
            <h3 className="font-headline-md text-xl text-white mb-6 uppercase tracking-wider">
              SHIPMENT PROGRESS
            </h3>
            <div className="relative pl-8 space-y-6">
              {/* Vertical Progress Line */}
              <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-gray-800"></div>

              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                let dotClass = "bg-gray-800 border-2 border-charcoal";
                let textClass = "text-gray-500";
                
                if (isCompleted) {
                  dotClass = "bg-electric-lime border-2 border-electric-lime shadow-[0_0_10px_rgba(210,240,0,0.6)]";
                  textClass = "text-white opacity-80";
                } else if (isCurrent) {
                  dotClass = "bg-black border-2 border-electric-lime animate-pulse";
                  textClass = "text-electric-lime font-bold";
                }

                return (
                  <div key={step.key} className="relative z-10 flex items-start gap-4">
                    <div className={`absolute -left-9.5 w-4 h-4 rounded-full mt-1 ${dotClass}`}></div>
                    <div className="grow">
                      <h4 className={`font-label-caps tracking-widest text-sm ${textClass}`}>{step.label}</h4>
                      <p className={`text-xs mt-0.5 ${isCurrent ? 'text-gray-300 font-bold' : 'text-gray-600'}`}>
                        {isCompleted ? '✓ Completed' : isCurrent ? 'Active - Current Status' : 'Pending Verification'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ordered Items Preview */}
          {dbOrder.items && dbOrder.items.length > 0 && (
            <div className="pt-6 border-t border-gray-800 space-y-4">
              <h3 className="font-headline-md text-lg text-white uppercase">ORDERED ITEMS</h3>
              <div className="space-y-3">
                {dbOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-black/40 p-3 rounded border border-gray-800 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-20 bg-charcoal border border-charcoal overflow-hidden shrink-0">
                        <img 
                          src={resolveImageUrl(item.image || '/herobg1-desktop.png')} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-bold text-white uppercase">{item.name}</p>
                        <p className="text-gray-400">Size: {item.size || 'M'} | Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <span className="font-mono text-electric-lime font-bold">
                      {formatCurrency(item.price * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 text-sm">
                <span className="text-gray-400 font-label-caps">TOTAL AMOUNT:</span>
                <span className="font-bold text-electric-lime text-xl font-mono">
                  {formatCurrency(dbOrder.total)}
                </span>
              </div>
            </div>
          )}
          
          <div className="pt-6 border-t border-gray-800 text-center">
            <Link 
              href={`/order/${dbOrder.orderId.replace('#', '')}`} 
              className="text-electric-lime underline font-label-caps text-xs tracking-widest hover:text-white transition-colors uppercase font-bold"
            >
              VIEW OFFICIAL RECEIPT & INVOICE →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-deep-black text-white flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-2 border-electric-lime border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
