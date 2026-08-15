/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
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
  const [activeImage, setActiveImage] = useState(product.images[0] || '6a7fa922002c9b023447');
  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState('');

  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

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
          <div className="w-full md:w-5/6 bg-charcoal aspect-4/5 relative">
            <img src={resolveImageUrl(activeImage)} alt={product.name} className="w-full h-full object-cover" />
            {product.badges && product.badges.length > 0 && (
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badges.map((badge, idx) => (
                  <span key={idx} className="bg-electric-lime text-black text-xs font-bold px-3 py-1 uppercase">{badge}</span>
                ))}
              </div>
            )}
          </div>
          <div className="w-full md:w-1/6 flex md:flex-col gap-4 overflow-x-auto md:overflow-visible hide-scrollbar pb-2 md:pb-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className={`w-20 md:w-full aspect-4/5 bg-charcoal shrink-0 border-2 ${activeImage === img ? 'border-electric-lime' : 'border-transparent hover:border-gray-500'}`}
                onClick={() => setActiveImage(img || '6a7fa922002c9b023447')}
              >
                <img src={resolveImageUrl(img)} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
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
                  className="w-full py-4 flex justify-between items-center font-label-caps text-sm hover:text-electric-lime"
                  onClick={() => setActiveTab(activeTab === tab ? '' : tab)}
                >
                  {tab.toUpperCase()}
                  <span className="material-symbols-outlined">{activeTab === tab ? 'remove' : 'add'}</span>
                </button>
                {activeTab === tab && (
                  <div className="pb-4 text-gray-400 font-body-sm text-sm">
                    {tab === 'description' && product.description}
                    {tab === 'material & care' && '100% Premium Heavyweight Cotton. Machine wash cold inside out. Do not tumble dry.'}
                    {tab === 'shipping info' && 'Free shipping on orders over ₹999 across India. Standard delivery in 3-5 business days.'}
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
                  <th className="p-3 font-bold">XS</th>
                  <th className="p-3 font-bold">S</th>
                  <th className="p-3 font-bold">M</th>
                  <th className="p-3 font-bold">L</th>
                  <th className="p-3 font-bold">XL</th>
                  <th className="p-3 font-bold">XXL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-[#161a22]">
                <tr className="divide-x divide-gray-700">
                  <td className="p-3 bg-[#1e2430] text-left font-bold text-gray-300 tracking-wider">CHEST</td>
                  <td className="p-3 text-white font-mono font-medium">41</td>
                  <td className="p-3 text-white font-mono font-medium">43</td>
                  <td className="p-3 text-white font-mono font-medium">45</td>
                  <td className="p-3 text-white font-mono font-medium">47</td>
                  <td className="p-3 text-white font-mono font-medium">49</td>
                  <td className="p-3 text-white font-mono font-medium">51</td>
                </tr>
                <tr className="divide-x divide-gray-700">
                  <td className="p-3 bg-[#1e2430] text-left font-bold text-gray-300 tracking-wider">LENGTH</td>
                  <td className="p-3 text-white font-mono font-medium">27</td>
                  <td className="p-3 text-white font-mono font-medium">27.5</td>
                  <td className="p-3 text-white font-mono font-medium">28.5</td>
                  <td className="p-3 text-white font-mono font-medium">29.5</td>
                  <td className="p-3 text-white font-mono font-medium">30.5</td>
                  <td className="p-3 text-white font-mono font-medium">31.5</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[#181818] border border-gray-800 rounded-lg p-3 text-xs text-gray-400 space-y-1.5">
            <p className="text-gray-300 font-semibold flex items-center gap-1.5">
              <span className="text-electric-lime">📏</span> Fit Note:
            </p>
            <p>• If you prefer a classic/regular fit instead of oversized, order one size down.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
