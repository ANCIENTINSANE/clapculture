import React from 'react';
import Link from 'next/link';

export function PromoBar() {
  return (
    <div className="bg-deep-black border-b border-charcoal py-2 px-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center w-full z-[60] relative">
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="material-symbols-outlined text-electric-lime text-[10px] sm:text-sm">bolt</span>
        <span className="font-label-caps text-[10px] sm:text-xs text-white">FREE SHIPPING ON ORDERS ABOVE ₹999</span>
      </div>
      <Link href="/shop" className="font-label-caps text-[10px] sm:text-xs text-electric-lime flex items-center gap-1 hover:underline sm:ml-2">
        SHOP NOW <span className="material-symbols-outlined text-[10px] sm:text-sm">arrow_forward</span>
      </Link>
    </div>
  );
}
