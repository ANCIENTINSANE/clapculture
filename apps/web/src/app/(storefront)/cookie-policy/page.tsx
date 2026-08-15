import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | CLAPCULTURE',
  description: 'Official Cookie Policy for CLAPCULTURE — Understand how we use cookies and tracking technologies.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white pt-28 md:pt-36 pb-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-charcoal pb-8 mb-10">
          <div className="inline-block bg-electric-lime text-deep-black font-label-caps text-[10px] md:text-xs px-2.5 py-1 mb-4 rounded-sm uppercase font-bold tracking-wider">
            LEGAL &amp; PRIVACY
          </div>
          <h1 className="font-headline-xl text-4xl sm:text-5xl md:text-7xl uppercase tracking-wider text-white mb-2">
            COOKIE POLICY
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-mono">
            CLAPCULTURE &bull; Last Updated: 16 August 2026
          </p>
        </div>

        <div className="space-y-10 font-body-sm text-gray-300 leading-relaxed">
          <section className="bg-[#141414] border border-charcoal rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-headline-md text-white uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="text-electric-lime font-mono text-sm md:text-base font-bold">01.</span> WHAT ARE COOKIES?
            </h2>
            <p className="mb-3">
              Cookies are small text files placed on your device (computer, tablet, or smartphone) when you browse our website. They allow the website to recognize your device, remember your preferences, and provide essential e-commerce functionality.
            </p>
            <p>
              CLAPCULTURE uses cookies and local browser storage strictly to ensure smooth shopping experiences, cart retention, and site security.
            </p>
          </section>

          <section className="bg-[#141414] border border-charcoal rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-headline-md text-white uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="text-electric-lime font-mono text-sm md:text-base font-bold">02.</span> COOKIES WE USE
            </h2>
            <div className="space-y-4">
              <div className="bg-black/50 border border-charcoal rounded-lg p-4">
                <h3 className="text-electric-lime font-bold text-sm uppercase mb-1 font-mono">1. Essential / Functional Cookies</h3>
                <p className="text-xs md:text-sm text-gray-300">
                  Necessary for website operation. These include your shopping cart state, checkout progress, session tokens, and security authenticators. The website cannot function properly without these.
                </p>
              </div>

              <div className="bg-black/50 border border-charcoal rounded-lg p-4">
                <h3 className="text-electric-lime font-bold text-sm uppercase mb-1 font-mono">2. Analytics &amp; Performance Cookies</h3>
                <p className="text-xs md:text-sm text-gray-300">
                  Help us understand how customers navigate CLAPCULTURE, which drops are popular, page loading speeds, and site error telemetry to enhance overall user experience.
                </p>
              </div>

              <div className="bg-black/50 border border-charcoal rounded-lg p-4">
                <h3 className="text-electric-lime font-bold text-sm uppercase mb-1 font-mono">3. Preference Cookies</h3>
                <p className="text-xs md:text-sm text-gray-300">
                  Remember your device settings, such as size filters or view preferences on product catalog pages.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#141414] border border-charcoal rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-headline-md text-white uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="text-electric-lime font-mono text-sm md:text-base font-bold">03.</span> MANAGING YOUR COOKIES
            </h2>
            <p className="mb-3">
              You have the right to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.
            </p>
            <p className="text-xs md:text-sm text-gray-400">
              Please note that disabling essential cookies may impact checkout workflows, cart persistence, or site responsiveness.
            </p>
          </section>

          <section className="bg-[#141414] border border-charcoal rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-headline-md text-white uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="text-electric-lime font-mono text-sm md:text-base font-bold">04.</span> CONTACT &amp; PRIVACY
            </h2>
            <p className="mb-4">
              For complete details on how your personal data is protected, read our full <Link href="/privacy" className="text-electric-lime underline font-bold">Privacy Policy</Link>.
            </p>
            <div className="text-xs font-mono text-gray-400">
              Official Email: <a href="mailto:clapcultureofficial@gmail.com" className="text-white underline">clapcultureofficial@gmail.com</a> | WhatsApp: <a href="https://wa.me/917569684299" target="_blank" rel="noopener noreferrer" className="text-white underline">+91 7569684299</a>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center text-xs text-gray-500 font-mono">
          &copy; 2026 CLAPCULTURE. All rights reserved.
        </div>
      </div>
    </div>
  );
}
