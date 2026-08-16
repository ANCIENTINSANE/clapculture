'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '../cart/CartProvider';
import { MobileMenu } from './MobileMenu';
import { useStarCollections, useCollections } from '@/lib/use-api-data';

export function Header() {
  const { getCartCount, setIsDrawerOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'SHOP' | 'COLLECTIONS' | null>(null);
  const starCollections = useStarCollections();
  const { data: collections } = useCollections();

  const shopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    let mounted = true;
    if (mounted) {
      setTimeout(() => setMounted(true), 0);
    }
    return () => { mounted = false; };
  }, []);

  const handleMouseEnter = (menu: 'SHOP' | 'COLLECTIONS') => {
    if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    shopTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-deep-black/95 backdrop-blur-md border-b border-charcoal px-4 md:px-8 lg:px-12 py-3 md:py-4 flex items-center justify-between mx-auto w-full transition-all">
        
        {/* Left Side: Clean Typography Brand Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl md:text-3xl lg:text-[40px] font-headline-md text-white tracking-wider cursor-pointer">
            CLAPCULTURE
          </Link>
        </div>

        {/* Center: Desktop Navigation Links with Dropdowns */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 relative">
          
          {/* 1. SHOP Link with Mega Dropdown */}
          <div 
            className="relative py-2"
            onMouseEnter={() => handleMouseEnter('SHOP')}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              href="/shop" 
              prefetch={false}
              className={`font-nav-link text-xs xl:text-sm transition-colors flex items-center gap-1 py-1 ${
                activeDropdown === 'SHOP' ? 'text-electric-lime font-bold' : 'text-white hover:text-electric-lime'
              }`}
            >
              SHOP <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${activeDropdown === 'SHOP' ? 'rotate-180 text-electric-lime' : ''}`}>keyboard_arrow_down</span>
            </Link>

            {/* SHOP Mega Dropdown Menu */}
            {activeDropdown === 'SHOP' && (
              <div 
                className="absolute top-full left-0 w-190 bg-[#141414] border border-charcoal rounded-xl shadow-2xl p-6 grid grid-cols-12 gap-6 z-50 text-left animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseEnter={() => handleMouseEnter('SHOP')}
                onMouseLeave={handleMouseLeave}
              >
                {/* Column 1: Star Collections */}
                <div className="col-span-6 border-r border-charcoal pr-6">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-charcoal">
                    <span className="font-label-caps text-xs text-electric-lime font-bold tracking-widest uppercase">STAR COLLECTIONS</span>
                    <span className="text-[10px] text-gray-500 font-mono">TOLLYWOOD HEROES</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    {starCollections.map((hero) => (
                      <Link
                        key={hero.slug}
                        href={`/shop?star=${hero.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="group flex flex-col p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] border border-transparent hover:border-electric-lime/40 transition-all"
                      >
                        <span className="font-headline-md text-base text-white group-hover:text-electric-lime transition-colors">
                          {hero.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-label-caps mt-0.5">
                          {hero.tagline}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 2: Product Categories */}
                <div className="col-span-6 pl-2">
                  <div className="mb-4 pb-2 border-b border-charcoal">
                    <span className="font-label-caps text-xs text-electric-lime font-bold tracking-widest uppercase">CATEGORIES</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <Link href="/category/tees" onClick={() => setActiveDropdown(null)} className="text-sm text-gray-300 hover:text-electric-lime transition-colors py-1">Oversized Tees</Link>
                    <Link href="/category/outerwear" onClick={() => setActiveDropdown(null)} className="text-sm text-gray-300 hover:text-electric-lime transition-colors py-1">Hoodies & Fleece</Link>
                    <Link href="/category/bottoms" onClick={() => setActiveDropdown(null)} className="text-sm text-gray-300 hover:text-electric-lime transition-colors py-1">Cargo Pants</Link>
                    <Link href="/category/headwear" onClick={() => setActiveDropdown(null)} className="text-sm text-gray-300 hover:text-electric-lime transition-colors py-1">Caps & Headwear</Link>
                  </div>

                  <div className="mt-6 pt-4 border-t border-charcoal flex items-center justify-between">
                    <span className="text-xs text-gray-400">Looking for custom fits?</span>
                    <Link href="/shop" onClick={() => setActiveDropdown(null)} className="text-xs font-bold text-electric-lime hover:underline uppercase tracking-wider">
                      VIEW ALL DROPS →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. COLLECTIONS Link with Dropdown */}
          <div 
            className="relative py-2"
            onMouseEnter={() => handleMouseEnter('COLLECTIONS')}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              href="/collections" 
              prefetch={false}
              className={`font-nav-link text-xs xl:text-sm transition-colors flex items-center gap-1 py-1 ${
                activeDropdown === 'COLLECTIONS' ? 'text-electric-lime font-bold' : 'text-white hover:text-electric-lime'
              }`}
            >
              COLLECTIONS <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${activeDropdown === 'COLLECTIONS' ? 'rotate-180 text-electric-lime' : ''}`}>keyboard_arrow_down</span>
            </Link>

            {/* COLLECTIONS Dropdown Menu */}
            {activeDropdown === 'COLLECTIONS' && (
              <div 
                className="absolute top-full left-0 w-64 bg-[#141414] border border-charcoal rounded-xl shadow-2xl p-4 z-50 text-left animate-in fade-in slide-in-from-top-1 duration-150 space-y-1"
                onMouseEnter={() => handleMouseEnter('COLLECTIONS')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="mb-2 pb-1 border-b border-charcoal px-2">
                  <span className="font-label-caps text-[11px] text-electric-lime font-bold tracking-widest uppercase">FEATURED CURATIONS</span>
                </div>
                {collections.slice(0, 5).map((col) => {
                  const colId = col.id || (col as unknown as Record<string, string>).$id;
                  return (
                    <Link
                      key={colId}
                      href={`/collections/${col.slug}`}
                      prefetch={false}
                      onClick={() => setActiveDropdown(null)}
                      className="block px-3 py-2 text-sm text-gray-300 hover:bg-[#242424] hover:text-electric-lime rounded transition-colors font-medium"
                    >
                      {col.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link href="/collections/new-drop" prefetch={false} className="font-nav-link text-xs xl:text-sm hover:text-electric-lime transition-colors">NEW ARRIVALS</Link>
          <Link href="/collections/best-sellers" prefetch={false} className="font-nav-link text-xs xl:text-sm hover:text-electric-lime transition-colors">BEST SELLERS</Link>
          <Link href="/about" prefetch={false} className="font-nav-link text-xs xl:text-sm hover:text-electric-lime transition-colors">ABOUT US</Link>
        </div>

        {/* Right Side: Search, Cart, AND Hamburger Menu */}
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/search" prefetch={false} className="hidden sm:block text-white hover:text-electric-lime transition-colors">
            <span className="material-symbols-outlined text-xl md:text-2xl">search</span>
          </Link>
          
          {/* Shopping Cart Drawer Trigger */}
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="text-white hover:text-electric-lime transition-colors relative"
            aria-label="Open cart"
          >
            <span className="material-symbols-outlined text-xl md:text-2xl">shopping_bag</span>
            {mounted && getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 md:-right-2 bg-electric-lime text-deep-black text-[9px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>

          {/* HAMBURGER MENU BUTTON MOVED TO RIGHT SIDE */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-white hover:text-electric-lime transition-colors ml-1"
            aria-label="Open mobile menu"
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl">menu</span>
          </button>
        </div>
      </nav>
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
