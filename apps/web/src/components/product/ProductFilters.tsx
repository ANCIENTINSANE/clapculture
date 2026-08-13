'use client';

import React, { useState } from 'react';

export interface FilterState {
  selectedCategories: string[];
  selectedSizes: string[];
  sortBy: string;
}

interface ProductFiltersProps {
  categories: string[];
  selectedCategories?: string[];
  selectedSizes?: string[];
  sortBy?: string;
  onFilterChange: (filters: FilterState) => void;
}

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export function ProductFilters({
  categories,
  selectedCategories = [],
  selectedSizes = [],
  sortBy = 'NEWEST',
  onFilterChange,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = (cat: string) => {
    const nextCats = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    onFilterChange({
      selectedCategories: nextCats,
      selectedSizes,
      sortBy,
    });
  };

  const toggleSize = (size: string) => {
    const nextSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    onFilterChange({
      selectedCategories,
      selectedSizes: nextSizes,
      sortBy,
    });
  };

  const handleSortChange = (newSort: string) => {
    onFilterChange({
      selectedCategories,
      selectedSizes,
      sortBy: newSort,
    });
  };

  const handleClear = () => {
    onFilterChange({
      selectedCategories: [],
      selectedSizes: [],
      sortBy: 'NEWEST',
    });
  };

  return (
    <>
      <button 
        className="md:hidden flex items-center gap-2 font-bold uppercase text-sm border border-charcoal px-4 py-2"
        onClick={() => setIsOpen(true)}
      >
        <span className="material-symbols-outlined">tune</span> Filters
      </button>

      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`fixed inset-y-0 left-0 w-4/5 max-w-sm bg-deep-black z-50 p-6 overflow-y-auto transform transition-transform duration-300 md:static md:w-64 md:transform-none md:p-0 md:bg-transparent md:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h3 className="font-headline-md text-2xl uppercase">Filters</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 border-b border-charcoal pb-2">Category</h4>
            <div className="space-y-3">
              {categories.map((cat) => {
                const isChecked = selectedCategories.includes(cat);
                return (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 bg-transparent border border-gray-600 rounded-sm checked:bg-electric-lime checked:border-electric-lime focus:ring-0 focus:ring-offset-0 text-black cursor-pointer" 
                    />
                    <span className={`transition-colors ${isChecked ? 'text-electric-lime font-bold' : 'text-gray-400 group-hover:text-white'}`}>
                      {cat}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 border-b border-charcoal pb-2">Size</h4>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button 
                    key={size} 
                    onClick={() => toggleSize(size)}
                    className={`w-10 h-10 border text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-electric-lime border-electric-lime text-black font-bold'
                        : 'border-charcoal text-white hover:border-electric-lime hover:text-electric-lime'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 border-b border-charcoal pb-2">Sort By</h4>
            <select 
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full bg-charcoal border border-gray-700 text-white px-4 py-2 focus:outline-none focus:border-electric-lime cursor-pointer"
            >
              <option value="NEWEST">Newest</option>
              <option value="POPULAR">Popular</option>
              <option value="LOW_HIGH">Price: Low to High</option>
              <option value="HIGH_LOW">Price: High to Low</option>
            </select>
          </div>

          {(selectedCategories.length > 0 || selectedSizes.length > 0 || sortBy !== 'NEWEST') && (
            <button 
              onClick={handleClear}
              className="w-full border border-gray-600 text-white font-label-caps py-3 hover:bg-white hover:text-black transition-colors uppercase text-sm mt-4"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </>
  );
}
