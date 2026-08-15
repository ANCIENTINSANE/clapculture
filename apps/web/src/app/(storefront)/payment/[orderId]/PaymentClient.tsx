/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, resolveImageUrl } from '@/lib/utils';
import { useCart } from '@/components/cart/CartProvider';
import { useOrderStore } from '@/lib/store';

export default function PaymentClient({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { clearCart } = useCart();
  const { currentOrder, getOrder, updatePaymentInfo } = useOrderStore();
  
  const order = getOrder(orderId) || currentOrder;
  const total = order?.total || 3498;

  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const upiId = 'paytm.slazmi4@pty';
  const qrCodeUrl = resolveImageUrl('/qrcode.png');

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedOrderId = orderId.startsWith('CLAP') ? orderId : `CLAP${orderId}`;

    const customerData = order?.customer || {
      fullName: 'Valued Customer',
      email: 'customer@example.com',
      phone: '+91 9876543210',
      address: 'Street address',
      apartment: '',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
    };

    const itemsData = (order?.items && order.items.length > 0) ? order.items : [];

    const orderPayload = {
      orderId: formattedOrderId,
      customer: typeof customerData === 'string' ? customerData : JSON.stringify(customerData),
      items: typeof itemsData === 'string' ? itemsData : JSON.stringify(itemsData),
      subtotal: order?.subtotal || total,
      shipping: order?.shipping || 0,
      total: order?.total || total,
      paymentStatus: 'SUBMITTED',
      orderStatus: 'PLACED',
      transactionId: utrNumber.trim(),
      trackingNumber: 'TRK-CLAP-PENDING',
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        console.log('✅ Order saved to Appwrite DB successfully:', data.data);
      }
    } catch (err) {
      console.error('Error posting order to DB:', err);
    }

    if (order) {
      updatePaymentInfo(utrNumber.trim(), screenshotUrl || 'https://placehold.co/600x800?text=Payment+Screenshot');
    }

    clearCart();

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/order-success/${formattedOrderId}`);
    }, 600);
  };

  return (
    <div className="bg-deep-black min-h-screen text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-2xl mx-auto border border-charcoal bg-[#141414] rounded-2xl p-6 md:p-10 shadow-2xl">
        <div className="text-center mb-8 border-b border-charcoal pb-6">
          <span className="font-label-caps text-xs text-electric-lime tracking-widest uppercase font-bold">STEP 2 OF 2</span>
          <h1 className="text-3xl md:text-5xl font-headline-md tracking-wider mt-1">SCAN & PAY VIA UPI</h1>
          <p className="text-sm text-gray-400 mt-2 font-body-sm">
            Complete your payment using any UPI App (GPay, PhonePe, Paytm, CRED).
          </p>
        </div>

        {/* Amount Card */}
        <div className="bg-[#1a1a1a] border border-charcoal rounded-xl p-4 mb-8 flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-400 font-label-caps">AMOUNT TO PAY</span>
            <p className="text-3xl font-headline-md text-electric-lime">{formatCurrency(total)}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 font-label-caps">ORDER ID</span>
            <p className="text-sm font-mono font-bold text-white">#{orderId}</p>
          </div>
        </div>

        {/* QR Code & UPI ID Section */}
        <div className="flex flex-col items-center bg-[#1a1a1a] border border-charcoal rounded-xl p-6 mb-8 text-center">
          <div className="bg-white p-3 rounded-xl mb-4 border-2 border-electric-lime">

            <img src={qrCodeUrl} alt="UPI QR Code" className="w-56 h-56 object-contain" />
          </div>

          <div className="w-full max-w-sm flex items-center justify-between bg-deep-black border border-charcoal rounded-lg p-3">
            <div>
              <span className="text-[10px] text-gray-500 font-label-caps uppercase block text-left">UPI ID</span>
              <span className="text-sm font-mono font-bold text-white">{upiId}</span>
            </div>
            <button
              onClick={handleCopyUpi}
              className="bg-charcoal hover:bg-electric-lime hover:text-black text-white px-3 py-1.5 rounded text-xs font-label-caps uppercase font-bold transition-all"
            >
              {copiedUpi ? 'COPIED!' : 'COPY'}
            </button>
          </div>
        </div>

        {/* Payment Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-label-caps uppercase text-gray-300 mb-2">
              1. UPLOAD PAYMENT SCREENSHOT *
            </label>
            <div className="border-2 border-dashed border-charcoal hover:border-electric-lime rounded-xl p-6 text-center cursor-pointer transition-all bg-[#1a1a1a]">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                required
                className="hidden"
                id="screenshot-upload"
              />
              <label htmlFor="screenshot-upload" className="cursor-pointer block">
                {screenshotUrl ? (
                  <div className="flex flex-col items-center">

                    <img src={screenshotUrl} alt="Preview" className="h-32 object-contain rounded mb-2 border border-electric-lime" />
                    <span className="text-xs text-electric-lime font-bold">Click to change screenshot</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-electric-lime mb-2">file_upload</span>
                    <span className="text-sm text-white font-bold">Click to upload payment screenshot</span>
                    <span className="text-xs text-gray-500 mt-1">Supports PNG, JPG, WebP</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-label-caps uppercase text-gray-300 mb-2">
              2. ENTER 12-DIGIT UTR / REFERENCE NUMBER *
            </label>
            <input
              type="text"
              placeholder="e.g. 423987123984"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
              required
              minLength={12}
              maxLength={12}
              pattern="\d{12}"
              title="Please enter a valid 12-digit UTR number"
              className="w-full bg-[#1a1a1a] border border-charcoal rounded-lg p-3 text-white font-mono focus:border-electric-lime outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !screenshotUrl || utrNumber.length < 12}
            className="w-full bg-electric-lime text-black font-label-caps font-bold text-base py-4 rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
          >
            {isSubmitting ? 'VERIFYING PAYMENT...' : 'CONFIRM PAYMENT & COMPLETE ORDER →'}
          </button>
        </form>

        {/* WhatsApp Payment Help Callout */}
        <div className="mt-6 p-4 bg-[#141414] border border-charcoal rounded-xl text-center">
          <p className="text-xs text-gray-400 mb-2">
            Facing payment issues or want to send screenshot directly?
          </p>
          <a
            href={`https://wa.me/917569684299?text=${encodeURIComponent(`Hi CLAPCULTURE, I need help with payment for Order #${orderId}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#25D366] hover:underline font-mono bg-[#25D366]/10 border border-[#25D366]/30 py-2 px-4 rounded-lg transition-all hover:bg-[#25D366]/20"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>WhatsApp Support: +91 7569684299</span>
          </a>
        </div>
      </div>
    </div>
  );
}
