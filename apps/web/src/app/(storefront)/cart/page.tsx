/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import Link from 'next/link';
import { resolveImageUrl } from '@/lib/utils';
import { useCart } from '@/components/cart/CartProvider';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  
  const total = getCartTotal();
  const threshold = 999;
  const isFreeShipping = total >= threshold;
  const remainingForFreeShipping = isFreeShipping ? 0 : threshold - total;
  const progressPercentage = Math.min(100, (total / threshold) * 100);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-deep-black text-white px-4">
        <span className="material-symbols-outlined text-6xl text-gray-700 mb-6">shopping_bag</span>
        <h1 className="font-headline-xl text-5xl md:text-6xl mb-4">YOUR CART IS EMPTY</h1>
        <p className="text-gray-400 mb-8 text-center max-w-md">Looks like you haven&apos;t added any streetwear to your cart yet.</p>
        <Link href="/shop" className="bg-electric-lime text-black font-headline-md px-8 py-4 text-xl hover:bg-white transition-colors">
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-white pt-24 pb-12 px-4 md:px-8 max-w-[1920px] mx-auto">
      <h1 className="font-headline-xl text-5xl md:text-6xl mb-8 uppercase">YOUR CART ({getCartCount()})</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="grow">
          {/* Free Shipping Progress */}
          <div className="bg-charcoal p-4 mb-8">
            <p className="font-label-caps text-sm text-center mb-3 text-electric-lime">
              {isFreeShipping 
                ? "YOU'VE UNLOCKED FREE SHIPPING!" 
                : `ADD ${formatCurrency(remainingForFreeShipping)} MORE TO GET FREE SHIPPING`}
            </p>
            <div className="w-full bg-black h-2 rounded-full overflow-hidden">
              <div 
                className="bg-electric-lime h-full transition-all duration-500 ease-in-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-6">
            <div className="hidden md:grid grid-cols-12 gap-4 font-label-caps text-xs text-gray-500 border-b border-charcoal pb-4">
              <div className="col-span-6">PRODUCT</div>
              <div className="col-span-2 text-center">QUANTITY</div>
              <div className="col-span-3 text-right">TOTAL</div>
              <div className="col-span-1"></div>
            </div>

            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-charcoal pb-6">
                {/* Mobile View: Image & Info together */}
                <div className="col-span-6 flex gap-4">
                  <div className="w-20 h-24 bg-[#1a1a1a] border border-[#262626] rounded-md overflow-hidden shrink-0">
                    <img src={resolveImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-sm md:text-base uppercase line-clamp-2 hover:text-electric-lime"><Link href={`/product/${item.productId}`}>{item.name}</Link></h3>
                    <p className="text-gray-400 text-sm mt-1">SIZE: {item.size}</p>
                    <p className="text-white font-bold mt-2 md:hidden">{formatCurrency(item.price)}</p>
                  </div>
                </div>

                <div className="col-span-6 md:col-span-2 flex justify-between md:justify-center items-center mt-4 md:mt-0">
                  <span className="md:hidden font-label-caps text-sm text-gray-500">QUANTITY</span>
                  <div className="flex items-center border border-gray-700">
                    <button className="w-8 h-8 flex items-center justify-center hover:text-electric-lime" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button className="w-8 h-8 flex items-center justify-center hover:text-electric-lime" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>

                <div className="hidden md:block col-span-3 text-right font-bold text-lg">
                  {formatCurrency(item.price * item.quantity)}
                </div>

                <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center mt-2 md:mt-0">
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 text-sm">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                    <span className="md:hidden">REMOVE</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-100 shrink-0">
          <div className="bg-charcoal p-6 lg:sticky lg:top-24">
            <h2 className="font-headline-md text-2xl mb-6 uppercase border-b border-gray-700 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>SUBTOTAL</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>SHIPPING</span>
                <span>{isFreeShipping ? 'FREE' : formatCurrency(49)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-700 pt-4 mb-8">
              <span className="font-bold text-lg">TOTAL</span>
              <span className="font-bold text-2xl text-electric-lime">{formatCurrency(total + (isFreeShipping ? 0 : 49))}</span>
            </div>

            <Link 
              href="/checkout"
              className="block w-full bg-electric-lime text-black text-center font-headline-md text-xl py-4 hover:bg-white transition-colors mb-4"
            >
              PROCEED TO CHECKOUT
            </Link>
            
            <Link 
              href="/shop"
              className="block w-full text-center text-sm font-label-caps text-gray-400 hover:text-white transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
