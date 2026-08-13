'use client';

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import { MOCK_COLLECTIONS, MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters, FilterState } from '@/components/product/ProductFilters';
import { notFound } from 'next/navigation';

export default function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const collection = MOCK_COLLECTIONS.find((c) => c.slug === slug);

  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    selectedSizes: [],
    sortBy: 'NEWEST',
  });

  if (!collection) {
    notFound();
  }

  const baseProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => collection.productIds.includes(p.id));
  }, [collection]);

  const categories = useMemo(() => MOCK_CATEGORIES.map((c) => c.name), []);

  const filteredProducts = useMemo(() => {
    let result = [...baseProducts];

    // Category filter
    if (filters.selectedCategories.length > 0) {
      const categoryMap = new Map(MOCK_CATEGORIES.map((c) => [c.name, c.id]));
      const allowedCatIds = filters.selectedCategories.map((name) => categoryMap.get(name)).filter(Boolean);
      result = result.filter((p) => allowedCatIds.includes(p.categoryId));
    }

    // Size filter
    if (filters.selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => filters.selectedSizes.includes(s))
      );
    }

    // Sort
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
  }, [baseProducts, filters]);

  return (
    <div className="min-h-screen bg-deep-black text-white pt-24 pb-12 px-4 md:px-8 max-w-[1920px] mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6 flex items-center gap-2 font-label-caps tracking-widest">
        <Link href="/" className="hover:text-electric-lime transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-electric-lime transition-colors">COLLECTIONS</Link>
        <span>/</span>
        <span className="text-white">{collection.name.toUpperCase()}</span>
      </div>

      {/* Hero Banner */}
      <div className="relative w-full h-[30vh] md:h-[40vh] bg-charcoal mb-12 flex items-center justify-center overflow-hidden border border-gray-800">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-electric-lime/20 via-black to-black"></div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="font-headline-xl text-5xl md:text-7xl lg:text-8xl tracking-widest uppercase">{collection.name}</h1>
          <p className="mt-4 text-gray-400 font-body-sm max-w-2xl mx-auto">
            {collection.description || 'Exclusive pieces curated for the culture. Dive into the aesthetic.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <ProductFilters 
            categories={categories} 
            selectedCategories={filters.selectedCategories}
            selectedSizes={filters.selectedSizes}
            sortBy={filters.sortBy}
            onFilterChange={setFilters} 
          />
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="mb-6 flex justify-between items-center text-sm font-label-caps text-gray-400 border-b border-charcoal pb-4">
            <span>{filteredProducts.length} RESULTS</span>
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
