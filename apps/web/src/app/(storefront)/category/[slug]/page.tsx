'use client';

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/mock-data';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters, FilterState } from '@/components/product/ProductFilters';
import { notFound } from 'next/navigation';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);

  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    selectedSizes: [],
    sortBy: 'NEWEST',
  });

  if (!category) {
    notFound();
  }

  const baseProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.categoryId === category.id);
  }, [category]);

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
        <span className="text-white">{category.name.toUpperCase()}</span>
      </div>

      <div className="mb-12 border-b border-charcoal pb-8">
        <h1 className="font-headline-xl text-5xl md:text-7xl uppercase">{category.name}</h1>
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
