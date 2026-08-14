/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency, resolveImageUrl } from '@/lib/utils';

interface OrderItem {
  id?: string;
  name: string;
  image?: string;
  size?: string;
  price: number;
  quantity: number;
}

interface OrderCustomer {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface OrderDoc {
  $id: string;
  orderId: string;
  customer: string | OrderCustomer;
  items: string | OrderItem[];
  subtotal?: number;
  shipping?: number;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  transactionId?: string;
  trackingNumber?: string;
  screenshotUrl?: string;
  $createdAt?: string;
}

export default function AdminOrderClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState('SUBMITTED');
  const [orderStatus, setOrderStatus] = useState('PLACED');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [toast, setToast] = useState<{ show: boolean; msg: string; isError?: boolean }>({ show: false, msg: '' });

  const showToast = (msg: string, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast({ show: false, msg: '' }), 3500);
  };

  const loadOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const doc: OrderDoc = json.data;
          setOrder(doc);
          setPaymentStatus(doc.paymentStatus || 'SUBMITTED');
          setOrderStatus(doc.orderStatus || 'PLACED');
          setTrackingNumber(doc.trackingNumber || '');
        }
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => loadOrder(), 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleVerifyPayment = async (status: 'VERIFIED' | 'REJECTED') => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const newOrderStatus = status === 'VERIFIED' ? 'CONFIRMED' : orderStatus;
      
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          paymentStatus: status,
          orderStatus: newOrderStatus,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setPaymentStatus(status);
        if (status === 'VERIFIED') setOrderStatus('CONFIRMED');
        showToast(
          status === 'VERIFIED'
            ? '✨ Payment verified & order confirmed! Customer notified via email.'
            : '⚠️ Payment rejected.'
        );
        loadOrder();
      } else {
        showToast(json.error || 'Failed to update payment status', true);
      }
    } catch {
      showToast('Network error while updating status', true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          orderStatus,
          paymentStatus,
          trackingNumber: trackingNumber.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`✨ Fulfillment status updated to ${orderStatus}!`);
        loadOrder();
      } else {
        showToast(json.error || 'Failed to update order status', true);
      }
    } catch {
      showToast('Network error while updating status', true);
    } finally {
      setIsUpdating(false);
    }
  };

  // Parsed helpers
  const customer: OrderCustomer = React.useMemo(() => {
    if (!order) return {};
    if (typeof order.customer === 'string') {
      try {
        return JSON.parse(order.customer);
      } catch {
        return {};
      }
    }
    return order.customer || {};
  }, [order]);

  const items: OrderItem[] = React.useMemo(() => {
    if (!order) return [];
    if (typeof order.items === 'string') {
      try {
        return JSON.parse(order.items);
      } catch {
        return [];
      }
    }
    return order.items || [];
  }, [order]);

  const cleanId = (order?.orderId || orderId).replace('#', '');
  const orderDate = order?.$createdAt
    ? new Date(order.$createdAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent Order';

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen p-6 text-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-electric-lime border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs text-gray-400">Loading order #{cleanId}...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen p-6 text-white">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-lg font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom ${
          toast.isError ? 'bg-red-600 text-white' : 'bg-electric-lime text-black'
        }`}>
          <span className="material-symbols-outlined text-xl">
            {toast.isError ? 'error' : 'check_circle'}
          </span>
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link href="/admin/orders" className="text-sm text-[#737373] hover:text-electric-lime flex items-center gap-1">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Orders
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#737373]">Live Status:</span>
            <span className="bg-electric-lime/10 text-electric-lime border border-electric-lime/20 px-3 py-1 rounded-full text-xs font-bold font-mono">
              {orderStatus}
            </span>
          </div>
        </div>

        {/* Main Order Card */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#262626]">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-mono text-white">ORDER #{cleanId}</h1>
              <p className="text-xs text-[#737373] mt-1 font-mono">
                Placed on {orderDate} via UPI Payment
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isUpdating || paymentStatus === 'VERIFIED'}
                onClick={() => handleVerifyPayment('VERIFIED')}
                className={`font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                  paymentStatus === 'VERIFIED'
                    ? 'bg-green-700/50 text-green-300 cursor-default'
                    : 'bg-green-600 hover:bg-green-500 text-white cursor-pointer'
                }`}
              >
                <span className="material-symbols-outlined text-base">verified</span>
                {paymentStatus === 'VERIFIED' ? '✓ PAYMENT VERIFIED' : 'CONFIRM & VERIFY PAYMENT'}
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleVerifyPayment('REJECTED')}
                className="bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
              >
                REJECT PAYMENT
              </button>
            </div>
          </div>

          {/* Payment Verification Section */}
          <div className="my-6 bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-electric-lime tracking-wider font-mono">
                💳 PAYMENT PROOF & VERIFICATION
              </span>
              <span className={`text-xs font-mono px-2.5 py-0.5 rounded font-bold ${
                paymentStatus === 'VERIFIED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                STATUS: {paymentStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs text-[#737373] block mb-2 font-mono">Payment Proof Screenshot:</span>
                <div className="border border-[#262626] rounded-lg p-2 bg-[#0d0d0d] overflow-hidden flex items-center justify-center min-h-48">
                  {order?.screenshotUrl && !order.screenshotUrl.includes('placehold') ? (
                    <img
                      src={resolveImageUrl(order.screenshotUrl)}
                      alt="Payment Screenshot"
                      className="w-full max-h-64 object-contain rounded"
                    />
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <span className="material-symbols-outlined text-4xl block mb-1 text-gray-600">receipt_long</span>
                      <p className="text-xs font-mono">UPI Screenshot Submitted via App</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div>
                  <span className="text-xs text-[#737373] block">UTR / Reference Number:</span>
                  <p className="text-base font-bold text-electric-lime mt-0.5">
                    {order?.transactionId || 'UPI-REF-PENDING'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#737373] block">Total Amount:</span>
                  <p className="text-2xl font-bold text-white mt-0.5">
                    {formatCurrency(order?.total || 0)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#737373] block">Payment Channel:</span>
                  <p className="text-xs text-gray-300 mt-0.5">Direct UPI (clapculture@upi)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Delivery Details */}
          <div className="my-6 bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
            <h3 className="text-xs font-bold uppercase text-white font-mono tracking-wider mb-4">
              📍 CUSTOMER & SHIPPING ADDRESS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div>
                <span className="text-[#737373] block mb-1">Customer Name:</span>
                <p className="text-sm font-bold text-white">{customer.fullName || 'Valued Rebel'}</p>
                <p className="text-[#a3a3a3] mt-1">{customer.email || 'customer@example.com'}</p>
                <p className="text-[#a3a3a3]">{customer.phone || '+91 9876543210'}</p>
              </div>
              <div>
                <span className="text-[#737373] block mb-1">Delivery Address:</span>
                <p className="text-white font-medium">{customer.address}</p>
                {customer.apartment && <p className="text-gray-400">{customer.apartment}</p>}
                <p className="text-gray-400">
                  {customer.city}, {customer.state} — {customer.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="my-6 bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
            <h3 className="text-xs font-bold uppercase text-white font-mono tracking-wider mb-4">
              🛍️ ORDER ITEMS ({items.length})
            </h3>
            <div className="divide-y divide-[#262626]">
              {items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-[#111] border border-[#2e2e2e] rounded overflow-hidden shrink-0">
                      <img
                        src={resolveImageUrl(item.image || '/herobg1-desktop.png')}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded border border-[#333]"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <div className="flex gap-2 text-xs font-mono text-gray-400 mt-0.5">
                        <span className="bg-[#262626] px-1.5 py-0.5 rounded text-electric-lime">
                          Size: {item.size || 'M'}
                        </span>
                        <span>Qty: {item.quantity || 1}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-sm text-white">
                    {formatCurrency(item.price * (item.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status & Tracking Update Form */}
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase text-white mb-4 font-mono">
              🚚 FULFILLMENT & LIVE TRACKING UPDATE
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs text-[#737373] mb-1 font-mono">Order Fulfillment Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2.5 text-white focus:border-electric-lime outline-none text-xs font-mono"
                >
                  <option value="PLACED">ORDER PLACED</option>
                  <option value="CONFIRMED">ORDER CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING / PACKING</option>
                  <option value="SHIPPED">SHIPPED / IN TRANSIT</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#737373] mb-1 font-mono">Courier Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. BLUEDART-9874213 or DTDC-4422"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2.5 text-white font-mono focus:border-electric-lime outline-none text-xs"
                />
              </div>

              <button
                type="button"
                disabled={isUpdating}
                onClick={handleUpdateStatus}
                className="bg-electric-lime hover:bg-white text-black font-bold px-4 py-2.5 rounded-lg text-xs transition-colors uppercase font-mono cursor-pointer"
              >
                {isUpdating ? 'SAVING...' : 'SAVE FULFILLMENT STATUS'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
