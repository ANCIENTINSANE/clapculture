/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Size } from '@clapculture/shared';
import { formatCurrency, resolveImageUrl } from '@/lib/utils';
import { useCart } from '@/components/cart/CartProvider';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SizeSelector } from '@/components/product/SizeSelector';
import { Modal } from '@/components/ui/Modal';

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const router = useRouter();
  const rawImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['/stock/superstar-mockup1.webp'];

  const [activeImage, setActiveImage] = useState(rawImages[0]);
  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState('');

  // Fullscreen Carousel Lightbox State
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  const openFullscreen = (index: number) => {
    setCarouselIndex(Math.max(0, Math.min(index, rawImages.length - 1)));
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = useCallback(() => {
    setIsFullscreenOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % rawImages.length);
  }, [rawImages.length]);

  const prevImage = useCallback(() => {
    setCarouselIndex((prev) => (prev - 1 + rawImages.length) % rawImages.length);
  }, [rawImages.length]);

  // Sync activeImage with carousel when index changes
  useEffect(() => {
    if (rawImages[carouselIndex]) {
      setActiveImage(rawImages[carouselIndex]);
    }
  }, [carouselIndex, rawImages]);

  // Fullscreen Keyboard Navigation (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isFullscreenOpen) return;

    // Lock body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFullscreen();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreenOpen, closeFullscreen, nextImage, prevImage]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (!selectedSize) {
      setSizeError('Please select a size first');
      return;
    }
    setSizeError('');
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (!selectedSize) {
      setSizeError('Please select a size first');
      return;
    }
    setSizeError('');
    addToCart(product, selectedSize, quantity);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-deep-black text-white pt-24 pb-12 max-w-[1920px] mx-auto">
      {/* Breadcrumb */}
      <div className="px-4 md:px-8 text-sm text-gray-400 mb-6 flex items-center gap-2 font-label-caps tracking-widest">
        <Link href="/" className="hover:text-electric-lime transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-electric-lime transition-colors">SHOP</Link>
        <span>/</span>
        <span className="text-white truncate max-w-50 md:max-w-none">{product.name.toUpperCase()}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-8 mb-24">
        {/* Image Gallery */}
        <div className="w-full lg:w-3/5 flex flex-col md:flex-row-reverse gap-4">
          {/* Main Display Image with Fullscreen Click */}
          <div 
            onClick={() => {
              const idx = rawImages.indexOf(activeImage);
              openFullscreen(idx >= 0 ? idx : 0);
            }}
            className="w-full md:w-5/6 bg-charcoal aspect-4/5 relative cursor-zoom-in group overflow-hidden select-none rounded-lg"
            title="Click to view full screen carousel"
          >
            <img 
              src={resolveImageUrl(activeImage)} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />

            {/* Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.badges.map((badge, idx) => (
                  <span key={idx} className="bg-electric-lime text-black text-xs font-bold px-3 py-1 uppercase shadow-md">{badge}</span>
                ))}
              </div>
            )}

            {/* Hover Fullscreen Prompt Banner */}
            <div className="absolute bottom-4 right-4 bg-black/80 hover:bg-black text-white text-xs font-mono px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-lg backdrop-blur-md">
              <span className="material-symbols-outlined text-sm text-electric-lime">zoom_in</span>
              <span>Full Screen</span>
            </div>
          </div>

          {/* Thumbnail column */}
          <div className="w-full md:w-1/6 flex md:flex-col gap-4 overflow-x-auto md:overflow-visible hide-scrollbar pb-2 md:pb-0">
            {rawImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`w-20 md:w-full aspect-4/5 bg-charcoal shrink-0 border-2 rounded transition-all ${
                  activeImage === img ? 'border-electric-lime scale-95 shadow-md' : 'border-transparent hover:border-gray-500 opacity-80 hover:opacity-100'
                }`}
                onClick={() => {
                  setActiveImage(img);
                  setCarouselIndex(idx);
                }}
              >
                <img src={resolveImageUrl(img)} alt={`${product.name} ${idx}`} className="w-full h-full object-cover rounded-sm" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-2/5 flex flex-col">
          <h1 className="font-headline-xl text-5xl md:text-6xl mb-4 leading-none uppercase">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xl text-gray-500 line-through">{formatCurrency(product.compareAtPrice)}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-8 text-electric-lime">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className="material-symbols-outlined text-xl">{i === 5 ? 'star_half' : 'star'}</span>
              ))}
            </div>
            <span className="text-white text-sm font-label-caps ml-2">4.8 (124 REVIEWS)</span>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-label-caps text-sm text-gray-400">
                SELECT SIZE {selectedSize && <span className="text-electric-lime font-bold">({selectedSize})</span>}
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-sm underline hover:text-electric-lime transition-colors"
              >
                SIZE GUIDE
              </button>
            </div>

            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelect={(sz) => {
                setSelectedSize(sz);
                setSizeError('');
              }}
            />
            {sizeError && <p className="text-red-500 text-xs mt-2 font-bold">{sizeError}</p>}
          </div>

          <div className="mb-8">
            <span className="font-label-caps text-sm text-gray-400 mb-4 block">QUANTITY</span>
            <div className="flex items-center border border-charcoal w-32">
              <button className="w-10 h-10 flex items-center justify-center hover:text-electric-lime" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span className="flex-1 text-center font-bold">{quantity}</span>
              <button className="w-10 h-10 flex items-center justify-center hover:text-electric-lime" onClick={() => setQuantity(Math.min(10, quantity + 1))}>+</button>
            </div>
          </div>

          {isOutOfStock ? (
            <p className="text-sm text-red-500 font-label-caps mb-8 flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-sm">cancel</span>
              OUT OF STOCK - RESTOCKING SOON
            </p>
          ) : (
            <p className="text-sm text-green-500 font-label-caps mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              IN STOCK
            </p>
          )}

          <div className="flex flex-col gap-4 mb-12">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full font-headline-md text-xl py-4 transition-colors ${isOutOfStock
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-electric-lime text-black hover:bg-white'
                }`}
            >
              {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`w-full bg-transparent border text-white font-headline-md text-xl py-4 transition-colors ${isOutOfStock
                  ? 'border-gray-800 text-gray-600 cursor-not-allowed'
                  : 'border-white hover:bg-white hover:text-black'
                }`}
            >
              BUY IT NOW
            </button>
          </div>

          {/* Accordions */}
          <div className="border-t border-charcoal">
            {['description', 'material & care', 'shipping info'].map((tab) => (
              <div key={tab} className="border-b border-charcoal">
                <button
                  className="w-full py-4 flex justify-between items-center text-left font-headline-md text-lg uppercase"
                  onClick={() => setActiveTab(activeTab === tab ? '' : tab)}
                >
                  <span>{tab}</span>
                  <span className="text-xl">{activeTab === tab ? '−' : '+'}</span>
                </button>
                {activeTab === tab && (
                  <div className="pb-4 text-gray-400 font-body-sm text-sm leading-relaxed">
                    {tab === 'description' && (
                      <p>{product.description || 'Premium heavyweight oversized streetwear tee featuring exclusive original high-density graphic prints.'}</p>
                    )}
                    {tab === 'material & care' && (
                      <ul className="list-disc pl-4 space-y-1">
                        <li>100% Super Combed Bio-Washed Cotton</li>
                        <li>240&ndash;320 GSM Heavyweight Terry Fabric</li>
                        <li>Machine wash cold, inside out with like colors</li>
                        <li>Do not iron directly on the prints</li>
                      </ul>
                    )}
                    {tab === 'shipping info' && (
                      <p>Standard delivery across India within 3&ndash;5 business days. Free shipping on all prepaid orders.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="px-4 md:px-8">
        <h2 className="font-headline-xl text-4xl mb-8 uppercase text-center md:text-left">You Might Also Like</h2>
        <ProductGrid products={relatedProducts} />
      </div>

      {/* Mobile Sticky Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-deep-black/90 backdrop-blur-md border-t border-charcoal md:hidden z-40 flex items-center gap-4">
        <div className="flex-1 flex flex-col">
          <span className="text-xs text-gray-400 truncate">{product.name}</span>
          <span className="font-bold">{formatCurrency(product.price)}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="bg-electric-lime text-black px-6 py-3 font-bold text-sm disabled:opacity-50"
        >
          {isOutOfStock ? 'OUT OF STOCK' : 'ADD'}
        </button>
      </div>

      {/* Size Guide Modal */}
      <Modal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} title="SIZE GUIDE (OVERSIZED FIT)">
        <div className="text-sm space-y-4">
          <p className="text-gray-300 text-xs md:text-sm">
            All measurements are in <span className="text-electric-lime font-bold">inches</span>. Our garments feature a signature relaxed streetwear fit.
          </p>

          <div className="overflow-x-auto border border-gray-700 rounded-lg shadow-inner">
            <table className="w-full text-center border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-[#2b3240] text-white divide-x divide-gray-700">
                  <th className="p-3 bg-[#1e2430] text-left font-bold text-gray-300 w-24 tracking-wider">SIZE</th>
                  <th className="p-3 font-bold">S</th>
                  <th className="p-3 font-bold">M</th>
                  <th className="p-3 font-bold">L</th>
                  <th className="p-3 font-bold">XL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-[#161a22]">
                <tr className="divide-x divide-gray-700">
                  <td className="p-3 bg-[#1e2430] text-left font-bold text-gray-300 tracking-wider">CHEST</td>
                  <td className="p-3 text-white font-mono font-medium">43</td>
                  <td className="p-3 text-white font-mono font-medium">45</td>
                  <td className="p-3 text-white font-mono font-medium">47</td>
                  <td className="p-3 text-white font-mono font-medium">49</td>
                </tr>
                <tr className="divide-x divide-gray-700">
                  <td className="p-3 bg-[#1e2430] text-left font-bold text-gray-300 tracking-wider">LENGTH</td>
                  <td className="p-3 text-white font-mono font-medium">27.5</td>
                  <td className="p-3 text-white font-mono font-medium">28.5</td>
                  <td className="p-3 text-white font-mono font-medium">29.5</td>
                  <td className="p-3 text-white font-mono font-medium">30.5</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-soft-charcoal border border-gray-800 rounded-lg p-3 text-xs text-gray-400 space-y-1.5">
            <p className="text-gray-300 font-semibold flex items-center gap-1.5">
              <span className="text-electric-lime">📏</span> Fit Note:
            </p>
            <p>• If you prefer a classic/regular fit instead of oversized, order one size down.</p>
          </div>
        </div>
      </Modal>

      {/* FULLSCREEN IMAGE CAROUSEL LIGHTBOX */}
      {isFullscreenOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between animate-in fade-in duration-200 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeFullscreen();
          }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-charcoal/80 bg-black/60 backdrop-blur-md z-20">
            <div className="flex items-center gap-3">
              <span className="text-xs md:text-sm font-headline-md text-white tracking-wider uppercase truncate max-w-xs md:max-w-md">
                {product.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-charcoal border border-gray-700 text-[11px] font-mono font-bold text-electric-lime">
                {carouselIndex + 1} / {rawImages.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline-block text-[11px] font-mono text-gray-500">
                Press ESC or click outside to close • &larr; / &rarr; to slide
              </span>
              <button
                type="button"
                onClick={closeFullscreen}
                className="w-10 h-10 rounded-full bg-charcoal hover:bg-white hover:text-black text-gray-300 border border-gray-700 flex items-center justify-center transition-all cursor-pointer shadow-lg"
                title="Close fullscreen (ESC)"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>

          {/* Carousel Viewport with Floating Controls */}
          <div className="relative flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
            {/* Previous Button */}
            {rawImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 md:left-8 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/70 hover:bg-electric-lime hover:text-black text-white border border-gray-700 flex items-center justify-center transition-all cursor-pointer shadow-2xl backdrop-blur-md group"
                title="Previous Image (Left Arrow)"
              >
                <span className="material-symbols-outlined text-2xl md:text-3xl group-hover:-translate-x-0.5 transition-transform">
                  chevron_left
                </span>
              </button>
            )}

            {/* Active Carousel Image */}
            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <img
                src={resolveImageUrl(rawImages[carouselIndex])}
                alt={`${product.name} full view ${carouselIndex + 1}`}
                className="max-h-[70vh] md:max-h-[78vh] max-w-[92vw] object-contain rounded-lg shadow-2xl transition-all duration-300 pointer-events-auto"
              />
            </div>

            {/* Next Button */}
            {rawImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 md:right-8 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/70 hover:bg-electric-lime hover:text-black text-white border border-gray-700 flex items-center justify-center transition-all cursor-pointer shadow-2xl backdrop-blur-md group"
                title="Next Image (Right Arrow / Space)"
              >
                <span className="material-symbols-outlined text-2xl md:text-3xl group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          {rawImages.length > 1 && (
            <div className="p-4 border-t border-charcoal/80 bg-black/60 backdrop-blur-md flex items-center justify-center gap-3 overflow-x-auto hide-scrollbar z-20">
              {rawImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCarouselIndex(idx)}
                  className={`w-14 h-18 md:w-16 md:h-20 shrink-0 bg-charcoal rounded overflow-hidden border-2 transition-all cursor-pointer ${
                    carouselIndex === idx
                      ? 'border-electric-lime ring-2 ring-electric-lime/40 scale-105 opacity-100 shadow-lg'
                      : 'border-transparent opacity-50 hover:opacity-100 hover:border-gray-500'
                  }`}
                >
                  <img
                    src={resolveImageUrl(img)}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
