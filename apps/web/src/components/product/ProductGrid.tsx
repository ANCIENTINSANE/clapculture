import React from 'react';
import { Product } from '@clapculture/shared';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="bg-charcoal aspect-[4/5] mb-4"></div>
            <div className="h-6 bg-charcoal w-3/4 mb-2"></div>
            <div className="h-5 bg-charcoal w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">search_off</span>
        <h3 className="text-2xl font-headline-md uppercase mb-2">No products found</h3>
        <p className="text-gray-400 max-w-md">Try adjusting your filters or search terms to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
