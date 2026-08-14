'use client';

import React from 'react';
import { CartItem as CartItemType } from '@clapculture/shared';
import { formatCurrency, resolveImageUrl } from '@/lib/utils';
import { useCart } from './CartProvider';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-charcoal">
      <div className="w-20 h-24 relative bg-charcoal shrink-0">
        {item.image ? (
          <img
            src={resolveImageUrl(item.image)}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-bold text-sm uppercase leading-tight line-clamp-2">{item.name}</h4>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="text-gray-500 hover:text-electric-lime transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div className="text-gray-400 text-xs mt-1">SIZE: {item.size}</div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center border border-charcoal">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-6 h-6 flex items-center justify-center hover:bg-charcoal text-white"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 flex items-center justify-center hover:bg-charcoal text-white"
            >
              +
            </button>
          </div>
          <div className="font-bold text-sm text-electric-lime">
            {formatCurrency(item.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
}
