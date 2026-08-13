import React from 'react';

export const metadata = { title: 'Returns Policy | CLAPCULTURE' };

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white pt-32 pb-24 px-4 md:px-8 max-w-3xl mx-auto">
      <h1 className="font-headline-xl text-5xl md:text-7xl uppercase mb-12 text-center">RETURNS POLICY</h1>
      
      <div className="space-y-8 font-body-sm text-gray-300 leading-relaxed">
        <section>
          <h2 className="font-headline-md text-2xl uppercase mb-4 text-white">7-DAY RETURN POLICY</h2>
          <p>We accept returns up to 7 days after delivery, if the item is unused and in its original condition, with tags attached. We will refund the full order amount minus the shipping costs for the return.</p>
        </section>

        <section>
          <h2 className="font-headline-md text-2xl uppercase mb-4 text-white">HOW TO RETURN</h2>
          <p>To initiate a return, please contact us at hello@clapculture.com with your order number and reason for return. We will provide you with a return shipping address and instructions.</p>
        </section>

        <section>
          <h2 className="font-headline-md text-2xl uppercase mb-4 text-white">EXCHANGES</h2>
          <p>If you need to exchange an item for a different size, the fastest way is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>
        </section>
      </div>
    </div>
  );
}
