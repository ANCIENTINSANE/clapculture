'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const TABS = ['All', 'Payment Pending', 'Payment Submitted', 'Verified', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

interface AdminOrder {
  id: string;
  docId: string;
  customer: string;
  email: string;
  date: string;
  paymentStatus: string;
  orderStatus: string;
  amount: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const res = await fetch('/api/orders?limit=100', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const mapped: AdminOrder[] = data.data.map((doc: Record<string, unknown>) => {
            const customerObj = typeof doc.customer === 'string' 
              ? JSON.parse(doc.customer as string) 
              : ((doc.customer || {}) as Record<string, string | undefined>);
            return {
              id: String(doc.orderId || doc.$id || '').replace('#', ''),
              docId: String(doc.$id || doc.orderId || ''),
              customer: customerObj.fullName || 'Valued Rebel',
              email: customerObj.email || 'customer@example.com',
              date: doc.$createdAt ? new Date(doc.$createdAt as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today',
              paymentStatus: String(doc.paymentStatus || 'PENDING'),
              orderStatus: String(doc.orderStatus || 'PLACED'),
              amount: `₹${doc.total || 0}`,
            };
          });
          setOrders(mapped);
        }
      }
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        const res = await fetch('/api/orders?limit=100', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok && !cancelled) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const mapped: AdminOrder[] = data.data.map((doc: Record<string, unknown>) => {
              const customerObj = typeof doc.customer === 'string' 
                ? JSON.parse(doc.customer as string) 
                : ((doc.customer || {}) as Record<string, string | undefined>);
              return {
                id: String(doc.orderId || doc.$id || '').replace('#', ''),
                docId: String(doc.$id || doc.orderId || ''),
                customer: customerObj.fullName || 'Valued Rebel',
                email: customerObj.email || 'customer@example.com',
                date: doc.$createdAt ? new Date(doc.$createdAt as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today',
                paymentStatus: String(doc.paymentStatus || 'PENDING'),
                orderStatus: String(doc.orderStatus || 'PLACED'),
                amount: `₹${doc.total || 0}`,
              };
            });
            setOrders(mapped);
          }
        }
      } catch {
        // Handle error silently
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOrders();
    return () => { cancelled = true; };
  }, []);

  const handleQuickVerify = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          paymentStatus: 'VERIFIED',
          orderStatus: 'CONFIRMED',
        }),
      });
      if (res.ok) {
        loadOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getPaymentBadgeColor = (status: string) => {
    switch(status) {
      case 'VERIFIED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'SUBMITTED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getOrderBadgeColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED': 
      case 'DELIVERED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'PLACED': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'PROCESSING': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PACKED': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'SHIPPED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = search === '' || 
      o.id.toLowerCase().includes(search.toLowerCase()) || 
      o.customer.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'All') return true;
    if (activeTab === 'Payment Pending') return o.paymentStatus === 'PENDING';
    if (activeTab === 'Payment Submitted') return o.paymentStatus === 'SUBMITTED';
    if (activeTab === 'Verified') return o.paymentStatus === 'VERIFIED';
    if (activeTab === 'Confirmed') return o.orderStatus === 'CONFIRMED';
    if (activeTab === 'Processing') return o.orderStatus === 'PROCESSING';
    if (activeTab === 'Shipped') return o.orderStatus === 'SHIPPED';
    if (activeTab === 'Delivered') return o.orderStatus === 'DELIVERED';
    if (activeTab === 'Cancelled') return o.orderStatus === 'CANCELLED';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono">Orders Management</h1>
          <p className="text-xs text-[#737373] mt-1 font-mono">
            Manage live orders, verify payments, and dispatch shipments ({orders.length} total orders)
          </p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#737373]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 bg-[#141414] border border-[#262626] rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-electric-lime transition-colors font-mono"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-mono font-bold transition-colors cursor-pointer ${
              activeTab === tab 
                ? 'bg-electric-lime text-black' 
                : 'bg-[#141414] text-[#a3a3a3] hover:text-white border border-[#262626]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-electric-lime border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-mono text-[#a3a3a3]">Loading orders from Appwrite database...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#262626] bg-[#1a1a1a]">
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider font-mono">Order ID</th>
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider font-mono">Customer</th>
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider font-mono">Date</th>
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider font-mono">Payment</th>
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider font-mono">Status</th>
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider font-mono">Amount</th>
                  <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider font-mono text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {filteredOrders.map((order) => (
                  <tr key={order.docId || order.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.docId}`} className="text-white font-bold font-mono hover:text-electric-lime">
                        #{order.id}
                      </Link>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-white">{order.customer}</p>
                      <p className="text-xs text-[#737373] font-mono">{order.email}</p>
                    </td>
                    <td className="p-4 text-sm text-[#a3a3a3] font-mono">{order.date}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium font-mono border ${getPaymentBadgeColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium font-mono border ${getOrderBadgeColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white font-bold font-mono">{order.amount}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.paymentStatus !== 'VERIFIED' && (
                          <button
                            onClick={(e) => handleQuickVerify(order.docId || order.id, e)}
                            className="text-xs bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/30 px-2.5 py-1.5 rounded font-mono font-bold transition-all"
                            title="Quick Confirm & Verify"
                          >
                            ✓ Confirm
                          </button>
                        )}
                        <Link 
                          href={`/admin/orders/${order.docId}`}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-[#262626] text-white hover:bg-electric-lime hover:text-black transition-colors"
                          title="View Order Details"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
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
            <span className="material-symbols-outlined text-4xl mb-2 text-[#737373]">receipt_long</span>
            <p className="text-white text-base font-medium font-mono">No orders found</p>
            <p className="text-xs text-[#737373] mt-1 font-mono">When customer orders are placed, they will appear in this list.</p>
          </div>
        )}
      </div>
    </div>
  );
}
