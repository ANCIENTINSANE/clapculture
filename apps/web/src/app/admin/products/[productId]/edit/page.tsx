'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId || '1';

  // Mock initial data based on productId
  const initialData = {
    name: 'Vintage Oversized Graphic Tee',
    description: 'A premium heavy-weight cotton tee featuring a vintage inspired graphic print.',
    category: 'T-Shirts',
    tags: 'vintage, oversized, streetwear',
    price: '45.00',
    compareAtPrice: '60.00',
    sizes: { XS: 5, S: 12, M: 20, L: 15, XL: 8, XXL: 2 },
    images: ['image1.jpg', 'image2.jpg'],
    badges: { new: true, sale: false, limited: true }
  };

  const [formData, setFormData] = useState(initialData);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (size: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: { ...prev.sizes, [size]: parseInt(value) || 0 }
    }));
  };

  const handleBadgeChange = (badge: string) => {
    setFormData(prev => ({
      ...prev,
      badges: { ...prev.badges, [badge as keyof typeof prev.badges]: !prev.badges[badge as keyof typeof prev.badges] }
    }));
  };

  const handleSave = () => {
    alert('Product updated successfully!');
    // router.push('/admin/products');
  };

  const handleDelete = () => {
    alert('Product deleted!');
    setIsDeleteModalOpen(false);
    // router.push('/admin/products');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#a3a3a3] p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/products" className="text-[#a3a3a3] hover:text-white flex items-center justify-center p-2 rounded-full hover:bg-[#141414] border border-transparent hover:border-[#262626] transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </Link>
            <h1 className="text-2xl font-semibold text-white">Edit Product</h1>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="border border-red-500/20 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500/20 flex items-center space-x-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              <span>Delete</span>
            </button>
            <button 
              onClick={handleSave}
              className="bg-[#d2f000] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#b8d400] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-medium text-white mb-4">Basic Information</h2>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none transition-colors"
                  placeholder="e.g., Heavyweight Boxy Tee"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none transition-colors resize-none"
                  placeholder="Product description..."
                />
              </div>
            </div>

            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-medium text-white mb-4">Media</h2>
              <div className="border-2 border-dashed border-[#262626] rounded-xl p-8 text-center hover:border-[#737373] transition-colors cursor-pointer bg-[#1a1a1a]">
                <span className="material-symbols-outlined text-3xl text-[#737373] mb-2">cloud_upload</span>
                <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-[#737373]">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {formData.images.map((img, i) => (
                  <div key={i} className="aspect-square bg-[#1a1a1a] border border-[#262626] rounded-lg flex items-center justify-center relative group">
                    <span className="material-symbols-outlined text-[#737373]">image</span>
                    <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-medium text-white mb-4">Inventory & Sizes</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.sizes).map(([size, stock]) => (
                  <div key={size} className="space-y-2">
                    <label className="block text-sm font-medium text-white">Size {size}</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => handleSizeChange(size, e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none transition-colors"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-medium text-white mb-4">Pricing</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[#737373]">$</span>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg pl-8 pr-3 py-2 text-white focus:border-[#d2f000] outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Compare at Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[#737373]">$</span>
                    <input
                      type="text"
                      name="compareAtPrice"
                      value={formData.compareAtPrice}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg pl-8 pr-3 py-2 text-white focus:border-[#d2f000] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-medium text-white mb-4">Organization</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none transition-colors appearance-none"
                  >
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-medium text-white mb-4">Marketing Badges</h2>
              <div className="space-y-3">
                {Object.entries(formData.badges).map(([badge, isChecked]) => (
                  <label key={badge} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleBadgeChange(badge)}
                      className="form-checkbox h-5 w-5 rounded border-[#262626] bg-[#1a1a1a] text-[#d2f000] focus:ring-[#d2f000] focus:ring-offset-[#0a0a0a]"
                    />
                    <span className="text-white capitalize">{badge}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-xl w-full max-w-md p-6 space-y-6">
            <div>
              <h3 className="text-xl font-medium text-white mb-2">Delete Product</h3>
              <p className="text-[#a3a3a3]">Are you sure you want to delete this product? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="border border-[#262626] text-white px-4 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}