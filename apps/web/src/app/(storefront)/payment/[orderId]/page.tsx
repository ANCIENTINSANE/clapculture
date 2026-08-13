'use client';

import React, { useState, use } from 'react';

import { useRouter } from 'next/navigation';

import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/components/cart/CartProvider';
import { useOrderStore } from '@/lib/store';

export default function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();
  const { clearCart } = useCart();
  const { currentOrder, getOrder, updatePaymentInfo } = useOrderStore();
  
  const order = getOrder(orderId) || currentOrder;

  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const total = order ? order.total : 2999;
  const upiId = 'clapculture@upi';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId || !file) {
      alert('Please upload your payment screenshot and enter the Transaction ID / UTR.');
      return;
    }
    setLoading(true);

    // Save payment verification data into order store
    updatePaymentInfo(transactionId, previewUrl);

    // Simulate API verification submit
    setTimeout(() => {
      clearCart();
      router.push(`/order-success/${orderId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-deep-black text-white pt-24 pb-12 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="font-headline-xl text-5xl md:text-6xl uppercase text-electric-lime">COMPLETE PAYMENT</h1>
        <p className="text-gray-400 mt-2 font-label-caps tracking-wider">ORDER #{orderId}</p>
      </div>

      <div className="bg-charcoal border border-gray-800 p-6 md:p-12">
        {/* Step 1: Scan & Pay */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 rounded-full bg-electric-lime text-black flex items-center justify-center font-bold">1</div>
            <h2 className="font-headline-md text-3xl uppercase">Scan & Pay</h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
            <div className="w-64 h-64 bg-white p-4 rounded-xl flex items-center justify-center flex-shrink-0">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${upiId}&pn=ClapCulture&am=${total}`}
                alt="UPI QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <p className="text-gray-400 mb-2">AMOUNT TO PAY</p>
              <p className="font-headline-md text-5xl text-electric-lime mb-6">{formatCurrency(total)}</p>
              
              <p className="text-gray-400 mb-2">OR USE UPI ID</p>
              <div className="flex items-center bg-black border border-gray-700 p-2 pl-4 w-full max-w-xs justify-between">
                <span className="font-bold text-lg">{upiId}</span>
                <button 
                  type="button"
                  onClick={handleCopyUPI}
                  className="bg-charcoal px-4 py-2 hover:text-electric-lime transition-colors text-sm font-label-caps"
                >
                  {copied ? 'COPIED!' : 'COPY'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gray-800 my-12 relative flex justify-center">
          <span className="absolute top-1/2 -translate-y-1/2 bg-charcoal px-4 text-gray-500 font-label-caps text-sm">AFTER PAYMENT</span>
        </div>

        {/* Step 2: Verification */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 rounded-full bg-electric-lime text-black flex items-center justify-center font-bold">2</div>
            <h2 className="font-headline-md text-3xl uppercase">Verify Payment</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
            <div>
              <label className="block text-sm font-label-caps text-gray-400 mb-2">UPLOAD SCREENSHOT *</label>
              <div className="border-2 border-dashed border-gray-700 p-8 text-center hover:border-electric-lime transition-colors cursor-pointer relative bg-black/50">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img src={previewUrl} alt="Screenshot preview" className="max-h-40 object-contain mb-2 rounded border border-gray-700" />
                    <p className="font-bold text-electric-lime text-sm">{file?.name}</p>
                    <p className="text-xs text-gray-400 mt-1">Click to change file</p>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">cloud_upload</span>
                    <p className="font-bold">Click or drag image here</p>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-label-caps text-gray-400 mb-2">TRANSACTION ID / UTR NUMBER *</label>
              <input 
                type="text" 
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 312345678901"
                className="w-full bg-black border border-gray-700 p-4 text-white focus:outline-none focus:border-electric-lime text-lg font-bold tracking-widest"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-electric-lime text-black font-headline-md text-xl py-5 uppercase mt-4 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-white'}`}
            >
              {loading ? 'VERIFYING...' : 'SUBMIT FOR VERIFICATION'}
            </button>
            <p className="text-center text-xs text-yellow-500 mt-4 flex items-center justify-center gap-1 font-label-caps">
              <span className="material-symbols-outlined text-[16px]">info</span>
              PAYMENT VERIFICATION PENDING AFTER SUBMISSION
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
