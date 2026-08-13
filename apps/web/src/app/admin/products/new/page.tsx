'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AddProductPage() {
  const [sizes, setSizes] = useState([
    { name: 'XS', stock: 0 },
    { name: 'S', stock: 0 },
    { name: 'M', stock: 0 },
    { name: 'L', stock: 0 },
    { name: 'XL', stock: 0 },
    { name: 'XXL', stock: 0 }
  ]);

  const updateSizeStock = (index: number, stock: string) => {
    const newSizes = [...sizes];
    newSizes[index].stock = parseInt(stock) || 0;
    setSizes(newSizes);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-[#a3a3a3] hover:text-white transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-[#262626] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors">
            Save Draft
          </button>
          <button className="px-4 py-2 bg-[#d2f000] text-black rounded-lg font-medium hover:bg-[#b8d400] transition-colors">
            Publish Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Basic Information</h3>
            <div>
              <label className="block text-sm text-[#a3a3a3] mb-1">Product Name</label>
              <input type="text" className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none" placeholder="e.g. CLAP OVERSIZED TEE" />
            </div>
            <div>
              <label className="block text-sm text-[#a3a3a3] mb-1">Description</label>
              <textarea rows={4} className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none" placeholder="Product description..."></textarea>
            </div>
          </div>

          {/* Media */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Media</h3>
            <div className="border-2 border-dashed border-[#262626] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#1a1a1a] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-4xl text-[#737373] mb-2">cloud_upload</span>
              <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-[#737373] text-sm">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Sizes & Inventory</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sizes.map((size, idx) => (
                <div key={size.name} className="flex items-center gap-2">
                  <div className="w-12 h-10 flex items-center justify-center bg-[#1a1a1a] border border-[#262626] rounded text-white font-medium">
                    {size.name}
                  </div>
                  <input 
                    type="number" 
                    value={size.stock}
                    onChange={(e) => updateSizeStock(idx, e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#262626] rounded h-10 px-3 text-white focus:border-[#d2f000] outline-none"
                    placeholder="Stock"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Pricing</h3>
            <div>
              <label className="block text-sm text-[#a3a3a3] mb-1">Price (₹)</label>
              <input type="number" className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#a3a3a3] mb-1">Compare-at Price (₹)</label>
              <input type="number" className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none" />
            </div>
          </div>

          {/* Organization */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Organization</h3>
            <div>
              <label className="block text-sm text-[#a3a3a3] mb-1">Category</label>
              <select className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none">
                <option>Select category...</option>
                <option>T-Shirts</option>
                <option>Hoodies</option>
                <option>Bottoms</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#a3a3a3] mb-1">Tags</label>
              <input type="text" className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none" placeholder="Summer, Oversized, etc." />
            </div>
          </div>

          {/* Badges */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Marketing Badges</h3>
            <div className="space-y-2">
              {['New Arrival', 'Best Seller', 'Trending', 'Limited Drop'].map(badge => (
                <label key={badge} className="flex items-center gap-3 p-2 border border-[#262626] rounded-lg hover:bg-[#1a1a1a] cursor-pointer">
                  <input type="checkbox" className="accent-[#d2f000] w-4 h-4" />
                  <span className="text-white text-sm">{badge}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
