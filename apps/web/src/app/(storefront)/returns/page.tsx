import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Returns & Exchange Policy | CLAPCULTURE',
  description: 'Official Returns, Refunds and Exchange terms for CLAPCULTURE.',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white pt-28 md:pt-36 pb-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-charcoal pb-8 mb-10">
          <div className="inline-block bg-electric-lime text-deep-black font-label-caps text-[10px] md:text-xs px-2.5 py-1 mb-4 rounded-sm uppercase font-bold tracking-wider">
            OFFICIAL POLICY
          </div>
          <h1 className="font-headline-xl text-4xl sm:text-5xl md:text-7xl uppercase tracking-wider text-white mb-2">
            RETURNS &amp; EXCHANGES
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-mono">
            CLAPCULTURE &bull; Last Updated: 16 August 2026
          </p>
        </div>

        <div className="space-y-8 font-body-sm text-gray-300 leading-relaxed">
          <section className="bg-[#141414] border border-charcoal rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-headline-md text-white uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="text-electric-lime font-mono text-sm md:text-base font-bold">01.</span> NO CHANGE OF MIND RETURNS
            </h2>
            <p>
              Because our streetwear pieces are custom made and packed specifically for each order, we do not provide refunds, returns, or routine exchanges for change of mind or personal preference when the correct item has been supplied undamaged.
            </p>
          </section>

          <section className="bg-[#141414] border border-charcoal rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-headline-md text-white uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="text-electric-lime font-mono text-sm md:text-base font-bold">02.</span> SIZE SELECTION RESPONSIBILITY
            </h2>
            <p className="mb-3">
              Customers are responsible for selecting the correct size before placing an order. A comprehensive size chart is provided on every product page. Fit preference or selecting the wrong size does not qualify for routine exchange or refund.
            </p>
            <Link href="/shop" className="text-electric-lime text-xs font-mono font-bold uppercase underline">
              &rarr; Check product size charts in our shop
            </Link>
          </section>

          <section className="bg-[#141414] border border-charcoal rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-headline-md text-white uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="text-electric-lime font-mono text-sm md:text-base font-bold">03.</span> DEFECTIVE OR DAMAGED DELIVERIES
            </h2>
            <p className="mb-3">
              If an item is damaged during transit, manufacturing-defective, or incorrectly supplied, contact our support team immediately with your Order ID, clear photos, and unboxing video for verification.
            </p>
            <p className="text-amber-400 font-semibold text-xs md:text-sm">
              ⚠️ Do not return courier parcels without official written return authorization from CLAPCULTURE.
            </p>
          </section>

          <section className="bg-[#141414] border border-charcoal rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-headline-md text-white uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="text-electric-lime font-mono text-sm md:text-base font-bold">04.</span> FULL POLICY &amp; SUPPORT
            </h2>
            <p className="mb-4">
              For complete terms on verification, timelines, and statutory consumer rights, read our complete <Link href="/refund-policy" className="text-electric-lime underline font-bold">Refund, Return &amp; Exchange Policy</Link>.
            </p>
            <div className="pt-3 border-t border-charcoal text-xs font-mono text-gray-400">
              Support Email: <a href="mailto:clapcultureofficial@gmail.com" className="text-white underline">clapcultureofficial@gmail.com</a> | WhatsApp: <a href="https://wa.me/917569684299" target="_blank" rel="noopener noreferrer" className="text-white underline">+91 7569684299</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
