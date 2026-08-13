'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PromoBar } from '@/components/layout/PromoBar';
import { useCart } from '@/components/cart/CartProvider';

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    // Simulate page load progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 500);
      }
      setProgress(Math.min(currentProgress, 100));
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const heroSlides = [1, 2, 3];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev >= heroSlides.length ? 1 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* PRELOADER */}
      <div 
        className={`fixed inset-0 z-[99999] bg-deep-black flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${isLoading ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <div className="relative text-5xl md:text-8xl lg:text-[120px] font-headline-xl uppercase tracking-widest text-center px-4 select-none">
           {/* Base Text (Outline) */}
           <div className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }}>
             CLAPCULTURE
           </div>
           
           {/* Liquid Fill Text */}
           <div 
             className="absolute top-0 left-0 w-full text-center text-electric-lime transition-all duration-300 ease-out overflow-hidden"
             style={{ clipPath: `inset(calc(100% - ${progress}%) 0 0 0)` }}
           >
             CLAPCULTURE
           </div>
        </div>
        
        <div className="mt-8 text-electric-lime font-headline-md text-2xl tracking-widest">
          {Math.round(progress)}%
        </div>
        
        <div className="absolute bottom-8 text-[10px] md:text-xs font-label-caps tracking-[0.3em] text-gray-500 uppercase text-center w-full">
          Design and developed by <a href="https://vcard.stemlen.com/u/surendra" target="_blank" rel="noopener noreferrer" className="text-electric-lime hover:underline font-bold">surendra.codes</a>
        </div>
      </div>

      {/* MAIN PAGE CONTENT */}
      <div className={`min-h-screen bg-deep-black text-white font-body-sm flex flex-col transition-opacity duration-1000 delay-200 ${isLoading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        
        {/* 1. PROMO BAR */}
        <PromoBar />

        {/* 2. TOP NAVBAR (Sticky header with interactive Mega Dropdown) */}
        <Header />

        {/* 3. HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[85vh]">
          {/* Left main hero (8 cols) */}
          <div className="lg:col-span-8 relative flex flex-col justify-center p-6 md:p-12 xl:p-16 2xl:p-24 overflow-hidden min-h-[60vh] lg:min-h-0 bg-charcoal">
            {/* Background Slideshow */}
            {heroSlides.map((slideNum) => (
              <React.Fragment key={slideNum}>
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out lg:hidden ${currentHeroSlide === slideNum ? 'opacity-100' : 'opacity-0'}`}
                  style={{ backgroundImage: `url('/herobg${slideNum}-mobile.png')` }}
                />
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out hidden lg:block ${currentHeroSlide === slideNum ? 'opacity-100' : 'opacity-0'}`}
                  style={{ backgroundImage: `url('/herobg${slideNum}-desktop.png')` }}
                />
              </React.Fragment>
            ))}

            <div className="absolute inset-0 bg-gradient-to-r from-deep-black/90 md:from-deep-black/80 to-transparent"></div>

            <div className="relative z-10 max-w-2xl 2xl:max-w-4xl mt-12 md:mt-0">
              <div className="inline-block bg-electric-lime text-deep-black font-label-caps text-[10px] md:text-xs px-2.5 py-1 mb-4 md:mb-6 rounded-sm uppercase font-bold tracking-wider">
                NEW DROP LIVE
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[120px] 2xl:text-[160px] font-hero-lg leading-none uppercase mb-2">
                BORN TO <br />
                STAND OUT
              </h1>

              <div className="text-5xl md:text-6xl lg:text-[80px] 2xl:text-[100px] font-headline-xl text-transparent mb-4 md:mb-6 tracking-wide" style={{ WebkitTextStroke: '2px #b0ff00' }}>
                CLAP CULTURE
              </div>

              <p className="text-sm md:text-base 2xl:text-xl text-gray-300 mb-6 md:mb-8 max-w-[280px] md:max-w-md 2xl:max-w-xl">
                Unapologetic streetwear for the modern rebel. Elevate your everyday fit with our latest exclusive collection.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
                <Link href="/shop" className="w-full sm:w-auto bg-electric-lime text-deep-black font-label-caps text-xs md:text-sm px-6 py-3 md:px-8 md:py-4 uppercase font-bold hover:bg-white transition-colors text-center">
                  SHOP NOW
                </Link>
                <Link href="/collections" className="w-full sm:w-auto border border-white text-white font-label-caps text-xs md:text-sm px-6 py-3 md:px-8 md:py-4 uppercase font-bold hover:bg-white/10 transition-colors text-center">
                  EXPLORE COLLECTIONS
                </Link>
              </div>

              {/* HERO SOCIAL PROOF STAT BADGE: 2,000+ HAPPY FANS */}
              <div className="flex items-center gap-4 mt-10 p-3 bg-black/40 backdrop-blur-md rounded-xl border border-gray-800 w-fit">
                <div className="flex -space-x-3">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Fan 1" className="w-10 h-10 rounded-full border-2 border-deep-black object-cover" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Fan 2" className="w-10 h-10 rounded-full border-2 border-deep-black object-cover" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Fan 3" className="w-10 h-10 rounded-full border-2 border-deep-black object-cover" />
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Fan 4" className="w-10 h-10 rounded-full border-2 border-deep-black object-cover" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm flex items-center gap-1.5 font-label-caps">
                    <span className="text-electric-lime text-base font-extrabold">2,000+</span> HAPPY FANS
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <span className="text-electric-lime font-bold">★★★★★</span> 4.9/5 RATING
                  </div>
                </div>
              </div>

            </div>

            {/* Thumbnails */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10 hidden md:flex">
              {heroSlides.map((slideNum) => (
                <img 
                  key={slideNum}
                  src={`/herobg${slideNum}-desktop.png`} 
                  alt={`Thumb ${slideNum}`} 
                  onClick={() => setCurrentHeroSlide(slideNum)}
                  className={`w-20 h-24 object-cover border-2 transition-all cursor-pointer hover:opacity-100 hover:border-electric-lime ${currentHeroSlide === slideNum ? 'border-electric-lime opacity-100' : 'border-transparent opacity-70'}`} 
                />
              ))}
            </div>
          </div>

          {/* Right Hero Side Banner */}
          <div className="lg:col-span-4 relative bg-charcoal flex flex-col justify-between p-6 md:p-12 xl:p-16 border-t lg:border-t-0 lg:border-l border-charcoal overflow-hidden min-h-[40vh] lg:min-h-0">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-700 hover:scale-105"
              style={{ backgroundImage: `url('/herobg1-desktop.png')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/60 to-transparent"></div>

            <div className="relative z-10">
              <span className="bg-electric-lime text-deep-black font-label-caps text-[10px] px-2 py-1 uppercase font-bold tracking-wider">
                TRENDING NOW
              </span>
            </div>

            <div className="relative z-10 mt-auto">
              <h2 className="text-3xl md:text-5xl font-headline-xl uppercase text-white mb-2">
                OVERSIZED <br />COLLECTION
              </h2>
              <p className="text-xs md:text-sm text-gray-300 mb-4 max-w-xs">
                Heavyweight cotton blanks engineered for maximum comfort and durability.
              </p>
              <Link href="/category/tees" className="font-label-caps text-xs text-electric-lime uppercase font-bold flex items-center gap-1 hover:underline">
                SHOP OVERSIZED <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 4. CATEGORY GRID SECTION */}
        <section className="py-16 md:py-24 px-4 md:px-8 lg:px-12 2xl:px-16 bg-deep-black">
          <div className="max-w-[3840px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4">
              <div>
                <span className="font-label-caps text-xs md:text-sm text-electric-lime tracking-widest uppercase">CATEGORIES</span>
                <h2 className="text-4xl md:text-6xl 2xl:text-8xl font-headline-xl uppercase tracking-wider text-white mt-1">
                  EXPLORE THE LINEUP
                </h2>
              </div>
              <Link href="/shop" className="font-label-caps text-xs md:text-sm text-gray-400 hover:text-electric-lime flex items-center gap-1 transition-colors">
                VIEW ALL CATEGORIES <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { name: 'TEES', slug: 'tees', desc: 'Heavyweight graphic blanks', img: '/herobg1-desktop.png' },
                { name: 'OUTERWEAR', slug: 'outerwear', desc: 'Fleece hoodies & jackets', img: '/herobg2-desktop.png' },
                { name: 'BOTTOMS', slug: 'bottoms', desc: 'Tactical cargo utility', img: '/herobg3-desktop.png' },
                { name: 'HEADWEAR', slug: 'headwear', desc: 'Snapbacks & caps', img: '/herobg1-mobile.png' }
              ].map((cat, idx) => (
                <Link 
                  key={idx} 
                  href={`/category/${cat.slug}`}
                  className="group relative aspect-[3/4] bg-charcoal overflow-hidden border border-charcoal flex flex-col justify-end p-4 md:p-6"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700" 
                    style={{ backgroundImage: `url('${cat.img}')` }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/30 to-transparent"></div>
                  
                  <div className="relative z-10">
                    <h3 className="font-headline-md text-2xl md:text-4xl uppercase text-white group-hover:text-electric-lime transition-colors">{cat.name}</h3>
                    <p className="text-[10px] md:text-xs text-gray-400 font-label-caps mt-1">{cat.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4.5. EXPLORE STAR COLLECTION SECTION (Tollywood Heroes) */}
        <section className="py-16 md:py-24 px-4 md:px-8 lg:px-12 2xl:px-16 bg-charcoal/20 border-t border-charcoal">
          <div className="max-w-[3840px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4">
              <div>
                <span className="font-label-caps text-xs md:text-sm text-electric-lime tracking-widest uppercase">TOLLYWOOD LEGENDS</span>
                <h2 className="text-4xl md:text-6xl 2xl:text-8xl font-headline-xl uppercase tracking-wider text-white mt-1">
                  EXPLORE STAR COLLECTION
                </h2>
              </div>
              <Link href="/shop" className="font-label-caps text-xs md:text-sm text-gray-400 hover:text-electric-lime flex items-center gap-1 transition-colors">
                VIEW ALL HERO EDITIONS <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Pawan Kalyan', slug: 'pawan-kalyan', tagline: 'SENANI & OG ERA FITS', count: '12 DROPS', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80' },
                { name: 'Mahesh Babu', slug: 'mahesh-babu', tagline: 'PRINCE SLEEK STREETWEAR', count: '10 DROPS', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80' },
                { name: 'Prabhas', slug: 'prabhas', tagline: 'REBEL STAR HEAVYWEIGHT FITS', count: '14 DROPS', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80' },
                { name: 'Allu Arjun', slug: 'allu-arjun', tagline: 'ICON STAR PUSHPA EDITION', count: '15 DROPS', img: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80' },
              ].map((hero) => (
                <Link 
                  key={hero.slug}
                  href={`/shop?star=${hero.slug}`}
                  className="group relative aspect-[4/5] bg-charcoal overflow-hidden border border-charcoal flex flex-col justify-between p-6 md:p-8"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700" 
                    style={{ backgroundImage: `url('${hero.img}')` }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/40 to-transparent"></div>

                  <div className="relative z-10 flex justify-between items-start">
                    <span className="bg-electric-lime text-deep-black font-label-caps text-[9px] md:text-[10px] px-2 py-0.5 font-bold uppercase">
                      {hero.count}
                    </span>
                    <span className="material-symbols-outlined text-white text-2xl group-hover:text-electric-lime transition-colors">arrow_outward</span>
                  </div>
                  
                  <div className="relative z-10">
                    <span className="text-[10px] md:text-xs text-electric-lime font-label-caps tracking-widest">{hero.tagline}</span>
                    <h3 className="font-headline-xl text-3xl md:text-5xl uppercase text-white mt-1 group-hover:text-electric-lime transition-colors">{hero.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 5. FEATURED DROPS CAROUSEL */}
        <section className="py-16 md:py-24 px-4 md:px-8 lg:px-12 2xl:px-16 bg-charcoal/30 border-y border-charcoal">
          <div className="max-w-[3840px] mx-auto">
            <div className="flex justify-between items-end mb-10 md:mb-16">
              <div>
                <span className="font-label-caps text-xs md:text-sm text-electric-lime tracking-widest uppercase">CURATED SELECTION</span>
                <h2 className="text-4xl md:text-6xl 2xl:text-8xl font-headline-xl uppercase tracking-wider text-white mt-1">
                  FEATURED DROPS
                </h2>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <button 
                  onClick={scrollLeft}
                  className="w-10 h-10 md:w-12 md:h-12 border border-charcoal flex items-center justify-center hover:bg-electric-lime hover:text-black hover:border-electric-lime transition-colors"
                  aria-label="Scroll left"
                >
                  <span className="material-symbols-outlined text-lg md:text-xl">arrow_back</span>
                </button>
                <button 
                  onClick={scrollRight}
                  className="w-10 h-10 md:w-12 md:h-12 border border-charcoal flex items-center justify-center hover:bg-electric-lime hover:text-black hover:border-electric-lime transition-colors"
                  aria-label="Scroll right"
                >
                  <span className="material-symbols-outlined text-lg md:text-xl">arrow_forward</span>
                </button>
              </div>
            </div>

            <div 
              ref={scrollContainerRef}
              className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-6 scroll-smooth"
            >
              {[
                { id: '1', name: 'STREET NINJA OVERSIZED TEE', slug: 'street-ninja-oversized-tee', price: 1299, compareAtPrice: 1999, img: '/herobg1-desktop.png', badge: 'NEW' },
                { id: '2', name: 'TOLLYWOOD LEGENDS HOODIE', slug: 'tollywood-legends-hoodie', price: 2499, compareAtPrice: 3499, img: '/herobg2-desktop.png', badge: 'LIMITED' },
                { id: '3', name: 'NEON MATRIX CARGO PANTS', slug: 'neon-matrix-cargo-pants', price: 2999, compareAtPrice: 3999, img: '/herobg3-desktop.png', badge: 'BEST SELLER' },
                { id: '4', name: 'ACID WASH GRUNGE TEE', slug: 'acid-wash-grunge-tee', price: 999, compareAtPrice: 1499, img: '/herobg1-mobile.png', badge: 'NEW' },
              ].map((product) => (
                <div key={product.id} className="w-[260px] md:w-[320px] flex-shrink-0 group">
                  <div className="relative aspect-[3/4] bg-charcoal overflow-hidden border border-charcoal mb-4">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-electric-lime text-deep-black font-label-caps text-[9px] md:text-[10px] px-2 py-0.5 font-bold uppercase">
                        {product.badge}
                      </span>
                    )}
                    <button 
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        description: '',
                        images: [product.img],
                        sizes: ['M'],
                        stock: 10,
                        categoryId: 'c1'
                      }, 'M', 1)}
                      className="absolute bottom-3 left-3 right-3 bg-white text-black font-label-caps text-xs py-3 uppercase font-bold hover:bg-electric-lime transition-colors opacity-0 group-hover:opacity-100"
                    >
                      QUICK ADD
                    </button>
                  </div>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-bold text-sm md:text-base text-white group-hover:text-electric-lime transition-colors truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-electric-lime font-bold text-sm md:text-base">₹{product.price}</span>
                      {product.compareAtPrice && (
                        <span className="text-gray-500 line-through text-xs md:text-sm">₹{product.compareAtPrice}</span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. NEWSLETTER SECTION */}
        <section className="py-16 md:py-24 px-4 md:px-8 lg:px-12 2xl:px-16 bg-deep-black border-y border-charcoal flex flex-col items-center text-center w-full">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2 md:mb-4">
            <h2 className="text-4xl sm:text-5xl md:text-7xl 2xl:text-[100px] font-headline-xl uppercase italic leading-none">JOIN THE CULTURE</h2>
            <span className="material-symbols-outlined text-electric-lime text-3xl sm:text-4xl md:text-5xl 2xl:text-[80px]">energy_program_time</span>
          </div>
          <p className="text-xs sm:text-sm md:text-base 2xl:text-xl text-gray-400 mb-8 md:mb-10 max-w-sm md:max-w-md 2xl:max-w-2xl px-4">Exclusive drops, early access & more straight to your inbox.</p>

          <div className="w-full max-w-sm md:max-w-lg 2xl:max-w-2xl flex flex-col sm:flex-row gap-3 md:gap-4 mb-12 md:mb-16">
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              className="flex-1 bg-transparent border border-charcoal text-white text-sm 2xl:text-lg px-4 md:px-6 py-3 md:py-4 focus:outline-none focus:border-electric-lime placeholder:text-gray-600"
            />
            <button className="bg-electric-lime text-deep-black text-sm 2xl:text-lg font-bold uppercase tracking-wider px-6 md:px-8 py-3 md:py-4 hover:bg-white transition-colors">
              SUBSCRIBE
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-16 w-full max-w-4xl 2xl:max-w-6xl mx-auto divide-y sm:divide-y-0 sm:divide-x divide-charcoal">
            <div className="pt-4 sm:pt-0 w-full sm:w-auto">
              <div className="font-bold uppercase tracking-wider text-xs md:text-sm 2xl:text-xl">Over 2,000+</div>
              <div className="text-gray-400 text-[10px] md:text-xs 2xl:text-sm mt-1">HAPPY FANS</div>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-8 md:pl-16 w-full sm:w-auto">
              <div className="font-bold uppercase tracking-wider text-xs md:text-sm 2xl:text-xl flex items-center justify-center gap-1">
                4.9/5 <span className="text-electric-lime text-[10px] md:text-xs 2xl:text-sm">★★★★★</span>
              </div>
              <div className="text-gray-400 text-[10px] md:text-xs 2xl:text-sm mt-1">CUSTOMER RATING</div>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-8 md:pl-16 w-full sm:w-auto flex flex-col items-center">
              <div className="font-bold uppercase tracking-wider text-xs md:text-sm 2xl:text-xl flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-electric-lime text-xs md:text-sm 2xl:text-xl">local_shipping</span>
                PAN INDIA
              </div>
              <div className="text-gray-400 text-[10px] md:text-xs 2xl:text-sm mt-1">EXPRESS SHIPPING</div>
            </div>
          </div>
        </section>

        {/* 7. FOOTER */}
        <Footer />
      </div>
    </>
  );
}
