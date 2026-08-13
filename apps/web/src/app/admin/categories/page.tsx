'use client';

import React, { useState } from 'react';

type Category = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  createdAt: string;
  description: string;
};

const initialCategories: Category[] = [
  { id: '1', name: 'T-Shirts', slug: 't-shirts', productCount: 45, createdAt: '2023-10-01', description: 'All t-shirts and tops.' },
  { id: '2', name: 'Hoodies', slug: 'hoodies', productCount: 23, createdAt: '2023-10-05', description: 'Cozy hoodies and sweatshirts.' },
  { id: '3', name: 'Bottoms', slug: 'bottoms', productCount: 30, createdAt: '2023-10-10', description: 'Pants, shorts, and jeans.' },
  { id: '4', name: 'Accessories', slug: 'accessories', productCount: 15, createdAt: '2023-10-15', description: 'Hats, bags, and more.' },
  { id: '5', name: 'Caps', slug: 'caps', productCount: 8, createdAt: '2023-11-01', description: 'Snapbacks and beanies.' },
  { id: '6', name: 'Bags', slug: 'bags', productCount: 12, createdAt: '2023-11-10', description: 'Tote bags and backpacks.' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug, description: category.description });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
    } else {
      setCategories([...categories, { ...formData, id: Date.now().toString(), productCount: 0, createdAt: new Date().toISOString().split('T')[0] }]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(c => c.id !== categoryToDelete));
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#a3a3a3] p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Categories</h1>
          <button 
            onClick={openAddModal}
            className="bg-[#d2f000] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#b8d400] transition-colors flex items-center space-x-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Category</span>
          </button>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#262626]">
            <div className="relative max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#737373]">search</span>
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg pl-10 pr-3 py-2 text-white focus:border-[#d2f000] outline-none transition-colors"
              />
            </div>
          </div>
          
          {filteredCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1a1a1a] border-b border-[#262626]">
                  <tr>
                    <th className="p-4 font-medium text-white">Category Name</th>
                    <th className="p-4 font-medium text-white">Slug</th>
                    <th className="p-4 font-medium text-white">Product Count</th>
                    <th className="p-4 font-medium text-white">Created Date</th>
                    <th className="p-4 font-medium text-white text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {filteredCategories.map(category => (
                    <tr key={category.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="p-4 text-white font-medium">{category.name}</td>
                      <td className="p-4 text-[#737373]">{category.slug}</td>
                      <td className="p-4 text-[#a3a3a3]">{category.productCount}</td>
                      <td className="p-4 text-[#737373]">{category.createdAt}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => openEditModal(category)} className="p-2 text-[#737373] hover:text-[#d2f000] transition-colors">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button onClick={() => confirmDelete(category.id)} className="p-2 text-[#737373] hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-4xl text-[#262626] mb-4">category</span>
              <h3 className="text-lg font-medium text-white mb-2">No categories found</h3>
              <p className="text-[#737373]">Adjust your search or add a new category.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-white">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#737373] hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-[#737373] outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#262626]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="border border-[#262626] text-white px-4 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name}
                className="bg-[#d2f000] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#b8d400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-xl w-full max-w-md p-6 space-y-6">
            <div>
              <h3 className="text-xl font-medium text-white mb-2">Delete Category</h3>
              <p className="text-[#a3a3a3]">Are you sure you want to delete this category? This action cannot be undone.</p>
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