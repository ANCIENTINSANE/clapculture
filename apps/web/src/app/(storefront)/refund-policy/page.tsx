import React from 'react';

export const metadata = { title: 'Refund Policy | CLAPCULTURE' };

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white pt-32 pb-24 px-4 md:px-8 max-w-3xl mx-auto">
      <h1 className="font-headline-xl text-5xl md:text-7xl uppercase mb-12 text-center">REFUND POLICY</h1>
      
      <div className="space-y-8 font-body-sm text-gray-300 leading-relaxed">
        <section>
          <h2 className="font-headline-md text-2xl uppercase mb-4 text-white">REFUNDS</h2>
          <p>We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days.</p>
          <p className="mt-4">Please remember it can take some time for your bank or credit card company to process and post the refund too.</p>
        </section>

        <section>
          <h2 className="font-headline-md text-2xl uppercase mb-4 text-white">EXCEPTIONS / NON-RETURNABLE ITEMS</h2>
          <p>Certain types of items cannot be returned, like custom products (such as special orders or personalized items). Please get in touch if you have questions or concerns about your specific item.</p>
        </section>
      </div>
    </div>
  );
}
