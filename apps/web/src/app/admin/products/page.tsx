'use client';

import Link from 'next/link';

const MOCK_PRODUCTS = [
  { id: '1', name: 'CLAP OVERSIZED TEE - BLACK', category: 'T-Shirts', price: '₹2,299', stock: 45, status: 'Active', created: 'Oct 20, 2023', img: 'https://placehold.co/100x100/1a1a1a/fff?text=TEE' },
  { id: '2', name: 'CULTURE HOODIE - GREY', category: 'Hoodies', price: '₹3,499', stock: 12, status: 'Active', created: 'Oct 18, 2023', img: 'https://placehold.co/100x100/1a1a1a/fff?text=HOODIE' },
  { id: '3', name: 'STREET CARGO PANTS', category: 'Bottoms', price: '₹2,899', stock: 0, status: 'Out of Stock', created: 'Oct 15, 2023', img: 'https://placehold.co/100x100/1a1a1a/fff?text=CARGO' },
  { id: '4', name: 'CLAP CAP - LIMITED', category: 'Accessories', price: '₹999', stock: 120, status: 'Active', created: 'Oct 10, 2023', img: 'https://placehold.co/100x100/1a1a1a/fff?text=CAP' },
  { id: '5', name: 'VINTAGE WASH TEE', category: 'T-Shirts', price: '₹2,499', stock: 8, status: 'Active', created: 'Oct 05, 2023', img: 'https://placehold.co/100x100/1a1a1a/fff?text=TEE2' },
];

export default function ProductsPage() {
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
            className="w-full bg-[#141414] border border-[#262626] rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#d2f000] transition-colors"
          />
        </div>
        <select className="bg-[#141414] border border-[#262626] rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-[#d2f000]">
          <option>All Categories</option>
          <option>T-Shirts</option>
          <option>Hoodies</option>
          <option>Bottoms</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
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
              {MOCK_PRODUCTS.map((product) => (
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
                      <button className="p-2 bg-[#262626] text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
