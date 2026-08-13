'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditProductClient({ productId }: { productId: string }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'tees',
    tags: '',
    price: '',
    compareAtPrice: '',
    isNew: false,
    isBestSeller: false,
    isLimited: false,
  });

  const [stockGrid, setStockGrid] = useState({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  const showNotification = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const handleStockChange = (size: string, value: string) => {
    const val = parseInt(value, 10) || 0;
    setStockGrid(prev => ({ ...prev, [size]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Product updated successfully!');
    setTimeout(() => router.push('/admin/products'), 1500);
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    showNotification('Product deleted');
    setTimeout(() => router.push('/admin/products'), 1500);
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen p-6 text-white">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#d2f000] text-black px-6 py-3 rounded-lg font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          {toast.msg}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Delete Product</h3>
            <p className="text-sm text-[#737373] mb-6">
              Are you sure you want to delete <span className="text-white font-bold">{formData.name}</span>? This action cannot be undone.
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
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-bold hover:bg-red-600/20 transition-colors"
          >
            Delete Product
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#737373] mb-1">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2 text-white focus:border-[#d2f000] outline-none"
                required
              />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#737373] mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2 text-white focus:border-[#d2f000] outline-none"
                >
                  <option value="tees">T-Shirts</option>
                  <option value="outerwear">Hoodies & Fleece</option>
                  <option value="bottoms">Cargo Pants</option>
                  <option value="headwear">Caps & Headwear</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#737373] mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2 text-white focus:border-[#d2f000] outline-none"
                />
              </div>
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
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2 text-white focus:border-[#d2f000] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Size & Inventory Grid */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase text-white mb-4">Size & Stock Quantities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(stockGrid).map(([size, count]) => (
                <div key={size} className="bg-[#1a1a1a] border border-[#262626] p-3 rounded-lg text-center">
                  <span className="text-xs font-bold text-[#d2f000] block mb-1 font-mono">{size}</span>
                  <input
                    type="number"
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
            <button type="submit" className="px-6 py-3 bg-[#d2f000] text-black font-bold rounded-lg hover:bg-white transition-colors uppercase tracking-wider font-mono">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
