'use client';

import React, { useState } from 'react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { category: 'ORDERS', q: 'How do I track my order?', a: 'You can track your order using the Track Order page with your Order ID and Email.' },
    { category: 'ORDERS', q: 'Can I cancel my order?', a: 'Orders can only be cancelled before they are processed (usually within 2 hours).' },
    { category: 'PAYMENTS', q: 'What payment methods do you accept?', a: 'We currently accept UPI payments via QR code and UPI ID.' },
    { category: 'SHIPPING', q: 'How long does shipping take?', a: 'Standard delivery takes 3-5 business days across India.' },
    { category: 'RETURNS', q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for unused items with tags attached.' },
    { category: 'SIZES', q: 'How do I know my size?', a: 'Our t-shirts are designed with an oversized fit. We recommend ordering your usual size for the intended oversized look, or sizing down for a regular fit. Check our Size Guide on product pages for exact measurements.' }
  ];

  return (
    <div className="min-h-screen bg-deep-black text-white pt-32 pb-24 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-headline-xl text-5xl md:text-7xl uppercase mb-4">FAQ</h1>
        <p className="text-gray-400 font-label-caps tracking-widest">FREQUENTLY ASKED QUESTIONS</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-charcoal border border-gray-800">
            <button 
              className="w-full p-6 flex justify-between items-center text-left hover:text-electric-lime transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-label-caps">{faq.category}</span>
                <span className="font-headline-md text-xl">{faq.q}</span>
              </div>
              <span className="material-symbols-outlined text-3xl">
                {openIndex === index ? 'remove' : 'add'}
              </span>
            </button>
            {openIndex === index && (
              <div className="p-6 pt-0 text-gray-300 font-body-sm text-lg border-t border-gray-800 mt-2">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
