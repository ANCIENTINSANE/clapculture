'use client';

import { useState, useEffect, useCallback } from 'react';

type InventoryItem = {
  id: string;
  productId: string;
  product: string;
  sku: string;
  size: string;
  stock: number;
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products?limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const items: InventoryItem[] = [];
          data.data.forEach((p: Record<string, unknown>) => {
            const pId = String(p.$id || p.id || '');
            const pName = String(p.name || 'Untitled');
            const pSlug = String(p.slug || pId);
            const sizes = Array.isArray(p.sizes) ? p.sizes : ['Free Size'];
            const stockTotal = Number(p.stock) || 0;

            sizes.forEach((sz, idx) => {
              items.push({
                id: `${pId}-${sz}`,
                productId: pId,
                product: pName,
                sku: `${pSlug.toUpperCase().slice(0, 10)}-${sz}`,
                size: String(sz),
                stock: idx === 0 ? stockTotal : Math.max(0, Math.floor(stockTotal / sizes.length)),
              });
            });
          });
          setInventory(items);
        }
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const getStatus = (stock: number) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 15) return 'low-stock';
    return 'in-stock';
  };

  const getStatusBadge = (stock: number) => {
    if (stock === 0) {
      return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">Out of Stock</span>;
    }
    if (stock <= 15) {
      return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Low Stock</span>;
    }
    return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">In Stock</span>;
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(search.toLowerCase()) || 
                          item.sku.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    const status = getStatus(item.stock);
    if (filter === 'all') return true;
    return status === filter;
  });

  const handleEditStart = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditValue(item.stock.toString());
  };

  const handleEditSave = async () => {
    if (editingId) {
      const numValue = parseInt(editValue, 10);
      if (!isNaN(numValue) && numValue >= 0) {
        const targetItem = inventory.find(i => i.id === editingId);
        setInventory(inventory.map(item => 
          item.id === editingId ? { ...item, stock: numValue } : item
        ));

        // Persist stock to API
        if (targetItem?.productId) {
          const token = localStorage.getItem('adminToken');
          fetch(`/api/products/${targetItem.productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ stock: numValue }),
          }).catch(() => {});
        }
      }
      setEditingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEditSave();
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#0a0a0a] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Inventory Management</h1>
          <p className="text-[#a3a3a3]">Track and update your product stock levels in real-time from the database.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={loadInventory} className="border border-[#262626] text-white px-4 py-2 rounded-lg hover:bg-[#1a1a1a] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#262626] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'in-stock', label: 'In Stock' },
              { id: 'low-stock', label: 'Low Stock' },
              { id: 'out-of-stock', label: 'Out of Stock' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as "all" | "in-stock" | "low-stock" | "out-of-stock")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab.id 
                    ? 'bg-[#262626] text-white' 
                    : 'text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#737373] text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search products or SKUs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-white focus:border-[#d2f000] outline-none text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left divide-y divide-[#262626]">
            <thead>
              <tr className="bg-[#1a1a1a] text-[#737373] text-sm">
                <th className="px-6 py-3 font-medium">Product / SKU</th>
                <th className="px-6 py-3 font-medium">Size</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="w-6 h-6 border-2 border-electric-lime border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-[#a3a3a3]">Loading inventory from database...</p>
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-[#262626] mb-2">inventory_2</span>
                    <p className="text-[#a3a3a3]">No inventory items found.</p>
                  </td>
                </tr>
              ) : (
                filteredInventory.map(item => (
                  <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{item.product}</span>
                        <span className="text-[#737373] text-sm">{item.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#a3a3a3]">{item.size}</td>
                    <td className="px-6 py-4">{getStatusBadge(item.stock)}</td>
                    <td className="px-6 py-4 text-right">
                      {editingId === item.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <input 
                            type="number" 
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            onBlur={handleEditSave}
                            className="w-20 bg-[#1a1a1a] border border-[#d2f000] rounded px-2 py-1 text-white text-right outline-none"
                          />
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleEditStart(item)}
                          className="text-white hover:text-[#d2f000] flex items-center justify-end gap-2 w-full group"
                          title="Click to edit stock level"
                        >
                          <span className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-[16px] text-[#737373]">edit</span>
                          <span className="font-medium text-lg">{item.stock}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}