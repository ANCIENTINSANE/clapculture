'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface AdminProduct {
  id: string;
  name: string;
  img: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  created: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  useEffect(() => {
    async function loadDynamicProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            const mapped: AdminProduct[] = data.data.map((doc: Record<string, unknown>) => ({
              id: String(doc.$id || doc.id || ''),
              name: String(doc.name || 'Untitled Product'),
              img: Array.isArray(doc.images) && doc.images[0] ? String(doc.images[0]) : '/stock/superstar-mockup1.webp',
              category: doc.categoryId === 'c2' ? 'Hoodies' : 'T-Shirts',
              price: `₹${doc.price || 699}`,
              stock: Number(doc.stock) || 0,
              status: (Number(doc.stock) || 0) > 0 ? 'Active' : 'Sold Out',
              created: doc.$createdAt ? new Date(doc.$createdAt as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently',
            }));
            setProducts(mapped);
          }
        }
      } catch {
        // Handled silently
      }
    }
    loadDynamicProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <Link href="/admin/products/new" className="bg-[#d2f000] text-black font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#b8d400] transition-colors">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#737373]">search</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#141414] border border-[#262626] rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#d2f000] transition-colors"
          />
        </div>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#141414] border border-[#262626] rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-[#d2f000]"
        >
          <option>All Categories</option>
          <option>T-Shirts</option>
          <option>Hoodies</option>
          <option>Bottoms</option>
          <option>Accessories</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#262626] bg-[#1a1a1a]">
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase">Product</th>
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase">Category</th>
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase">Price</th>
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase">Stock</th>
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase">Status</th>
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.img} alt={product.name} className="w-12 h-12 rounded bg-[#262626] object-cover" />
                        <div>
                          <p className="text-white font-medium text-sm">{product.name}</p>
                          <p className="text-[#737373] text-xs">Created {product.created}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#a3a3a3]">{product.category}</td>
                    <td className="p-4 text-sm text-white font-medium">{product.price}</td>
                    <td className="p-4">
                      <span className={`text-sm ${product.stock === 0 ? 'text-red-500' : product.stock < 15 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs border ${
                        product.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`} className="p-2 bg-[#262626] text-[#a3a3a3] hover:text-white rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-[#737373]">
            <span className="material-symbols-outlined text-4xl mb-2 text-[#737373]">inventory_2</span>
            <p className="text-white text-base font-medium">No products found</p>
            <p className="text-xs text-[#737373] mt-1 mb-4">Get started by creating your first product item.</p>
            <Link href="/admin/products/new" className="inline-flex items-center gap-2 bg-[#d2f000] text-black font-medium px-4 py-2 rounded-lg text-sm hover:bg-[#b8d400] transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
