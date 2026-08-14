'use client';

import React, { useState, useMemo } from 'react';
import { useProducts } from '@/lib/use-api-data';
import { ProductGrid } from '@/components/product/ProductGrid';

export default function SearchPage() {
  const { data: products } = useProducts();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      (p.badges || []).some(b => b.toLowerCase().includes(q))
    );
  }, [products, query]);
  
  const suggestions = ["Oversized Tee", "Hoodie", "Tollywood", "Cargo"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-deep-black text-white pt-32 pb-12 px-4 md:px-8 max-w-[1920px] mx-auto">
      <div className="max-w-4xl mx-auto mb-16">
        <form onSubmit={handleSearch} className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === '') setHasSearched(false);
            }}
            placeholder="WHAT ARE YOU LOOKING FOR?"
            className="w-full bg-transparent border-b-2 border-charcoal focus:border-electric-lime text-3xl md:text-5xl font-headline-xl py-4 focus:outline-none transition-colors uppercase placeholder-gray-700"
            autoFocus
          />
          <button type="submit" className="absolute right-0 bottom-4 text-gray-400 hover:text-electric-lime transition-colors">
            <span className="material-symbols-outlined text-4xl">search</span>
          </button>
        </form>

        {!hasSearched && query === '' && (
          <div>
            <span className="font-label-caps text-sm text-gray-500 mb-4 block">POPULAR SEARCHES</span>
            <div className="flex flex-wrap gap-4">
              {suggestions.map(s => (
                <button 
                  key={s} 
                  onClick={() => { setQuery(s); setHasSearched(true); }}
                  className="border border-charcoal px-6 py-2 text-sm font-bold uppercase hover:border-electric-lime hover:text-electric-lime transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasSearched && (
        <div>
          <div className="mb-8 border-b border-charcoal pb-4">
            <h2 className="font-headline-md text-2xl uppercase">RESULTS FOR &quot;{query}&quot; ({results.length})</h2>
          </div>
          
          <ProductGrid products={results} />
        </div>
      )}
    </div>
  );
}
