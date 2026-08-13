'use client';

import { useState } from 'react';

const MOCK_DATA: {
  hero: { imageUrl: string; heading: string; subheading: string; ctaText: string; ctaLink: string };
  featuredCollections: string[];
  newArrivals: string[];
  limitedDrop: { imageUrl: string; linkedItem: string; ctaText: string };
  promos: { id: number; image: string; text: string; link: string }[];
  instagram: string[];
} = {
  hero: {
    imageUrl: '',
    heading: '',
    subheading: '',
    ctaText: '',
    ctaLink: '',
  },
  featuredCollections: [],
  newArrivals: [],
  limitedDrop: {
    imageUrl: '',
    linkedItem: '',
    ctaText: '',
  },
  promos: [],
  instagram: []
};

const COLLECTIONS = [
  { id: 'summer-24', name: 'Summer 24' },
  { id: 'essentials', name: 'Essentials' },
  { id: 'footwear', name: 'Footwear' },
  { id: 'accessories', name: 'Accessories' }
];

const PRODUCTS = [
  { id: 'prod-1', name: 'Oversized Graphic Tee' },
  { id: 'prod-2', name: 'Cargo Pants v2' },
  { id: 'prod-3', name: 'Utility Vest' },
  { id: 'prod-4', name: 'Chunky Sneakers' },
  { id: 'prod-99', name: 'Limited Edition Hoodie' }
];

export default function HomepageCMS() {
  const [data, setData] = useState(MOCK_DATA);
  const [expandedSection, setExpandedSection] = useState<string | null>('hero');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSave = () => {
    alert('Changes saved successfully!');
  };

  const handlePreview = () => {
    alert('Opening preview...');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#0a0a0a] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Homepage CMS</h1>
          <p className="text-[#a3a3a3]">Manage the content and layout of your storefront homepage.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handlePreview} className="border border-[#262626] text-white px-4 py-2 rounded-lg hover:bg-[#1a1a1a] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            Preview
          </button>
          <button onClick={handleSave} className="bg-[#d2f000] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#b8d400] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Hero Section */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg overflow-hidden">
          <button 
            onClick={() => toggleSection('hero')}
            className="w-full flex justify-between items-center p-4 hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#a3a3a3]">image</span>
              <h2 className="text-white font-medium text-lg">Hero Section</h2>
            </div>
            <span className="material-symbols-outlined text-[#737373]">
              {expandedSection === 'hero' ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          
          {expandedSection === 'hero' && (
            <div className="p-4 border-t border-[#262626] space-y-4">
              <div>
                <label className="block text-[#a3a3a3] text-sm mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={data.hero.imageUrl}
                  onChange={(e) => setData({...data, hero: {...data.hero, imageUrl: e.target.value}})}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a3a3a3] text-sm mb-1">Heading</label>
                  <input 
                    type="text" 
                    value={data.hero.heading}
                    onChange={(e) => setData({...data, hero: {...data.hero, heading: e.target.value}})}
                    className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[#a3a3a3] text-sm mb-1">Subheading</label>
                  <input 
                    type="text" 
                    value={data.hero.subheading}
                    onChange={(e) => setData({...data, hero: {...data.hero, subheading: e.target.value}})}
                    className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[#a3a3a3] text-sm mb-1">CTA Text</label>
                  <input 
                    type="text" 
                    value={data.hero.ctaText}
                    onChange={(e) => setData({...data, hero: {...data.hero, ctaText: e.target.value}})}
                    className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[#a3a3a3] text-sm mb-1">CTA Link</label>
                  <input 
                    type="text" 
                    value={data.hero.ctaLink}
                    onChange={(e) => setData({...data, hero: {...data.hero, ctaLink: e.target.value}})}
                    className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Featured Collections */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg overflow-hidden">
          <button 
            onClick={() => toggleSection('collections')}
            className="w-full flex justify-between items-center p-4 hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#a3a3a3]">category</span>
              <h2 className="text-white font-medium text-lg">Featured Collections</h2>
            </div>
            <span className="material-symbols-outlined text-[#737373]">
              {expandedSection === 'collections' ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          
          {expandedSection === 'collections' && (
            <div className="p-4 border-t border-[#262626] space-y-4">
              <p className="text-[#a3a3a3] text-sm">Select collections to feature on the homepage.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {COLLECTIONS.map(col => (
                  <label key={col.id} className="flex items-center gap-2 cursor-pointer p-3 border border-[#262626] rounded-lg hover:bg-[#1a1a1a]">
                    <input 
                      type="checkbox" 
                      checked={data.featuredCollections.includes(col.id)}
                      onChange={(e) => {
                        const newCols = e.target.checked 
                          ? [...data.featuredCollections, col.id]
                          : data.featuredCollections.filter(id => id !== col.id);
                        setData({...data, featuredCollections: newCols});
                      }}
                      className="accent-[#d2f000] w-4 h-4"
                    />
                    <span className="text-white text-sm">{col.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* New Arrivals */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg overflow-hidden">
          <button 
            onClick={() => toggleSection('new-arrivals')}
            className="w-full flex justify-between items-center p-4 hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#a3a3a3]">new_releases</span>
              <h2 className="text-white font-medium text-lg">New Arrivals</h2>
            </div>
            <span className="material-symbols-outlined text-[#737373]">
              {expandedSection === 'new-arrivals' ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          
          {expandedSection === 'new-arrivals' && (
            <div className="p-4 border-t border-[#262626] space-y-4">
               <p className="text-[#a3a3a3] text-sm">Select products to show in New Arrivals carousel.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PRODUCTS.map(prod => (
                  <label key={prod.id} className="flex items-center gap-2 cursor-pointer p-3 border border-[#262626] rounded-lg hover:bg-[#1a1a1a]">
                    <input 
                      type="checkbox" 
                      checked={data.newArrivals.includes(prod.id)}
                      onChange={(e) => {
                        const newProds = e.target.checked 
                          ? [...data.newArrivals, prod.id]
                          : data.newArrivals.filter(id => id !== prod.id);
                        setData({...data, newArrivals: newProds});
                      }}
                      className="accent-[#d2f000] w-4 h-4"
                    />
                    <span className="text-white text-sm truncate">{prod.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Limited Drop */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg overflow-hidden">
          <button 
            onClick={() => toggleSection('limited-drop')}
            className="w-full flex justify-between items-center p-4 hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#a3a3a3]">local_fire_department</span>
              <h2 className="text-white font-medium text-lg">Limited Drop</h2>
            </div>
            <span className="material-symbols-outlined text-[#737373]">
              {expandedSection === 'limited-drop' ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          
          {expandedSection === 'limited-drop' && (
            <div className="p-4 border-t border-[#262626] space-y-4">
              <div>
                <label className="block text-[#a3a3a3] text-sm mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={data.limitedDrop.imageUrl}
                  onChange={(e) => setData({...data, limitedDrop: {...data.limitedDrop, imageUrl: e.target.value}})}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a3a3a3] text-sm mb-1">Linked Product</label>
                  <select 
                    value={data.limitedDrop.linkedItem}
                    onChange={(e) => setData({...data, limitedDrop: {...data.limitedDrop, linkedItem: e.target.value}})}
                    className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none"
                  >
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#a3a3a3] text-sm mb-1">CTA Text</label>
                  <input 
                    type="text" 
                    value={data.limitedDrop.ctaText}
                    onChange={(e) => setData({...data, limitedDrop: {...data.limitedDrop, ctaText: e.target.value}})}
                    className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Promotional Bento */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg overflow-hidden">
          <button 
            onClick={() => toggleSection('promos')}
            className="w-full flex justify-between items-center p-4 hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#a3a3a3]">grid_view</span>
              <h2 className="text-white font-medium text-lg">Promotional Bento</h2>
            </div>
            <span className="material-symbols-outlined text-[#737373]">
              {expandedSection === 'promos' ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          
          {expandedSection === 'promos' && (
            <div className="p-4 border-t border-[#262626] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.promos.map((promo, idx) => (
                  <div key={promo.id} className="space-y-3 p-4 border border-[#262626] rounded-lg">
                    <h3 className="text-white font-medium">Block {idx + 1}</h3>
                    <div>
                      <label className="block text-[#a3a3a3] text-sm mb-1">Image URL</label>
                      <input 
                        type="text" 
                        value={promo.image}
                        onChange={(e) => {
                          const newPromos = [...data.promos];
                          newPromos[idx].image = e.target.value;
                          setData({...data, promos: newPromos});
                        }}
                        className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-[#a3a3a3] text-sm mb-1">Text</label>
                      <input 
                        type="text" 
                        value={promo.text}
                        onChange={(e) => {
                          const newPromos = [...data.promos];
                          newPromos[idx].text = e.target.value;
                          setData({...data, promos: newPromos});
                        }}
                        className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-[#a3a3a3] text-sm mb-1">Link</label>
                      <input 
                        type="text" 
                        value={promo.link}
                        onChange={(e) => {
                          const newPromos = [...data.promos];
                          newPromos[idx].link = e.target.value;
                          setData({...data, promos: newPromos});
                        }}
                        className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none text-sm" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instagram */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg overflow-hidden">
          <button 
            onClick={() => toggleSection('instagram')}
            className="w-full flex justify-between items-center p-4 hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#a3a3a3]">photo_library</span>
              <h2 className="text-white font-medium text-lg">Instagram Section</h2>
            </div>
            <span className="material-symbols-outlined text-[#737373]">
              {expandedSection === 'instagram' ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          
          {expandedSection === 'instagram' && (
            <div className="p-4 border-t border-[#262626] space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.instagram.map((url, idx) => (
                  <div key={idx}>
                    <label className="block text-[#a3a3a3] text-sm mb-1">Image {idx + 1}</label>
                    <input 
                      type="text" 
                      value={url}
                      onChange={(e) => {
                        const newIg = [...data.instagram];
                        newIg[idx] = e.target.value;
                        setData({...data, instagram: newIg});
                      }}
                      className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none text-sm" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}