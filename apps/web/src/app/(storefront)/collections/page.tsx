import React from 'react';
import Link from 'next/link';
import { MOCK_COLLECTIONS } from '@/lib/mock-data';

export const metadata = {
  title: 'Collections | CLAPCULTURE',
  description: 'Explore all streetwear collections by CLAPCULTURE.',
};

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white pt-24 pb-16 px-4 md:px-8 max-w-[1920px] mx-auto">
      <div className="mb-12 text-center">
        <h1 className="font-headline-xl text-6xl md:text-8xl tracking-wider text-white">COLLECTIONS</h1>
        <p className="mt-4 text-gray-400 font-body-sm max-w-xl mx-auto">Discover our curated drops. From Tollywood-inspired graphics to essential oversized blanks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
        {MOCK_COLLECTIONS.map((collection, index) => {
          // Make some cards span 2 columns or rows for bento effect
          let spanClass = '';
          if (index === 0) spanClass = 'md:col-span-2 lg:col-span-2 row-span-2';
          else if (index === 3) spanClass = 'md:col-span-2 lg:col-span-1 row-span-2';
          else if (index === 5) spanClass = 'lg:col-span-2';

          return (
            <Link 
              key={collection.id} 
              href={`/collections/${collection.slug}`}
              className={`group relative overflow-hidden bg-charcoal border border-gray-800 hover:border-electric-lime transition-colors ${spanClass}`}
            >
              {/* Abstract Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-black to-gray-900 group-hover:scale-105 transition-transform duration-700">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-electric-lime/20 via-transparent to-transparent"></div>
              </div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="font-headline-md text-3xl md:text-5xl uppercase group-hover:text-electric-lime transition-colors">{collection.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-300 font-label-caps text-sm">{collection.productIds.length} ITEMS</span>
                  <span className="material-symbols-outlined text-electric-lime text-sm opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">arrow_forward</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
