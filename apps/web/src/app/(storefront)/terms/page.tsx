import React from 'react';

export const metadata = { title: 'Terms & Conditions | CLAPCULTURE' };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white pt-32 pb-24 px-4 md:px-8 max-w-3xl mx-auto">
      <h1 className="font-headline-xl text-5xl md:text-7xl uppercase mb-12 text-center">TERMS & CONDITIONS</h1>
      
      <div className="space-y-8 font-body-sm text-gray-300 leading-relaxed">
        <section>
          <h2 className="font-headline-md text-2xl uppercase mb-4 text-white">OVERVIEW</h2>
          <p>This website is operated by CLAPCULTURE. Throughout the site, the terms “we”, “us” and “our” refer to CLAPCULTURE. We offer this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>
        </section>

        <section>
          <h2 className="font-headline-md text-2xl uppercase mb-4 text-white">ONLINE STORE TERMS</h2>
          <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose.</p>
        </section>
      </div>
    </div>
  );
}
