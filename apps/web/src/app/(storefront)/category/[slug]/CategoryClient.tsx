'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Category } from '@clapculture/shared';
import { useProducts, useCategories } from '@/lib/use-api-data';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters, FilterState } from '@/components/product/ProductFilters';

export default function CategoryClient({ category }: { category: Category }) {
  const { data: allProducts } = useProducts();
  const { data: categories } = useCategories();

  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    selectedSizes: [],
    sortBy: 'NEWEST',
  });

  const catId = category.id || (category as unknown as Record<string, string>).$id;

  const baseProducts = useMemo(() => {
    // Match by categoryId or by slug in the product text
    return allProducts.filter((p) => {
      if (p.categoryId === catId) return true;
      // Fallback: match by slug keyword
      const slug = category.slug.toLowerCase();
      const text = `${p.name} ${p.description} ${(p.badges || []).join(' ')}`.toLowerCase();
      if (slug === 'tees') return text.includes('tee') || text.includes('t-shirt');
      if (slug === 'outerwear') return text.includes('hoodie') || text.includes('jacket') || text.includes('fleece');
      if (slug === 'bottoms') return text.includes('cargo') || text.includes('pants') || text.includes('bottoms');
      if (slug === 'headwear') return text.includes('cap') || text.includes('hat') || text.includes('snapback');
      return false;
    });
  }, [allProducts, catId, category.slug]);

  const categoryNames = useMemo(() => categories.map((c) => c.name), [categories]);

  const filteredProducts = useMemo(() => {
    let result = [...baseProducts];

    if (filters.selectedCategories.length > 0) {
      const categoryMap = new Map(categories.map((c) => [c.name, c.id || (c as unknown as Record<string, string>).$id]));
      const allowedCatIds = filters.selectedCategories.map((name) => categoryMap.get(name)).filter(Boolean);
      result = result.filter((p) => allowedCatIds.includes(p.categoryId));
    }

    if (filters.selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => filters.selectedSizes.includes(s))
      );
    }

    switch (filters.sortBy) {
      case 'LOW_HIGH':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'HIGH_LOW':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'POPULAR':
        result.sort((a, b) => (b.stock > a.stock ? -1 : 1));
        break;
      case 'NEWEST':
      default:
        break;
    }

    return result;
  }, [baseProducts, filters, categories]);

  return (
    <div className="min-h-screen bg-deep-black text-white pt-24 pb-12 px-4 md:px-8 max-w-[1920px] mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6 flex items-center gap-2 font-label-caps tracking-widest">
        <Link href="/" className="hover:text-electric-lime transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-white">{category.name.toUpperCase()}</span>
      </div>

      <div className="mb-12 border-b border-charcoal pb-8">
        <h1 className="font-headline-xl text-5xl md:text-7xl uppercase">{category.name}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <ProductFilters 
            categories={categoryNames} 
            selectedCategories={filters.selectedCategories}
            selectedSizes={filters.selectedSizes}
            sortBy={filters.sortBy}
            onFilterChange={setFilters} 
          />
        </div>

        <div className="grow">
          <div className="mb-6 flex justify-between items-center text-sm font-label-caps text-gray-400 border-b border-charcoal pb-4">
            <span>{filteredProducts.length} PRODUCTS</span>
            <select 
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
              className="hidden md:block bg-transparent border-none text-white focus:outline-none cursor-pointer"
            >
              <option value="NEWEST">SORT: FEATURED</option>
              <option value="LOW_HIGH">PRICE: LOW TO HIGH</option>
              <option value="HIGH_LOW">PRICE: HIGH TO LOW</option>
              <option value="POPULAR">SORT: POPULAR</option>
            </select>
          </div>
          
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
