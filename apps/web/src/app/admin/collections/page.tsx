'use client';

import React, { useState } from 'react';

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  active: boolean;
  heroImage: string;
};

const initialCollections: Collection[] = [];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', slug: '', description: '', heroImage: '', active: true });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));
  };

  const openAddModal = () => {
    setEditingCollection(null);
    setFormData({ name: '', slug: '', description: '', heroImage: '', active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({ 
      name: collection.name, 
      slug: collection.slug, 
      description: collection.description,
      heroImage: collection.heroImage,
      active: collection.active
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingCollection) {
      setCollections(collections.map(c => c.id === editingCollection.id ? { ...c, ...formData } : c));
    } else {
      setCollections([...collections, { ...formData, id: Date.now().toString(), productCount: 0 }]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollectionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (collectionToDelete) {
      setCollections(collections.filter(c => c.id !== collectionToDelete));
    }
    setIsDeleteModalOpen(false);
  };

  const toggleActive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollections(collections.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#a3a3a3] p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Collections</h1>
          <button 
            onClick={openAddModal}
            className="bg-[#d2f000] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#b8d400] transition-colors flex items-center space-x-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Create Collection</span>
          </button>
        </div>

        {collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.map(collection => (
              <div 
                key={collection.id} 
                className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden group hover:border-[#737373] transition-colors cursor-pointer flex flex-col"
                onClick={() => openEditModal(collection)}
              >
                <div className="h-32 bg-gradient-to-br from-[#1a1a1a] to-[#262626] relative">
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button 
                      onClick={(e) => toggleActive(collection.id, e)}
                      className={`px-2 py-1 rounded text-xs font-medium border backdrop-blur-md ${collection.active ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}
                    >
                      {collection.active ? 'Active' : 'Inactive'}
                    </button>
                    <button 
                      onClick={(e) => confirmDelete(collection.id, e)}
                      className="p-1 bg-black/50 text-white rounded hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <span className="material-symbols-outlined text-[16px] block">delete</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-white font-medium text-lg mb-1">{collection.name}</h3>
                  <p className="text-[#737373] text-sm mb-3 line-clamp-2 flex-grow">{collection.description}</p>
                  <div className="flex items-center text-[#a3a3a3] text-sm mt-auto">
                    <span className="material-symbols-outlined text-[16px] mr-1">inventory_2</span>
                    <span>{collection.productCount} Products</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-4xl text-[#262626] mb-4">collections</span>
            <h3 className="text-lg font-medium text-white mb-2">No collections found</h3>
            <p className="text-[#737373] mb-4">Create your first collection to group your products.</p>
            <button 
              onClick={openAddModal}
              className="bg-[#d2f000] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#b8d400] transition-colors"
            >
              Create Collection
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-white">{editingCollection ? 'Edit Collection' : 'Create Collection'}</h3>
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Hero Image URL</label>
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({...formData, heroImage: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none transition-colors"
                />
              </div>
              <label className="flex items-center space-x-3 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="form-checkbox h-5 w-5 rounded border-[#262626] bg-[#1a1a1a] text-[#d2f000] focus:ring-[#d2f000] focus:ring-offset-[#0a0a0a]"
                />
                <span className="text-white">Active</span>
              </label>
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
              <h3 className="text-xl font-medium text-white mb-2">Delete Collection</h3>
              <p className="text-[#a3a3a3]">Are you sure you want to delete this collection? This action cannot be undone.</p>
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