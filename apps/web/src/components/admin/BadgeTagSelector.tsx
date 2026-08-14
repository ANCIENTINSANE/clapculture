'use client';

import React, { useState } from 'react';

export const RECOMMENDED_BADGES: { category: string; badges: string[] }[] = [
  {
    category: 'Tollywood & Heroes',
    badges: [
      'PAWAN KALYAN',
      'POWER STAR',
      'SENANI',
      'MAHESH BABU',
      'SUPERSTAR',
      'POKIRI',
      'SSMB',
      'PRABHAS',
      'REBEL STAR',
      'DARLING',
      'RAJA SAAB',
      'ALLU ARJUN',
      'ICON STAR',
      'PUSHPA',
      'AA RULE',
      'RAM CHARAN',
      'GLOBAL STAR',
      'JR NTR',
      'MAN OF MASSES',
      'DEVARA',
    ],
  },
  {
    category: 'Fabric & Fit',
    badges: [
      '320 GSM',
      '240 GSM',
      '380 GSM FLEECE',
      'FRENCH TERRY',
      'BIO-WASHED',
      'OVERSIZED FIT',
      'DROP SHOULDER',
      'VINTAGE WASH',
      'HEAVYWEIGHT',
    ],
  },
  {
    category: 'Status & Marketing',
    badges: [
      'NEW DROP',
      'BESTSELLER',
      'LIMITED EDITION',
      'IN STOCK',
      'SOLD OUT',
      'EXCLUSIVE EDITION',
      'TRENDING',
      'WINTER DROP',
    ],
  },
];

interface BadgeTagSelectorProps {
  selectedBadges: string[];
  onChange: (badges: string[]) => void;
}

export function BadgeTagSelector({ selectedBadges, onChange }: BadgeTagSelectorProps) {
  const [customTag, setCustomTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isOpen, setIsOpen] = useState(false);

  const handleAddBadge = (badge: string) => {
    const formatted = badge.trim().toUpperCase();
    if (!formatted) return;
    if (!selectedBadges.includes(formatted)) {
      onChange([...selectedBadges, formatted]);
    }
  };

  const handleRemoveBadge = (badgeToRemove: string) => {
    onChange(selectedBadges.filter((b) => b !== badgeToRemove));
  };

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customTag.trim()) return;
    const formatted = customTag.trim().toUpperCase();
    if (!selectedBadges.includes(formatted)) {
      onChange([...selectedBadges, formatted]);
    }
    setCustomTag('');
  };

  const allBadgesFlat = RECOMMENDED_BADGES.flatMap((c) => c.badges);
  const filteredBadges =
    selectedCategory === 'all'
      ? allBadgesFlat
      : RECOMMENDED_BADGES.find((c) => c.category === selectedCategory)?.badges || [];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-medium text-[#737373] uppercase tracking-wider">
          Badges & Marketing Tags
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-electric-lime hover:underline font-mono flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">
            {isOpen ? 'expand_less' : 'add_circle'}
          </span>
          {isOpen ? 'Close Recommendations' : 'Browse Recommended Badges'}
        </button>
      </div>

      {/* Selected Active Badges Chips */}
      <div className="flex flex-wrap gap-2 p-3 bg-[#1a1a1a] border border-[#262626] rounded-lg min-h-11.5 items-center">
        {selectedBadges.length === 0 ? (
          <span className="text-xs text-[#737373] italic">
            No badges selected. Pick from dropdown below or type a custom tag.
          </span>
        ) : (
          selectedBadges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black border border-electric-lime/50 text-electric-lime text-xs font-bold font-mono tracking-wider shadow-sm animate-in fade-in"
            >
              {badge}
              <button
                type="button"
                onClick={() => handleRemoveBadge(badge)}
                className="hover:text-red-400 text-gray-400 transition-colors"
                title="Remove badge"
              >
                <span className="material-symbols-outlined text-sm block">close</span>
              </button>
            </span>
          ))
        )}
      </div>

      {/* Custom Tag Input + Quick Selector */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            placeholder="Type custom tag & press Enter (e.g. 100% COTTON, SALAAR)..."
            className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:border-electric-lime outline-none font-mono uppercase"
          />
        </div>
        <button
          type="button"
          onClick={() => handleAddCustom()}
          className="px-4 py-2 bg-[#262626] hover:bg-electric-lime hover:text-black text-white rounded-lg text-xs font-bold transition-colors uppercase font-mono"
        >
          Add Tag
        </button>
      </div>

      {/* Recommended Badges Accordion / Dropdown */}
      {isOpen && (
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 space-y-4 animate-in fade-in slide-in-from-top-1">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-[#262626]">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-electric-lime text-black'
                  : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
              }`}
            >
              All Badges ({allBadgesFlat.length})
            </button>
            {RECOMMENDED_BADGES.map((cat) => (
              <button
                key={cat.category}
                type="button"
                onClick={() => setSelectedCategory(cat.category)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors ${
                  selectedCategory === cat.category
                    ? 'bg-electric-lime text-black'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Badge Clickable Pills */}
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto hide-scrollbar">
            {filteredBadges.map((badge) => {
              const isSelected = selectedBadges.includes(badge);
              return (
                <button
                  key={badge}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      handleRemoveBadge(badge);
                    } else {
                      handleAddBadge(badge);
                    }
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all border ${
                    isSelected
                      ? 'bg-electric-lime text-black border-electric-lime shadow-md'
                      : 'bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-electric-lime hover:text-electric-lime'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {badge}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
