'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(1);
  const heroSlides = [1, 2, 3]; // Add or remove numbers here based on how many background images you have

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev >= heroSlides.length ? 1 : prev + 1));
    }, 4000); // Change slide every 4 seconds
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
    <div className="min-h-screen bg-deep-black text-white font-body-sm flex flex-col">
      {/* 1. PROMO BAR */}
      <div className="bg-deep-black border-b border-charcoal py-2 px-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center w-full">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="material-symbols-outlined text-electric-lime text-[10px] sm:text-sm">bolt</span>
          <span className="font-label-caps text-[10px] sm:text-xs text-white">FREE SHIPPING ON ORDERS ABOVE ₹999</span>
        </div>
        <a href="#" className="font-label-caps text-[10px] sm:text-xs text-electric-lime flex items-center gap-1 hover:underline sm:ml-2">
          SHOP NOW <span className="material-symbols-outlined text-[10px] sm:text-sm">arrow_forward</span>
        </a>
      </div>

      {/* 2. TOP NAVBAR (sticky) */}
      <nav className="sticky top-0 z-50 bg-deep-black/80 backdrop-blur-md border-b border-charcoal px-4 md:px-8 lg:px-12 py-3 md:py-4 flex items-center justify-between mx-auto w-full">
        <div className="flex items-center gap-2 lg:gap-0">
          <button className="lg:hidden text-white hover:text-electric-lime transition-colors">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <div className="text-2xl md:text-3xl lg:text-[40px] font-headline-md text-white tracking-wider cursor-pointer">
            CLAPCULTURE®
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <a href="#" className="font-nav-link text-xs xl:text-sm hover:text-electric-lime transition-colors flex items-center gap-1">
            SHOP <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          </a>
          <a href="#" className="font-nav-link text-xs xl:text-sm hover:text-electric-lime transition-colors">COLLECTIONS</a>
          <a href="#" className="font-nav-link text-xs xl:text-sm hover:text-electric-lime transition-colors">NEW ARRIVALS</a>
          <a href="#" className="font-nav-link text-xs xl:text-sm hover:text-electric-lime transition-colors">BEST SELLERS</a>
          <a href="#" className="font-nav-link text-xs xl:text-sm hover:text-electric-lime transition-colors">ABOUT US</a>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button className="hidden sm:block text-white hover:text-electric-lime transition-colors">
            <span className="material-symbols-outlined text-xl md:text-2xl">search</span>
          </button>
          <button className="hidden sm:block text-white hover:text-electric-lime transition-colors">
            <span className="material-symbols-outlined text-xl md:text-2xl">person</span>
          </button>
          <button className="text-white hover:text-electric-lime transition-colors">
            <span className="material-symbols-outlined text-xl md:text-2xl">favorite</span>
          </button>
          <button className="text-white hover:text-electric-lime transition-colors relative">
            <span className="material-symbols-outlined text-xl md:text-2xl">shopping_bag</span>
            <span className="absolute -top-1 -right-1 md:-right-2 bg-electric-lime text-deep-black text-[9px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[85vh]">
        {/* Left main hero (8 cols) */}
        <div
          className="lg:col-span-8 relative flex flex-col justify-center p-6 md:p-12 xl:p-16 2xl:p-24 overflow-hidden min-h-[60vh] lg:min-h-0 bg-charcoal"
        >
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
            <div className="inline-block bg-electric-lime text-deep-black font-label-caps text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1 mb-4 md:mb-6 rounded-sm uppercase font-bold tracking-wider">
              NEW DROP LIVE
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[120px] 2xl:text-[160px] font-hero-lg leading-none uppercase mb-2">
              BORN TO <br />
              STAND OUT
            </h1>

            <div className="text-5xl md:text-6xl lg:text-[80px] 2xl:text-[100px] font-headline-xl text-transparent mb-4 md:mb-6 tracking-wide" style={{ WebkitTextStroke: '2px #b0ff00' }}>
              CLAP CULTURE.
            </div>

            <p className="text-sm md:text-base 2xl:text-xl text-gray-300 mb-6 md:mb-8 max-w-[280px] md:max-w-md 2xl:max-w-xl">
              Unapologetic streetwear for the modern rebel. Elevate your everyday fit with our latest exclusive collection.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
              <button className="w-full sm:w-auto bg-electric-lime text-deep-black font-label-caps text-xs md:text-sm px-6 py-3 md:px-8 md:py-4 uppercase font-bold hover:bg-white transition-colors text-center">
                SHOP NOW
              </button>
              <button className="w-full sm:w-auto border border-white text-white font-label-caps text-xs md:text-sm px-6 py-3 md:px-8 md:py-4 uppercase font-bold hover:bg-white/10 transition-colors text-center">
                EXPLORE COLLECTIONS
              </button>
            </div>

            <div className="flex items-center gap-4 mt-12">
              <div className="flex -space-x-3">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfn_ofX2oZsPlhufhCB-I8q-0J1YJQH9BTruPbzTQ0mV3sj0x7FJhl22P9SNZozFAodY_Y7ihr2NaE-oj_9rPYb5ik5DTb8WpHnTxGRlUmaHZkr3CNhjViD7Aj8c4N0UtGrFGS6jW41bWf9zWUbY4FzB1qWnlWCO-sQSTeT5OofZhjfc7U761nhiPAbpdj3LU_vqlZ4pBYHVSJqvjY3R99zDDMqKvSw2dRJiGyZ083FH00kqWnu1b1zA" alt="Avatar 1" className="w-10 h-10 rounded-full border-2 border-deep-black object-cover" />
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA71Z_GEWQT5S1X0Q5wdnsnTlQ9uXgLDBIWeFRrnWYnbnLXw5FEylscWcOXLb6S-qJSnkpiT5Ri7szamhHKUTSYSVXoawxqf7vSXpaOGgON8M_vXMXgzKHWkYAn0Q7P5ZBhU-FMFdXJ3kVKZWDZApz4Qq-hioDJWRnU8PcxsTgCPKotumDeIdTF7nM52CqATuEYmx1Qd7VvdYKfu7yvqmyzDmgPx_9u0QlN2rsEvVPiKzbxQ3n_wCqlEg" alt="Avatar 2" className="w-10 h-10 rounded-full border-2 border-deep-black object-cover" />
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkG07ubHXzqXf0lPWk9DtpBFRbN0Qj7MgwdBEg1cl_J3Tpd27kzfwqaDiDPkQq0veIOxPsg2SHDKhinLjsGSSrljJJMJ7kdWurynmd5ADh-Fhata_VuSiRTnHrAA8Y2zyU0hlU9HKdr44zDIMLt3eXYWgCEk7gFpvuoirAEpMoy6_H_6C5qMtWaOn1XIyYFrwjNq2yTgn1Flx2hE4GjL3Mf9N_3RVbfKY9OcDFFV-1Zvun1Ued5UmwfQ" alt="Avatar 3" className="w-10 h-10 rounded-full border-2 border-deep-black object-cover" />
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj5m0JU6Zp1QT52LmERfTe08-P2Faa3lqhG-i_rvTpioelMXqQABydNCiL8RC1OH24pAL9-eTHDgQyXREcY9BfbQs4ecOhTb3L1qDtPH9iYs6hElc0diKQJ1vdwX-yEeCdETXSlrbYctdaKACSGDxJTWfyzmUoMO4jhiZ0bo5yY9GCDRaZVduKWPtwKv2bJvu7nPES4EOPKq7NSb2XCAcnol2Z-DXoGR2JC4xT92HC_SQ4NxmgUr4_1g" alt="Avatar 4" className="w-10 h-10 rounded-full border-2 border-deep-black object-cover" />
              </div>
              <div className="text-sm font-semibold">
                <span className="text-white">50K+</span> <span className="text-gray-400">Happy Rebels</span>
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

          {/* Scroll text */}
          <div className="absolute left-8 bottom-32 -rotate-90 origin-left flex items-center gap-2 z-10 text-xs font-label-caps tracking-[0.2em] uppercase text-gray-400 hidden md:flex">
            SCROLL TO EXPLORE <span className="material-symbols-outlined text-sm rotate-90">arrow_forward</span>
          </div>
        </div>

        {/* Right side (4 cols) - Two stacked cards */}
        <div className="lg:col-span-4 flex flex-col h-full sm:flex-row lg:flex-col">
          {/* Top card */}
          <div
            className="flex-1 relative bg-charcoal bg-cover bg-center overflow-hidden min-h-[300px] 2xl:min-h-[400px]"
            style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAf7yBNNzRAmCGxDXoyYX0RIngVXdel7oiQ1T1L5fjLkz3e-RKHfXAVmnJFKnEXspbRSqn1DVM5-KE98kYju8rt6ZqLQTcYNW0vJGTCfpQdw9QLF4sQAOaH347xoSAK0G9TroA1ZrzNu0x5YtMIRwHfpW39YvAl3KuZo9S7rRUosn5Wz2Fk8vK8PCdEcnehTMzIOVscn0JUIp_ylvVc7XOzdFk6VKv4CjY-h-ftqOmhL39K3sXtC0povA)' }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-dashed border-white flex items-center justify-center text-center p-4 backdrop-blur-sm bg-black/30 animate-[spin_20s_linear_infinite]">
                <span className="font-headline-md text-lg md:text-xl uppercase leading-tight">REAL CULTURE<br />NOT JUST<br />MERCH</span>
              </div>
            </div>
          </div>

          {/* Bottom card */}
          <div className="flex-1 bg-[#2C1A4D] relative overflow-hidden p-6 md:p-8 flex flex-col justify-end min-h-[300px] 2xl:min-h-[400px]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7mJ3S4UcEzW6vCkhkhrB64sNEGTmltYvlmb8wRyMA5m0ydC_qcpXjS9pLYczFt89T5M8eNGeDBljIW2ZHl8MrhFIoehczW0s2ukwN1lMIoJQqdFK6eQaQ1vegbnBKpoz7FKhtfNJh7PrnVdJRjmaLHjQvGKC3lg_Vp71O47gwbAhSs6zJvtK8KzxPPsYE2W5ixmxmwWY3n1DJENtvsegxOmCa5-iKvvXQGxOXc_66wA_XDGYrtXXq2A"
              alt="Yellow Cap"
              className="absolute top-4 right-4 w-40 md:w-48 2xl:w-64 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500"
            />
            <div className="relative z-10 mt-auto">
              <h3 className="text-4xl md:text-5xl lg:text-[80px] font-headline-xl text-white uppercase leading-none mb-2">
                LIMITED<br className="hidden lg:block" /> DROP
              </h3>
              <p className="text-electric-lime font-bold uppercase tracking-wider text-xs md:text-sm mb-4">
                GRAB IT BEFORE IT{"'"}S GONE!
              </p>
              <button className="bg-white text-deep-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-electric-lime transition-colors">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST STRIP */}
      <section className="border-y border-charcoal bg-deep-black overflow-x-auto py-6">
        <div className="flex items-center min-w-max px-margin-desktop divide-x divide-charcoal">
          <div className="flex items-center gap-4 px-8 first:pl-0">
            <span className="material-symbols-outlined text-electric-lime text-3xl">diamond</span>
            <div>
              <div className="font-bold uppercase tracking-wider text-sm">PREMIUM QUALITY</div>
              <div className="text-gray-400 text-xs">Top tier materials only</div>
            </div>
          </div>
          <div className="flex items-center gap-4 px-8">
            <span className="material-symbols-outlined text-electric-lime text-3xl">lock</span>
            <div>
              <div className="font-bold uppercase tracking-wider text-sm">SECURE PAYMENTS</div>
              <div className="text-gray-400 text-xs">100% safe checkout</div>
            </div>
          </div>
          <div className="flex items-center gap-4 px-8">
            <span className="material-symbols-outlined text-electric-lime text-3xl">sync</span>
            <div>
              <div className="font-bold uppercase tracking-wider text-sm">EASY RETURNS</div>
              <div className="text-gray-400 text-xs">7-day hassle free</div>
            </div>
          </div>
          <div className="flex items-center gap-4 px-8">
            <span className="material-symbols-outlined text-electric-lime text-3xl">star</span>
            <div>
              <div className="font-bold uppercase tracking-wider text-sm">EXCLUSIVE DROPS</div>
              <div className="text-gray-400 text-xs">Members get early access</div>
            </div>
          </div>
          <div className="flex items-center gap-4 px-8 pr-0 border-r-0">
            <span className="material-symbols-outlined text-electric-lime text-3xl">support_agent</span>
            <div>
              <div className="font-bold uppercase tracking-wider text-sm">24/7 SUPPORT</div>
              <div className="text-gray-400 text-xs">We are always here</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOP BY CATEGORY SECTION */}
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-12 2xl:px-16 bg-deep-black max-w-[3840px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 2xl:gap-8">

          {/* Left Title Column */}
          <div className="lg:col-span-1 flex flex-col justify-center pr-0 md:pr-8 mb-8 lg:mb-0 text-center lg:text-left items-center lg:items-start">
            <div className="relative mb-8">
              <span className="text-pink-500 italic font-serif text-2xl md:text-3xl block -mb-2 md:-mb-4 relative z-10">SHOP BY</span>
              <span className="text-5xl md:text-6xl lg:text-8xl 2xl:text-[120px] font-headline-xl uppercase block -rotate-2">CATEGORY</span>
            </div>
            <button className="flex items-center gap-2 text-electric-lime font-label-caps text-xs md:text-sm uppercase tracking-wider hover:text-white transition-colors">
              VIEW ALL CATEGORIES <span className="material-symbols-outlined text-sm md:text-base">arrow_forward</span>
            </button>
          </div>

          {/* Middle 2x3 Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Hoodies */}
            <div className="relative group overflow-hidden bg-charcoal h-48 md:h-64 cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAvWNKj4UqL-b14B7UQPz7F70ro73rqTT2SRskKI7PCxcgndOzUR743LUPDsbYldzEeWgmJiIy9fmHm2BFHSQC4ZIdwOueu9ZQdwu2yN9MkSHVnpMK3yKeVqOBZeRgsB1f_Hd8qbHvNPfbHU92ZCMAuwhi1W9qqFqUuY4evVuwP2Hklxaa_ZTWHkhX1s3xZ632Y-ZO_4sgYUJYOHDbltTCdLDsawIDtHgOee1TAhLiVFP__5rUzsJsfMQ)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h4 className="font-headline-md text-2xl uppercase">Hoodies</h4>
                <p className="text-xs text-gray-400">30+ STYLES</p>
              </div>
            </div>
            {/* T-Shirts */}
            <div className="relative group overflow-hidden bg-charcoal h-48 md:h-64 cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuBAbBmVbEjOXmyriAt1lvGuixFK3ki5D-B63XeHsbO6VIQxVrKOcW07a-APtqdnJLpKLZZ-2v4Iv1GlbYeuXj2P-L2p4Evi2QBYPS6xq7FkHli6yz5y7I4tgnHpHNqrkgsB6i_GMqMYORippLTW3shhJpVc8sVxwpyyS5sbF22gFj09SlVU6Ure0hqcnZyMSLDQqHOjZXp004OxXg_8Av5cmOwjQHhLKK8D5DIztaYfRWhqXEjA-zpnew)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h4 className="font-headline-md text-2xl uppercase">T-Shirts</h4>
                <p className="text-xs text-gray-400">100+ STYLES</p>
              </div>
            </div>
            {/* Bottoms */}
            <div className="relative group overflow-hidden bg-charcoal h-48 md:h-64 cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAvWNKj4UqL-b14B7UQPz7F70ro73rqTT2SRskKI7PCxcgndOzUR743LUPDsbYldzEeWgmJiIy9fmHm2BFHSQC4ZIdwOueu9ZQdwu2yN9MkSHVnpMK3yKeVqOBZeRgsB1f_Hd8qbHvNPfbHU92ZCMAuwhi1W9qqFqUuY4evVuwP2Hklxaa_ZTWHkhX1s3xZ632Y-ZO_4sgYUJYOHDbltTCdLDsawIDtHgOee1TAhLiVFP__5rUzsJsfMQ)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h4 className="font-headline-md text-2xl uppercase">Bottoms</h4>
                <p className="text-xs text-gray-400">20+ STYLES</p>
              </div>
            </div>
            {/* Accessories */}
            <div className="relative group overflow-hidden bg-charcoal h-48 md:h-64 cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCRIwsUCJRalYyeDH03k64EhwU71dpDg_wKW8Yf1J1AWP-0toH1eMNr_hTguxZeUgXVr4NvOrkAXUl8VtS9SPbCPrAUo3rkXtt5WQRtND8C3zaIwjlYKIuytnb0ZcMrkUWCmF6e3D9vcVU23jXmr8XmB2Vc-f0hM0fFeCE-FUhYpS_DjUlFAc0YvpDcZM2cX90h_HSG27HrVDdhbTZD_7jJHkCdh0XcwDuchSm1JRl-Tlb4Uq4KehLu_w)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h4 className="font-headline-md text-2xl uppercase">Accessories</h4>
                <p className="text-xs text-gray-400">50+ ITEMS</p>
              </div>
            </div>
            {/* Bags */}
            <div className="relative group overflow-hidden bg-charcoal h-48 md:h-64 cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuA0F_Fdh9Run25nrlQ3MAIBlXptdpViQxBWdzcJOZJrb603WSL2_7taNrzjTRmLF1sQ7u__Ya92thEqTov1PGvNaZg7MLhTWN7eLm6-FHXRMKWQavQaTlW-dvup88smVEJ07DtSSrDzCIhm3rvaZvY_v3ZnuZb4LfT0OnI_lalqV7Gk6Jw1WY9a2Qs7t3gqxTfqVV29E2l9sThhFAPmHIkxFtnKAnSs-7DtWwLyWkyuBt-8qhem40v7aQ)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h4 className="font-headline-md text-2xl uppercase">Bags</h4>
                <p className="text-xs text-gray-400">25+ ITEMS</p>
              </div>
            </div>
            {/* Headwear */}
            <div className="relative group overflow-hidden bg-charcoal h-48 md:h-64 cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCRIwsUCJRalYyeDH03k64EhwU71dpDg_wKW8Yf1J1AWP-0toH1eMNr_hTguxZeUgXVr4NvOrkAXUl8VtS9SPbCPrAUo3rkXtt5WQRtND8C3zaIwjlYKIuytnb0ZcMrkUWCmF6e3D9vcVU23jXmr8XmB2Vc-f0hM0fFeCE-FUhYpS_DjUlFAc0YvpDcZM2cX90h_HSG27HrVDdhbTZD_7jJHkCdh0XcwDuchSm1JRl-Tlb4Uq4KehLu_w)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h4 className="font-headline-md text-2xl uppercase">Headwear</h4>
                <p className="text-xs text-gray-400">20+ STYLES</p>
              </div>
            </div>
          </div>

          {/* Right Summer Promo Card */}
          <div className="lg:col-span-1 relative group overflow-hidden min-h-[300px] md:min-h-[400px] lg:min-h-full cursor-pointer flex flex-col justify-end p-6 md:p-8">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAK2u4yteHq596H9F_iag0c21Vi_M-ifxF8_ggDSC97O9wTmC7NbEewCpDD98OjSmk-2WYini14MB6sRAWM5VXGi3rtUN0a3RPEteEqOanLrkA4KeiFwGc2yJmt3QOV2n2XyQxIf-RzVRS2dNBDk3hcw2_hlnKys2aigww0-_UW6BIi7Ml1eV0vy29dx5cU7PQY_hceYWlz8mXJsjWG3XB0Pm-AduGNqz2dBrxXLWXVxUXL9Jy54mlNgg)' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            <div className="relative z-10">
              <span className="inline-block bg-white text-black text-[10px] md:text-xs font-bold px-2 py-1 mb-2">NEW SEASON. NEW ENERGY.</span>
              <h3 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-[80px] font-headline-xl uppercase leading-none mb-4">SUMMER<br />COLLECTION<br /><span className="text-electric-lime">2024</span></h3>
              <button className="bg-electric-lime text-deep-black font-label-caps px-4 py-2 md:px-6 md:py-3 uppercase font-bold text-xs md:text-sm hover:bg-white transition-colors w-max">
                SHOP NOW
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. NEW ARRIVALS SECTION */}
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-12 2xl:px-16 bg-deep-black border-t border-charcoal overflow-hidden max-w-[3840px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-pink-500 italic font-serif text-2xl md:text-3xl lg:text-4xl 2xl:text-6xl">NEW</span>
            <span className="text-4xl md:text-6xl lg:text-8xl 2xl:text-[120px] font-headline-xl uppercase leading-none">ARRIVALS</span>
            <span className="material-symbols-outlined text-electric-lime text-3xl md:text-5xl lg:text-6xl 2xl:text-[80px] ml-1 md:ml-2">arrow_forward</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4 self-end md:self-auto">
            <button onClick={scrollLeft} className="w-10 h-10 md:w-12 md:h-12 2xl:w-16 2xl:h-16 rounded-full border border-charcoal flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <span className="material-symbols-outlined text-xl md:text-2xl 2xl:text-3xl">chevron_left</span>
            </button>
            <button onClick={scrollRight} className="w-10 h-10 md:w-12 md:h-12 2xl:w-16 2xl:h-16 rounded-full border border-charcoal flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <span className="material-symbols-outlined text-xl md:text-2xl 2xl:text-3xl">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Scrollable Products */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Card 1 */}
          <div className="min-w-[280px] md:min-w-[320px] snap-start group">
            <div className="relative bg-charcoal aspect-[4/5] mb-4 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvWNKj4UqL-b14B7UQPz7F70ro73rqTT2SRskKI7PCxcgndOzUR743LUPDsbYldzEeWgmJiIy9fmHm2BFHSQC4ZIdwOueu9ZQdwu2yN9MkSHVnpMK3yKeVqOBZeRgsB1f_Hd8qbHvNPfbHU92ZCMAuwhi1W9qqFqUuY4evVuwP2Hklxaa_ZTWHkhX1s3xZ632Y-ZO_4sgYUJYOHDbltTCdLDsawIDtHgOee1TAhLiVFP__5rUzsJsfMQ" alt="Graffiti Crown Hoodie" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-electric-lime hover:text-black transition-colors text-white">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </button>
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-full bg-white text-black font-bold py-3 uppercase text-sm hover:bg-electric-lime transition-colors">Add to Cart</button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Graffiti Crown Hoodie</h3>
              <div className="text-electric-lime font-bold mb-3">₹1,999</div>
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-black border border-gray-600"></div>
                <div className="w-4 h-4 rounded-full bg-gray-500 border border-gray-600"></div>
                <div className="w-4 h-4 rounded-full bg-white border border-gray-600"></div>
                <div className="w-4 h-4 rounded-full bg-electric-lime border border-gray-600"></div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="min-w-[280px] md:min-w-[320px] snap-start group">
            <div className="relative bg-charcoal aspect-[4/5] mb-4 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAbBmVbEjOXmyriAt1lvGuixFK3ki5D-B63XeHsbO6VIQxVrKOcW07a-APtqdnJLpKLZZ-2v4Iv1GlbYeuXj2P-L2p4Evi2QBYPS6xq7FkHli6yz5y7I4tgnHpHNqrkgsB6i_GMqMYORippLTW3shhJpVc8sVxwpyyS5sbF22gFj09SlVU6Ure0hqcnZyMSLDQqHOjZXp004OxXg_8Av5cmOwjQHhLKK8D5DIztaYfRWhqXEjA-zpnew" alt="Abstract Doodle Tee" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-electric-lime hover:text-black transition-colors text-white">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </button>
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-full bg-white text-black font-bold py-3 uppercase text-sm hover:bg-electric-lime transition-colors">Add to Cart</button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Abstract Doodle Tee</h3>
              <div className="text-white font-bold mb-3">₹1,299</div>
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-black border border-gray-600"></div>
                <div className="w-4 h-4 rounded-full bg-white border border-gray-600"></div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="min-w-[280px] md:min-w-[320px] snap-start group">
            <div className="relative bg-charcoal aspect-[4/5] mb-4 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRIwsUCJRalYyeDH03k64EhwU71dpDg_wKW8Yf1J1AWP-0toH1eMNr_hTguxZeUgXVr4NvOrkAXUl8VtS9SPbCPrAUo3rkXtt5WQRtND8C3zaIwjlYKIuytnb0ZcMrkUWCmF6e3D9vcVU23jXmr8XmB2Vc-f0hM0fFeCE-FUhYpS_DjUlFAc0YvpDcZM2cX90h_HSG27HrVDdhbTZD_7jJHkCdh0XcwDuchSm1JRl-Tlb4Uq4KehLu_w" alt="World Tour Tee" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-electric-lime hover:text-black transition-colors text-white">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </button>
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-full bg-white text-black font-bold py-3 uppercase text-sm hover:bg-electric-lime transition-colors">Add to Cart</button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">World Tour Tee</h3>
              <div className="text-white font-bold mb-3">₹1,199</div>
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-black border border-gray-600"></div>
                <div className="w-4 h-4 rounded-full bg-electric-lime border border-gray-600"></div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="min-w-[280px] md:min-w-[320px] snap-start group">
            <div className="relative bg-charcoal aspect-[4/5] mb-4 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0F_Fdh9Run25nrlQ3MAIBlXptdpViQxBWdzcJOZJrb603WSL2_7taNrzjTRmLF1sQ7u__Ya92thEqTov1PGvNaZg7MLhTWN7eLm6-FHXRMKWQavQaTlW-dvup88smVEJ07DtSSrDzCIhm3rvaZvY_v3ZnuZb4LfT0OnI_lalqV7Gk6Jw1WY9a2Qs7t3gqxTfqVV29E2l9sThhFAPmHIkxFtnKAnSs-7DtWwLyWkyuBt-8qhem40v7aQ" alt="Brushstroke Hoodie" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-electric-lime hover:text-black transition-colors text-white">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </button>
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-full bg-white text-black font-bold py-3 uppercase text-sm hover:bg-electric-lime transition-colors">Add to Cart</button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Brushstroke Hoodie</h3>
              <div className="text-white font-bold mb-3">₹1,999</div>
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-500 border border-gray-600"></div>
                <div className="w-4 h-4 rounded-full bg-white border border-gray-600"></div>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="min-w-[280px] md:min-w-[320px] snap-start group">
            <div className="relative bg-charcoal aspect-[4/5] mb-4 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK2u4yteHq596H9F_iag0c21Vi_M-ifxF8_ggDSC97O9wTmC7NbEewCpDD98OjSmk-2WYini14MB6sRAWM5VXGi3rtUN0a3RPEteEqOanLrkA4KeiFwGc2yJmt3QOV2n2XyQxIf-RzVRS2dNBDk3hcw2_hlnKys2aigww0-_UW6BIi7Ml1eV0vy29dx5cU7PQY_hceYWlz8mXJsjWG3XB0Pm-AduGNqz2dBrxXLWXVxUXL9Jy54mlNgg" alt="Classic Cap" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-electric-lime hover:text-black transition-colors text-white">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </button>
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-full bg-white text-black font-bold py-3 uppercase text-sm hover:bg-electric-lime transition-colors">Add to Cart</button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Classic Cap</h3>
              <div className="text-white font-bold mb-3">₹699</div>
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-black border border-gray-600"></div>
              </div>
            </div>
          </div>

          {/* Card 6 */}
          <div className="min-w-[280px] md:min-w-[320px] snap-start group">
            <div className="relative bg-charcoal aspect-[4/5] mb-4 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvWNKj4UqL-b14B7UQPz7F70ro73rqTT2SRskKI7PCxcgndOzUR743LUPDsbYldzEeWgmJiIy9fmHm2BFHSQC4ZIdwOueu9ZQdwu2yN9MkSHVnpMK3yKeVqOBZeRgsB1f_Hd8qbHvNPfbHU92ZCMAuwhi1W9qqFqUuY4evVuwP2Hklxaa_ZTWHkhX1s3xZ632Y-ZO_4sgYUJYOHDbltTCdLDsawIDtHgOee1TAhLiVFP__5rUzsJsfMQ" alt="Neon Drip Tee" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-electric-lime hover:text-black transition-colors text-white">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </button>
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-full bg-white text-black font-bold py-3 uppercase text-sm hover:bg-electric-lime transition-colors">Add to Cart</button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Neon Drip Tee</h3>
              <div className="text-electric-lime font-bold mb-3">₹1,199</div>
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-black border border-gray-600"></div>
                <div className="w-4 h-4 rounded-full bg-electric-lime border border-gray-600"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. PROMO CARDS ROW */}
      <section className="py-8 md:py-12 px-4 md:px-8 lg:px-12 2xl:px-16 bg-deep-black grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-[3840px] mx-auto w-full">
        {/* Promo 1 */}
        <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group h-[240px] md:h-[280px] 2xl:h-[360px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl 2xl:text-5xl font-headline-md uppercase mb-1 md:mb-2">REBEL REWARDS</h3>
            <p className="text-xs md:text-sm 2xl:text-lg text-gray-200 mb-4 md:mb-6">Join now & earn points on every order.</p>
          </div>
          <div className="relative z-10 mt-auto flex items-end justify-between">
            <button className="font-bold uppercase tracking-wider text-xs md:text-sm flex items-center gap-1 md:gap-2 hover:text-electric-lime transition-colors">
              JOIN NOW <span className="material-symbols-outlined text-xs md:text-sm">arrow_forward</span>
            </button>
            {/* Mock card graphic */}
            <div className="w-20 h-14 md:w-24 md:h-16 2xl:w-32 2xl:h-20 bg-white/20 backdrop-blur-md border border-white/30 rounded flex flex-col items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <span className="text-[6px] md:text-[8px] 2xl:text-[10px] font-bold">CLAP CULTURE</span>
              <span className="text-[5px] md:text-[6px] 2xl:text-[8px]">REBEL CLUB</span>
            </div>
          </div>
        </div>

        {/* Promo 2 */}
        <div className="bg-charcoal border border-gray-800 rounded-lg p-6 md:p-8 flex flex-col justify-between h-[240px] md:h-[280px] 2xl:h-[360px]">
          <div>
            <h3 className="text-2xl md:text-3xl 2xl:text-5xl font-headline-md uppercase mb-1 md:mb-2">UP TO 20% OFF</h3>
            <p className="text-xs md:text-sm 2xl:text-lg text-gray-400 mb-4 md:mb-6 uppercase tracking-wider">ON YOUR FIRST ORDER</p>
          </div>
          <div>
            <div className="border border-dashed border-electric-lime text-electric-lime font-bold uppercase tracking-widest text-center text-xs md:text-sm 2xl:text-base py-2 md:py-3 mb-2 md:mb-3 bg-electric-lime/10">
              USE CODE: CLAP20
            </div>
            <p className="text-[9px] md:text-[10px] 2xl:text-xs text-gray-500">*Valid for limited time only.</p>
          </div>
        </div>

        {/* Promo 3 */}
        <div className="bg-charcoal border border-gray-800 rounded-lg p-6 md:p-8 flex flex-col justify-between h-[240px] md:h-[280px] 2xl:h-[360px]">
          <div>
            <h3 className="text-2xl md:text-3xl 2xl:text-5xl font-headline-md uppercase mb-1 md:mb-2">THE CULTURE FEED</h3>
            <p className="text-xs md:text-sm 2xl:text-lg text-gray-400 mb-4 md:mb-6 uppercase tracking-wider">FOLLOW US @CLAPCULTURE</p>
          </div>
          <div className="flex gap-2 md:gap-4 flex-wrap">
            <a href="#" className="w-10 h-10 md:w-12 md:h-12 2xl:w-16 2xl:h-16 rounded-full bg-deep-black flex items-center justify-center text-xs md:text-sm 2xl:text-base hover:bg-electric-lime hover:text-black transition-colors">
              IN
            </a>
            <a href="#" className="w-10 h-10 md:w-12 md:h-12 2xl:w-16 2xl:h-16 rounded-full bg-deep-black flex items-center justify-center text-xs md:text-sm 2xl:text-base hover:bg-electric-lime hover:text-black transition-colors">
              TK
            </a>
            <a href="#" className="w-10 h-10 md:w-12 md:h-12 2xl:w-16 2xl:h-16 rounded-full bg-deep-black flex items-center justify-center text-xs md:text-sm 2xl:text-base hover:bg-electric-lime hover:text-black transition-colors">
              YT
            </a>
            <a href="#" className="w-10 h-10 md:w-12 md:h-12 2xl:w-16 2xl:h-16 rounded-full bg-deep-black flex items-center justify-center text-xs md:text-sm 2xl:text-base hover:bg-electric-lime hover:text-black transition-colors">
              X
            </a>
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER SECTION */}
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
            <div className="font-bold uppercase tracking-wider text-xs md:text-sm 2xl:text-xl">Over 100K+</div>
            <div className="text-gray-400 text-[10px] md:text-xs 2xl:text-sm mt-1">HAPPY CUSTOMERS</div>
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
            <div className="text-gray-400 text-[10px] md:text-xs 2xl:text-sm mt-1">SHIPPING</div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-deep-black pt-12 md:pt-20 pb-8 px-4 md:px-8 lg:px-12 2xl:px-16 w-full">
        <div className="max-w-[3840px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 mb-12 md:mb-16">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="text-3xl md:text-4xl 2xl:text-6xl font-headline-md text-white mb-4 md:mb-6">CLAPCULTURE®</div>
              <p className="text-gray-400 text-xs md:text-sm 2xl:text-base max-w-sm">
                Redefining streetwear for the modern rebel. High-quality apparel designed to make a statement.
              </p>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-4 md:mb-6 text-white text-xs md:text-sm 2xl:text-base">SHOP</h4>
              <ul className="space-y-3 md:space-y-4 text-xs md:text-sm 2xl:text-base text-gray-400">
                <li><a href="#" className="hover:text-electric-lime transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">Hoodies</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">T-Shirts</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">Bottoms</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">Accessories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-4 md:mb-6 text-white text-xs md:text-sm 2xl:text-base">COMPANY</h4>
              <ul className="space-y-3 md:space-y-4 text-xs md:text-sm 2xl:text-base text-gray-400">
                <li><a href="#" className="hover:text-electric-lime transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">Sustainability</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-4 md:mb-6 text-white text-xs md:text-sm 2xl:text-base">HELP</h4>
              <ul className="space-y-3 md:space-y-4 text-xs md:text-sm 2xl:text-base text-gray-400">
                <li><a href="#" className="hover:text-electric-lime transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">Returns & Exchanges</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">Track Order</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-4 md:mb-6 text-white text-xs md:text-sm 2xl:text-base">LEGAL</h4>
              <ul className="space-y-3 md:space-y-4 text-xs md:text-sm 2xl:text-base text-gray-400">
                <li><a href="#" className="hover:text-electric-lime transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">Refund Policy</a></li>
                <li><a href="#" className="hover:text-electric-lime transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center justify-between pt-6 md:pt-8 border-t border-charcoal gap-6 text-center md:text-left">
            <div className="text-gray-500 text-[10px] md:text-xs 2xl:text-sm">
              © 2024 CLAPCULTURE. All rights reserved.
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
              <span className="text-[10px] md:text-xs 2xl:text-sm text-gray-400 uppercase font-bold mr-0 sm:mr-2">WE ACCEPT:</span>
              <div className="flex flex-wrap justify-center gap-2">
                <div className="bg-white/10 px-2 py-1 rounded text-[9px] md:text-[10px] 2xl:text-xs font-bold">VISA</div>
                <div className="bg-white/10 px-2 py-1 rounded text-[9px] md:text-[10px] 2xl:text-xs font-bold">MC</div>
                <div className="bg-white/10 px-2 py-1 rounded text-[9px] md:text-[10px] 2xl:text-xs font-bold">UPI</div>
                <div className="bg-white/10 px-2 py-1 rounded text-[9px] md:text-[10px] 2xl:text-xs font-bold">PAY</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
