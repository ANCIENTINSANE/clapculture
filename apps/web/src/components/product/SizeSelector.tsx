'use client';

import React from 'react';
import { Size } from '@clapculture/shared';
import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize?: Size;
  onSelect: (size: Size) => void;
  outOfStock?: Size[];
}

const ALL_SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export function SizeSelector({ sizes, selectedSize, onSelect, outOfStock = [] }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold uppercase text-sm">Size</span>
        <button className="text-xs text-gray-400 hover:text-white underline uppercase">Size Guide</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_SIZES.map((size) => {
          const isAvailable = sizes.includes(size);
          const isOutOfStock = outOfStock.includes(size);
          const isSelected = selectedSize === size;
          const isDisabled = !isAvailable || isOutOfStock;

          return (
            <button
              key={size}
              disabled={isDisabled}
              onClick={() => onSelect(size)}
              className={cn(
                "w-12 h-12 border flex items-center justify-center text-sm font-bold transition-all relative group",
                isSelected 
                  ? "bg-electric-lime border-electric-lime text-black" 
                  : "border-charcoal hover:border-gray-400 text-white",
                isDisabled && "opacity-50 cursor-not-allowed hover:border-charcoal overflow-hidden",
              )}
            >
              {size}
              {isDisabled && (
                <div className="absolute inset-0 w-full h-full">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-charcoal -rotate-45 transform origin-center"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
