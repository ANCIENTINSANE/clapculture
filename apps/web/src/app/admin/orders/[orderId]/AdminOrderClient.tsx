'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminOrderClient({ orderId }: { orderId: string }) {
  const [paymentStatus, setPaymentStatus] = useState('SUBMITTED');
  const [orderStatus, setOrderStatus] = useState('PLACED');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [toast, setToast] = useState<{show: boolean, msg: string}>({ show: false, msg: '' });

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const handleVerifyPayment = (status: 'VERIFIED' | 'REJECTED') => {
    setPaymentStatus(status);
    if (status === 'VERIFIED') {
      setOrderStatus('CONFIRMED');
      showToast('Payment screenshot verified successfully!');
    } else {
      showToast('Payment rejected.');
    }
  };

  const handleUpdateStatus = () => {
    showToast(`Order status updated to ${orderStatus}`);
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen p-6 text-white">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#d2f000] text-black px-6 py-3 rounded-lg font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin/orders" className="text-sm text-[#737373] hover:text-[#d2f000] flex items-center gap-1">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Orders
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#737373]">Order Status:</span>
            <span className="bg-[#d2f000]/10 text-[#d2f000] border border-[#d2f000]/20 px-3 py-1 rounded-full text-xs font-bold font-mono">
              {orderStatus}
            </span>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#262626]">
            <div>
              <h1 className="text-2xl font-bold font-mono">ORDER #{orderId}</h1>
              <p className="text-xs text-[#737373] mt-1">Placed on August 12, 2026 at 4:32 PM via UPI</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleVerifyPayment('VERIFIED')}
                className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">check</span>
                VERIFY PAYMENT
              </button>
              <button
                onClick={() => handleVerifyPayment('REJECTED')}
                className="bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 font-bold px-4 py-2 rounded-lg text-xs transition-colors"
              >
                REJECT PAYMENT
              </button>
            </div>
          </div>

          {/* Payment Verification Section */}
          <div className="my-6 bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-[#d2f000] tracking-wider font-mono">PAYMENT VERIFICATION</span>
              <span className="text-xs font-mono text-[#a3a3a3]">STATUS: {paymentStatus}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs text-[#737373] block mb-2">Uploaded Screenshot:</span>
                <div className="border border-[#262626] rounded-lg p-2 bg-[#0d0d0d] overflow-hidden">
                  <img
                    src="https://placehold.co/600x800/141414/d2f000?text=Payment+Screenshot+Proof"
                    alt="Payment Proof"
                    className="w-full h-48 object-contain rounded"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-[#737373]">UTR / Reference Number:</span>
                  <p className="text-base font-mono font-bold text-white mt-1">423987123984</p>
                </div>
                <div>
                  <span className="text-xs text-[#737373]">Amount Paid:</span>
                  <p className="text-2xl font-bold text-[#d2f000]">₹3,498.00</p>
                </div>
                <div>
                  <span className="text-xs text-[#737373]">UPI ID:</span>
                  <p className="text-sm font-mono text-white">customer@upi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Form */}
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 mb-6">
            <h3 className="text-sm font-bold uppercase text-white mb-4">FULFILLMENT & TRACKING</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs text-[#737373] mb-1">Order Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none text-sm"
                >
                  <option value="PLACED">ORDER PLACED</option>
                  <option value="CONFIRMED">ORDER CONFIRMED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#737373] mb-1">Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. DTDC-9874213"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white font-mono focus:border-[#d2f000] outline-none text-sm"
                />
              </div>

              <button
                onClick={handleUpdateStatus}
                className="bg-[#d2f000] hover:bg-white text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors uppercase font-mono"
              >
                SAVE FULFILLMENT STATUS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
