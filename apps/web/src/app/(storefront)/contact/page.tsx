'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-deep-black text-white pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-headline-xl text-5xl md:text-7xl uppercase mb-4">HIT US UP</h1>
        <p className="text-gray-400 font-label-caps tracking-widest">WE'RE HERE FOR THE CULTURE.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-16">
        <div className="w-full md:w-1/2">
          {sent ? (
            <div className="bg-charcoal p-12 text-center border border-electric-lime">
              <span className="material-symbols-outlined text-6xl text-electric-lime mb-4">check_circle</span>
              <h2 className="font-headline-md text-3xl uppercase mb-2">MESSAGE SENT</h2>
              <p className="text-gray-400">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <input required type="text" placeholder="NAME *" className="w-full bg-charcoal border border-gray-700 p-4 text-white focus:outline-none focus:border-electric-lime" />
                <input required type="email" placeholder="EMAIL *" className="w-full bg-charcoal border border-gray-700 p-4 text-white focus:outline-none focus:border-electric-lime" />
              </div>
              <input required type="text" placeholder="SUBJECT *" className="w-full bg-charcoal border border-gray-700 p-4 text-white focus:outline-none focus:border-electric-lime" />
              <textarea required placeholder="YOUR MESSAGE *" rows={6} className="w-full bg-charcoal border border-gray-700 p-4 text-white focus:outline-none focus:border-electric-lime resize-none"></textarea>
              <button type="submit" className="w-full bg-electric-lime text-black font-headline-md text-xl py-4 uppercase hover:bg-white transition-colors">
                SEND MESSAGE
              </button>
            </form>
          )}
        </div>

        <div className="w-full md:w-1/2 space-y-12">
          <div>
            <h2 className="font-headline-md text-2xl uppercase border-b border-charcoal pb-2 mb-4">CONTACT INFO</h2>
            <div className="space-y-4 text-gray-300 font-body-sm">
              <p className="flex items-center gap-4"><span className="material-symbols-outlined text-electric-lime">mail</span> hello@clapculture.com</p>
              <p className="flex items-center gap-4"><span className="material-symbols-outlined text-electric-lime">phone</span> +91 98765 43210</p>
              <p className="flex items-center gap-4"><span className="material-symbols-outlined text-electric-lime">location_on</span> Banjara Hills, Hyderabad, India</p>
            </div>
          </div>

          <div>
            <h2 className="font-headline-md text-2xl uppercase border-b border-charcoal pb-2 mb-4">SOCIALS</h2>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-charcoal flex items-center justify-center hover:text-electric-lime transition-colors"><span className="material-symbols-outlined">link</span></a>
              <a href="#" className="w-12 h-12 bg-charcoal flex items-center justify-center hover:text-electric-lime transition-colors"><span className="material-symbols-outlined">share</span></a>
            </div>
          </div>

          <div className="bg-charcoal p-6 border border-gray-800">
            <h3 className="font-headline-md text-xl uppercase mb-2">QUICK ANSWERS</h3>
            <p className="text-gray-400 text-sm mb-4">Check our FAQ for quick answers regarding shipping, returns, and sizes.</p>
            <Link href="/faq" className="text-electric-lime underline text-sm font-label-caps tracking-wider">VIEW FAQ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
