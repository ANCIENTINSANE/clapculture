'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, STAR_COLLECTIONS } from '@/lib/mock-data';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters, FilterState } from '@/components/product/ProductFilters';

function ShopContent() {
  const searchParams = useSearchParams();
  const starParam = searchParams.get('star') || '';

  const [search, setSearch] = useState('');
  const [selectedStarFilter, setSelectedStarFilter] = useState(starParam);
  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    selectedSizes: [],
    sortBy: 'NEWEST',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (starParam) {
      setSelectedStarFilter(starParam);
    }
  }, [starParam]);

  const categories = useMemo(() => MOCK_CATEGORIES.map((c) => c.name), []);

  const activeStarHero = useMemo(() => {
    return STAR_COLLECTIONS.find((h) => h.slug === selectedStarFilter);
  }, [selectedStarFilter]);

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    // Star Hero filter
    if (selectedStarFilter) {
      const heroName = activeStarHero ? activeStarHero.name.toLowerCase() : selectedStarFilter.replace('-', ' ');
      result = result.filter(
        (p) =>
          p.badges?.some((b) => b.toLowerCase().includes(heroName) || heroName.includes(b.toLowerCase())) ||
          p.name.toLowerCase().includes(heroName) ||
          p.description.toLowerCase().includes(heroName)
      );
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

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
        result.sort((a, b) => (a.badges?.includes('NEW') ? -1 : 1));
        break;
    }

    return result;
  }, [search, filters, selectedStarFilter, activeStarHero]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page]);

  return (
    <div className="min-h-screen bg-deep-black text-white pt-24 pb-12 px-4 md:px-8 max-w-[1920px] mx-auto">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <div className="text-sm text-gray-400 mb-4 flex items-center gap-2 font-label-caps tracking-widest">
          <Link href="/" className="hover:text-electric-lime transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/shop" onClick={() => setSelectedStarFilter('')} className="hover:text-electric-lime transition-colors">SHOP</Link>
          {activeStarHero && (
            <>
              <span>/</span>
              <span className="text-electric-lime uppercase font-bold">{activeStarHero.name}</span>
            </>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-charcoal pb-6">
          <div>
            <h1 className="font-headline-xl text-4xl md:text-7xl uppercase">
              {activeStarHero ? `${activeStarHero.name} COLLECTION` : 'ALL PRODUCTS'} ({filteredProducts.length})
            </h1>
            {activeStarHero && (
              <p className="text-xs md:text-sm text-electric-lime font-label-caps tracking-widest mt-1">
                {activeStarHero.tagline}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {selectedStarFilter && (
              <button 
                onClick={() => setSelectedStarFilter('')}
                className="bg-charcoal text-xs text-electric-lime border border-electric-lime px-3 py-2 font-label-caps hover:bg-electric-lime hover:text-black transition-colors"
              >
                CLEAR STAR FILTER ×
              </button>
            )}

            <div className="relative flex-grow md:w-64">
              <input 
                type="text" 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="SEARCH..." 
                className="w-full bg-charcoal border border-gray-700 text-white px-4 py-2 font-body-sm focus:outline-none focus:border-electric-lime placeholder-gray-500"
              />
              <span className="material-symbols-outlined absolute right-3 top-2 text-gray-400">search</span>
            </div>
            
            <select 
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
              className="hidden md:block bg-charcoal border border-gray-700 text-white px-4 py-2 font-label-caps text-sm focus:outline-none focus:border-electric-lime cursor-pointer"
            >
              <option value="NEWEST">SORT: NEWEST</option>
              <option value="POPULAR">SORT: POPULAR</option>
              <option value="LOW_HIGH">PRICE: LOW TO HIGH</option>
              <option value="HIGH_LOW">PRICE: HIGH TO LOW</option>
            </select>
          </div>
        </div>

        {/* Star Collection Filter Pills */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto hide-scrollbar pb-2">
          <span className="text-xs text-gray-400 font-label-caps mr-2 flex-shrink-0">STAR EDITIONS:</span>
          {STAR_COLLECTIONS.map((hero) => (
            <button
              key={hero.slug}
              onClick={() => {
                setSelectedStarFilter(selectedStarFilter === hero.slug ? '' : hero.slug);
                setPage(1);
              }}
              className={`text-xs px-3 py-1.5 rounded-sm font-label-caps font-bold transition-all flex-shrink-0 ${
                selectedStarFilter === hero.slug
                  ? 'bg-electric-lime text-black'
                  : 'bg-charcoal border border-gray-800 text-gray-300 hover:border-electric-lime'
              }`}
            >
              {hero.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <ProductFilters 
            categories={categories} 
            selectedCategories={filters.selectedCategories}
            selectedSizes={filters.selectedSizes}
            sortBy={filters.sortBy}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setPage(1);
            }} 
          />
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          <ProductGrid products={paginatedProducts} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button 
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 border flex items-center justify-center transition-colors font-bold ${
                    page === p
                      ? 'bg-electric-lime text-black border-electric-lime'
                      : 'border-charcoal text-white hover:bg-electric-lime hover:text-black hover:border-electric-lime'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-deep-black text-white flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-2 border-electric-lime border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
