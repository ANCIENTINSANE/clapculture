/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resolveImageUrl } from '@/lib/utils';
import { BadgeTagSelector } from '@/components/admin/BadgeTagSelector';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function EditProductClient({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: 'tees',
    tags: '',
    price: '',
    compareAtPrice: '',
    images: [] as string[],
    newImageUrl: '',
    badges: [] as string[],
  });


  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [existingProductName, setExistingProductName] = useState<string | null>(null);

  const [stockGrid, setStockGrid] = useState<Record<string, number>>({
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; msg: string; isError?: boolean }>({ show: false, msg: '' });
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (msg: string, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast({ show: false, msg: '' }), 3500);
  };

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) {
        showNotification('Failed to fetch product details from database', true);
        return;
      }
      const json = await res.json();
      if (json.success && json.data) {
        const p = json.data;
        const totalStock = Number(p.stock) || 0;
        const productSizes = Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L', 'XL', 'XXL'];

        // Initialize stock grid
        const newGrid: Record<string, number> = {
          XS: 0,
          S: 0,
          M: 0,
          L: 0,
          XL: 0,
          XXL: 0,
        };
        productSizes.forEach((sz: string, idx: number) => {
          newGrid[sz] = idx === 0 ? totalStock : Math.max(0, Math.floor(totalStock / productSizes.length));
        });

        setStockGrid(newGrid);
        setFormData({
          name: p.name || '',
          slug: p.slug || '',
          description: p.description || '',
          categoryId: p.categoryId || 'tees',
          tags: Array.isArray(p.badges) ? p.badges.join(', ') : '',
          price: p.price ? String(p.price) : '',
          compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
          images: Array.isArray(p.images) ? p.images : [],
          newImageUrl: '',
          badges: Array.isArray(p.badges) ? p.badges : [],
        });
      } else {
        showNotification(json.error || 'Product not found', true);
      }
    } catch {
      showNotification('Error loading product details', true);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    setTimeout(() => loadProduct(), 0);
  }, [loadProduct]);

  // Handle Name Change (slug is strictly generated from product name)
  const handleNameChange = (newName: string) => {
    setFormData(prev => ({
      ...prev,
      name: newName,
      slug: slugify(newName),
    }));
  };

  // Real-time slug availability check (excluding this product's own ID)
  useEffect(() => {
    if (!formData.slug.trim()) {
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
        const res = await fetch(
          `/api/products/check/slug?slug=${encodeURIComponent(formData.slug)}&excludeId=${encodeURIComponent(productId)}`
        );
        const json = await res.json();
        if (json.success) {
          if (json.available) {
            setSlugStatus('available');
            setExistingProductName(null);
          } else {
            setSlugStatus('taken');
            setExistingProductName(json.existingProduct?.name || 'another product');
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
  }, [formData.slug, productId]);

  const handleStockChange = (size: string, value: string) => {
    const val = parseInt(value, 10) || 0;
    setStockGrid(prev => ({ ...prev, [size]: val }));
  };

  const handleAddImage = () => {
    if (!formData.newImageUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, prev.newImageUrl.trim()],
      newImageUrl: '',
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugStatus === 'taken') {
      showNotification(`A product named "${existingProductName}" already uses this URL slug!`, true);
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const activeSizes = Object.entries(stockGrid)
        .filter(([, count]) => count >= 0)
        .map(([size]) => size);
      const totalStock = Object.values(stockGrid).reduce((sum, count) => sum + count, 0);

      const payload = {
        name: formData.name,
        slug: formData.slug || slugify(formData.name),
        description: formData.description,
        categoryId: formData.categoryId,
        price: Number(formData.price) || 699,
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        sizes: activeSizes.length > 0 ? activeSizes : ['S', 'M', 'L', 'XL', 'XXL'],
        stock: totalStock,
        badges: formData.badges,
        images: formData.images.length > 0 ? formData.images : ['/stock/superstar-mockup1.webp'],
      };

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('✨ Product updated successfully in database!');
        setTimeout(() => router.push('/admin/products'), 1200);
      } else {
        showNotification(json.error || 'Failed to update product', true);
      }
    } catch {
      showNotification('An error occurred while saving', true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('Product deleted from database');
        setTimeout(() => router.push('/admin/products'), 1200);
      } else {
        showNotification(json.error || 'Failed to delete product', true);
      }
    } catch {
      showNotification('Error deleting product', true);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen p-6 text-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-electric-lime border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-mono text-sm">Fetching product details from database...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen p-6 text-white">
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Delete Product</h3>
            <p className="text-sm text-[#737373] mb-6">
              Are you sure you want to delete <span className="text-white font-bold">{formData.name}</span> from the database? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-[#262626] text-white rounded-lg text-sm hover:bg-[#333] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-500 transition-colors"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="p-2 bg-[#141414] border border-[#262626] rounded-lg hover:border-[#d2f000] transition-colors">
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Edit Product</h1>
              <p className="text-xs text-[#737373] font-mono">ID: {productId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-bold hover:bg-red-600/20 transition-colors"
          >
            Delete Product
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-medium text-[#737373] mb-1">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2 text-white focus:border-[#d2f000] outline-none"
                required
              />
            </div>

            {/* URL Slug strictly derived from Product Name */}
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
                    value={formData.slug}
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
                    <div className="pr-3 text-green-400 flex items-center gap-1" title="URL slug is valid & available">
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

              {/* Status Notice */}
              {formData.slug.trim() && (
                <div className="mt-1.5 text-xs font-mono">
                  {slugStatus === 'checking' && (
                    <span className="text-gray-400">⏳ Verifying slug uniqueness...</span>
                  )}
                  {slugStatus === 'available' && (
                    <span className="text-green-400 flex items-center gap-1">
                      ✓ URL slug is unique and ready
                    </span>
                  )}
                  {slugStatus === 'taken' && (
                    <div className="p-2.5 rounded bg-red-950/40 border border-red-500/40 text-red-400 flex flex-col gap-0.5">
                      <span className="font-bold flex items-center gap-1">
                        ⚠️ URL slug already used by another product!
                      </span>
                      <span className="text-[11px] text-gray-300">
                        Product <strong className="text-white font-bold">&quot;{existingProductName}&quot;</strong> already uses this URL. Please choose a different name or slug.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#737373] mb-1">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg p-4 text-white focus:border-[#d2f000] outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#737373] mb-1">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData(p => ({ ...p, categoryId: e.target.value }))}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2 text-white focus:border-[#d2f000] outline-none"
              >
                <option value="tees">T-Shirts</option>
                <option value="outerwear">Hoodies & Outerwear</option>
                <option value="bottoms">Cargo Pants & Bottoms</option>
                <option value="headwear">Caps & Headwear</option>
              </select>
            </div>

            {/* Interactive Recommended Badges & Tags Selector */}
            <div className="pt-2">
              <BadgeTagSelector
                selectedBadges={formData.badges}
                onChange={(newBadges) => setFormData(p => ({ ...p, badges: newBadges, tags: newBadges.join(', ') }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-[#737373] mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2 text-white focus:border-[#d2f000] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#737373] mb-1">Compare-at Price (₹)</label>
                <input
                  type="number"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData(p => ({ ...p, compareAtPrice: e.target.value }))}
                  placeholder="Optional original price"
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2 text-white focus:border-[#d2f000] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase text-white mb-4">Product Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative aspect-3/4 bg-[#1a1a1a] border border-[#262626] rounded-lg overflow-hidden group">

                  <img src={resolveImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm block">close</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={formData.newImageUrl}
                onChange={(e) => setFormData(p => ({ ...p, newImageUrl: e.target.value }))}
                placeholder="Image path or URL (e.g. /stock/superstar-mockup1.webp)"
                className="flex-1 bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2 text-sm text-white focus:border-[#d2f000] outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-[#262626] text-white rounded-lg text-sm font-bold hover:bg-electric-lime hover:text-black transition-colors"
              >
                Add Image
              </button>
            </div>
          </div>

          {/* Size & Inventory Grid */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase text-white mb-4">Size & Stock Quantities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {Object.entries(stockGrid).map(([size, count]) => (
                <div key={size} className="bg-[#1a1a1a] border border-[#262626] p-3 rounded-lg text-center">
                  <span className="text-xs font-bold text-[#d2f000] block mb-1 font-mono">{size}</span>
                  <input
                    type="number"
                    min="0"
                    value={count}
                    onChange={(e) => handleStockChange(size, e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#262626] text-center text-sm rounded py-1 text-white focus:border-[#d2f000] outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link href="/admin/products" className="px-6 py-3 bg-[#1a1a1a] border border-[#262626] text-white rounded-lg font-bold hover:bg-[#262626] transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving || slugStatus === 'taken'}
              className="px-6 py-3 bg-[#d2f000] text-black font-bold rounded-lg hover:bg-white transition-colors uppercase tracking-wider font-mono disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
