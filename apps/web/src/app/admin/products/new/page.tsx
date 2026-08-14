'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BadgeTagSelector } from '@/components/admin/BadgeTagSelector';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; msg: string; isError?: boolean }>({ show: false, msg: '' });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [existingProductName, setExistingProductName] = useState<string | null>(null);

  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [categoryId, setCategoryId] = useState('tees');
  const [badges, setBadges] = useState<string[]>(['NEW DROP', '320 GSM']);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [sizes, setSizes] = useState([
    { name: 'XS', stock: 10 },
    { name: 'S', stock: 10 },
    { name: 'M', stock: 15 },
    { name: 'L', stock: 15 },
    { name: 'XL', stock: 10 },
    { name: 'XXL', stock: 10 }
  ]);

  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-generate slug strictly from name
  const handleNameChange = (newName: string) => {
    setName(newName);
    setSlug(slugify(newName));
  };

  // Check slug availability in real time
  useEffect(() => {
    if (!slug.trim()) {
      let cancelled = false;
      setTimeout(() => {
        if (!cancelled) {
          setSlugStatus('idle');
          setExistingProductName(null);
        }
      }, 0);
      return () => { cancelled = true; };
    }

    setTimeout(() => setSlugStatus('checking'), 0);
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);

    checkTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/check/slug?slug=${encodeURIComponent(slug)}`);
        const json = await res.json();
        if (json.success) {
          if (json.available) {
            setSlugStatus('available');
            setExistingProductName(null);
          } else {
            setSlugStatus('taken');
            setExistingProductName(json.existingProduct?.name || 'an existing product');
          }
        } else {
          setSlugStatus('idle');
        }
      } catch {
        setSlugStatus('idle');
      }
    }, 350);

    return () => {
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    };
  }, [slug]);

  const showNotification = (msg: string, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast({ show: false, msg: '' }), 3500);
  };

  const updateSizeStock = (index: number, stock: string) => {
    const newSizes = [...sizes];
    newSizes[index].stock = parseInt(stock) || 0;
    setSizes(newSizes);
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification('Product name is required', true);
      return;
    }
    if (!slug.trim()) {
      showNotification('Product URL slug is required', true);
      return;
    }
    if (slugStatus === 'taken') {
      showNotification(`A product named "${existingProductName}" with this URL slug already exists!`, true);
      return;
    }
    if (!price || Number(price) <= 0) {
      showNotification('Valid price is required', true);
      return;
    }
    if (images.length === 0) {
      showNotification('Please add at least one product image before publishing', true);
      return;
    }

    setIsSubmitting(true);
    try {
      const totalStock = sizes.reduce((sum, s) => sum + s.stock, 0);
      const activeSizes = sizes.filter(s => s.stock >= 0).map(s => s.name);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const payload = {
        name,
        slug,
        description,
        categoryId,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        sizes: activeSizes.length > 0 ? activeSizes : ['S', 'M', 'L', 'XL'],
        stock: totalStock,
        badges: badges.length > 0 ? badges : ['NEW DROP', '320 GSM'],
        images: images,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('✨ Product published successfully to Appwrite database!');
        setTimeout(() => router.push('/admin/products'), 1200);
      } else {
        showNotification(json.error || 'Failed to publish product', true);
      }
    } catch {
      showNotification('Error creating product in database', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-lg font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom ${
          toast.isError ? 'bg-red-600 text-white' : 'bg-[#d2f000] text-black'
        }`}>
          <span className="material-symbols-outlined text-xl">
            {toast.isError ? 'error' : 'check_circle'}
          </span>
          {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-[#a3a3a3] hover:text-white transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products" className="px-4 py-2 border border-[#262626] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || slugStatus === 'taken'}
            className="px-6 py-2 bg-[#d2f000] text-black rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Basic Information</h3>
            
            {/* Product Name Input */}
            <div>
              <label className="block text-sm text-[#a3a3a3] mb-1">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none"
                placeholder="e.g. SUPERSTAR MAHESH BABU OVERSIZED TEE"
                required
              />
            </div>

            {/* Auto-generated URL Slug strictly derived from Product Name */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-[#737373] uppercase tracking-wider">
                  Product URL Slug (Strictly Derived from Name)
                </label>
              </div>

              <div className="relative">
                <div className="flex items-center bg-[#1a1a1a] border border-[#262626] rounded-lg">
                  <span className="pl-3 text-xs text-electric-lime font-mono select-none">/product/</span>
                  <input
                    type="text"
                    value={slug}
                    readOnly
                    className="w-full bg-transparent px-2 py-2 text-xs font-mono outline-none cursor-default text-gray-200"
                    placeholder="e.g. superstar-mahesh-babu-tee"
                    required
                  />
                  {slugStatus === 'checking' && (
                    <div className="pr-3">
                      <div className="w-4 h-4 border-2 border-electric-lime border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {slugStatus === 'available' && (
                    <div className="pr-3 text-green-400 flex items-center gap-1" title="URL slug is available">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                    </div>
                  )}
                  {slugStatus === 'taken' && (
                    <div className="pr-3 text-red-500 flex items-center gap-1" title="URL slug is already taken">
                      <span className="material-symbols-outlined text-base">cancel</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Slug Availability Status Message */}
              {slug.trim() && (
                <div className="mt-1.5 text-xs font-mono">
                  {slugStatus === 'checking' && (
                    <span className="text-gray-400">⏳ Checking slug availability...</span>
                  )}
                  {slugStatus === 'available' && (
                    <span className="text-green-400 flex items-center gap-1">
                      ✓ URL slug is available for new product
                    </span>
                  )}
                  {slugStatus === 'taken' && (
                    <div className="p-2.5 rounded bg-red-950/40 border border-red-500/40 text-red-400 flex flex-col gap-0.5">
                      <span className="font-bold flex items-center gap-1">
                        ⚠️ Same product name / URL slug already exists!
                      </span>
                      <span className="text-[11px] text-gray-300">
                        This slug is currently used by <strong className="text-white font-bold">&quot;{existingProductName}&quot;</strong>. Please tweak the name or slug.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#a3a3a3] mb-1">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none text-sm"
                placeholder="320 GSM French Terry heavyweight bio-washed cotton streetwear tee..."
              />
            </div>
          </div>

          {/* Media */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium">Product Images</h3>
              <span className="text-xs text-gray-500 font-mono">({images.length} added)</span>
            </div>

            {images.length === 0 ? (
              <div className="border-2 border-dashed border-[#262626] rounded-xl p-6 text-center">
                <span className="material-symbols-outlined text-3xl text-gray-500 mb-1 block">add_photo_alternate</span>
                <p className="text-sm text-gray-300 font-medium mb-1">No images added yet</p>
                <p className="text-xs text-gray-500">
                  Add image URLs or use existing stock webps below to upload photos for this product.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-3/4 bg-[#1a1a1a] border border-[#262626] rounded-lg overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full transition-colors"
                      title="Remove image"
                    >
                      <span className="material-symbols-outlined text-xs block">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL or path (e.g. /stock/superstar-mockup1.webp)"
                className="flex-1 bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#d2f000] outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-[#262626] text-white rounded-lg text-sm font-bold hover:bg-[#d2f000] hover:text-black transition-colors"
              >
                Add Image
              </button>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Sizes & Inventory Quantities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sizes.map((size, idx) => (
                <div key={size.name} className="flex items-center gap-2">
                  <div className="w-12 h-10 flex items-center justify-center bg-[#1a1a1a] border border-[#262626] rounded font-mono font-bold text-xs text-[#d2f000]">
                    {size.name}
                  </div>
                  <input 
                    type="number"
                    min="0"
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
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="699"
                required
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a3a3a3] mb-1">Compare-at Price (₹)</label>
              <input
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="1299"
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none"
              />
            </div>
          </div>

          {/* Organization */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
            <h3 className="text-white font-medium">Organization</h3>
            <div>
              <label className="block text-sm text-[#a3a3a3] mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none"
              >
                <option value="tees">T-Shirts</option>
                <option value="outerwear">Hoodies & Fleece</option>
                <option value="bottoms">Cargo Pants</option>
                <option value="headwear">Caps & Headwear</option>
              </select>
            </div>

            <div className="pt-2">
              <BadgeTagSelector
                selectedBadges={badges}
                onChange={(newBadges) => setBadges(newBadges)}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
