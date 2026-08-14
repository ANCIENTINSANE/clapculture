'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useProducts, useCategories, useStarCollections } from '@/lib/use-api-data';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters, FilterState } from '@/components/product/ProductFilters';

function ShopContent() {
  const searchParams = useSearchParams();
  const starParam = searchParams.get('star') || '';

  const { data: products, loading: productsLoading } = useProducts();
  const { data: categories } = useCategories();
  const starCollections = useStarCollections();

  const [search, setSearch] = useState('');
  const [userSelectedStar, setUserSelectedStar] = useState<string | null>(null);
  const selectedStarFilter = userSelectedStar !== null ? userSelectedStar : starParam;

  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    selectedSizes: [],
    sortBy: 'NEWEST',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const categoryNames = useMemo(() => categories.map((c) => c.name), [categories]);

  const activeStarHero = useMemo(() => {
    return starCollections.find((h) => h.slug === selectedStarFilter);
  }, [selectedStarFilter, starCollections]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Star Hero filter
    if (selectedStarFilter) {
      const heroSlug = selectedStarFilter.toLowerCase();
      const heroName = activeStarHero ? activeStarHero.name.toLowerCase() : heroSlug.replace('-', ' ');
      result = result.filter((p) => {
        const badges = (p.badges || []).map((b) => b.toLowerCase());
        const name = p.name.toLowerCase();
        const combined = `${name} ${badges.join(' ')}`;

        if (heroSlug === 'pawan-kalyan' || heroName.includes('pawan')) {
          return (
            badges.includes('pawan kalyan') ||
            badges.includes('power star') ||
            badges.includes('senani') ||
            badges.includes('og') ||
            badges.includes('pspk') ||
            /\b(pawan|kalyan|senani|power star|pspk|hungry cheetah|they call him og)\b/i.test(combined) ||
            /\bog\b/i.test(name)
          );
        }
        if (heroSlug === 'mahesh-babu' || heroName.includes('mahesh')) {
          return (
            badges.includes('mahesh babu') ||
            badges.includes('superstar') ||
            badges.includes('pokiri') ||
            badges.includes('ssmb') ||
            /\b(mahesh|babu|ssmb|superstar|pokiri|guntur kaaram|murari|khaleja|okkadhu)\b/i.test(combined)
          );
        }
        if (heroSlug === 'prabhas' || heroName.includes('prabhas')) {
          return (
            badges.includes('prabhas') ||
            badges.includes('rebel star') ||
            badges.includes('darling') ||
            badges.includes('salaar') ||
            badges.includes('raja saab') ||
            /\b(prabhas|salaar|rebel star|darling|raja saab|kalki|bahubali|mirchi)\b/i.test(combined)
          );
        }
        if (heroSlug === 'allu-arjun' || heroName.includes('allu')) {
          return (
            badges.includes('allu arjun') ||
            badges.includes('icon star') ||
            badges.includes('pushpa') ||
            badges.includes('aa rule') ||
            /\b(allu arjun|pushpa|icon star|aa rule|bunny|aryaa|dj|sarrainodu)\b/i.test(combined)
          );
        }
        if (heroSlug === 'ram-charan' || heroName.includes('charan')) {
          return (
            badges.includes('ram charan') ||
            badges.includes('global star') ||
            badges.includes('game changer') ||
            /\b(ram charan|global star|mega power star|game changer|magadheera|dhruva|rc15)\b/i.test(combined)
          );
        }
        if (heroSlug === 'ntr' || heroSlug === 'ntr-jr' || heroName.includes('ntr')) {
          return (
            badges.includes('jr ntr') ||
            badges.includes('ntr') ||
            badges.includes('man of masses') ||
            badges.includes('devara') ||
            /\b(ntr|jr ntr|devara|man of masses|tarak|young tiger|janatha garage|simhadri)\b/i.test(combined)
          );
        }
        return (
          badges.some((b) => b.includes(heroName) || heroName.includes(b)) ||
          name.includes(heroName)
        );
      });
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
      const categoryMap = new Map(categories.map((c) => [c.name, c.id || (c as unknown as Record<string, string>).$id]));
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
        result.sort((a) => (a.badges?.includes('NEW') ? -1 : 1));
        break;
    }

    return result;
  }, [search, filters, selectedStarFilter, activeStarHero, products, categories]);

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
          <Link href="/shop" onClick={() => setUserSelectedStar('')} className="hover:text-electric-lime transition-colors">SHOP</Link>
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
                onClick={() => setUserSelectedStar('')}
                className="bg-charcoal text-xs text-electric-lime border border-electric-lime px-3 py-2 font-label-caps hover:bg-electric-lime hover:text-black transition-colors"
              >
                CLEAR STAR FILTER ×
              </button>
            )}

            <div className="relative grow md:w-64">
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
          <span className="text-xs text-gray-400 font-label-caps mr-2 shrink-0">STAR EDITIONS:</span>
          {starCollections.map((hero) => (
            <button
              key={hero.slug}
              onClick={() => {
                setUserSelectedStar(selectedStarFilter === hero.slug ? '' : hero.slug);
                setPage(1);
              }}
              className={`text-xs px-3 py-1.5 rounded-sm font-label-caps font-bold transition-all shrink-0 ${
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
        <div className="w-full md:w-64 shrink-0">
          <ProductFilters 
            categories={categoryNames} 
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
        <div className="grow">
          {productsLoading && products.length === 0 ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-electric-lime border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ProductGrid products={paginatedProducts} />
          )}
          
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
