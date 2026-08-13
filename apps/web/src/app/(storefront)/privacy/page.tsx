import React from 'react';

export const metadata = { title: 'Privacy Policy | CLAPCULTURE' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white pt-32 pb-24 px-4 md:px-8 max-w-3xl mx-auto">
      <h1 className="font-headline-xl text-5xl md:text-7xl uppercase mb-12 text-center">PRIVACY POLICY</h1>
      
      <div className="space-y-8 font-body-sm text-gray-300 leading-relaxed">
        <section>
          <p>Last updated: October 24, 2023</p>
          <p className="mt-4">At CLAPCULTURE, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
        </section>

        <section>
          <h2 className="font-headline-md text-2xl uppercase mb-4 text-white">DATA WE COLLECT</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Identity Data: First name, last name.</li>
            <li>Contact Data: Delivery address, email address and telephone numbers.</li>
            <li>Transaction Data: Details about payments to and from you and other details of products you have purchased from us.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
