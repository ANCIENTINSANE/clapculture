'use client';

import Link from 'next/link';
import { useState } from 'react';

const MOCK_ORDERS = [
  { id: 'CLAP1247', customer: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543210', amount: '₹4,598', paymentStatus: 'PENDING', orderStatus: 'PLACED', date: '2023-10-25' },
  { id: 'CLAP1246', customer: 'Priya Patel', email: 'priya@example.com', phone: '+91 9876543211', amount: '₹2,299', paymentStatus: 'VERIFIED', orderStatus: 'CONFIRMED', date: '2023-10-25' },
  { id: 'CLAP1245', customer: 'Amit Singh', email: 'amit@example.com', phone: '+91 9876543212', amount: '₹6,897', paymentStatus: 'VERIFIED', orderStatus: 'PROCESSING', date: '2023-10-24' },
  { id: 'CLAP1244', customer: 'Neha Gupta', email: 'neha@example.com', phone: '+91 9876543213', amount: '₹2,299', paymentStatus: 'VERIFIED', orderStatus: 'SHIPPED', date: '2023-10-24' },
  { id: 'CLAP1243', customer: 'Vikram Reddy', email: 'vikram@example.com', phone: '+91 9876543214', amount: '₹4,598', paymentStatus: 'VERIFIED', orderStatus: 'DELIVERED', date: '2023-10-23' },
  { id: 'CLAP1242', customer: 'Anjali Desai', email: 'anjali@example.com', phone: '+91 9876543215', amount: '₹2,299', paymentStatus: 'REJECTED', orderStatus: 'CANCELLED', date: '2023-10-23' },
  { id: 'CLAP1241', customer: 'Suresh Kumar', email: 'suresh@example.com', phone: '+91 9876543216', amount: '₹4,598', paymentStatus: 'SUBMITTED', orderStatus: 'PLACED', date: '2023-10-22' },
];

const TABS = ['All', 'Payment Pending', 'Payment Submitted', 'Verified', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        
        <div className="relative w-full sm:w-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#737373]">
            search
          </span>
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 bg-[#141414] border border-[#262626] rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#d2f000] transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab 
                ? 'bg-[#d2f000] text-black' 
                : 'bg-[#141414] text-[#a3a3a3] hover:text-white border border-[#262626]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#262626] bg-[#1a1a1a]">
                <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider">Order ID</th>
                <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider">Payment</th>
                <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-medium text-[#737373] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-white font-medium hover:text-[#d2f000]">
                      #{order.id}
                    </Link>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-white">{order.customer}</p>
                    <p className="text-xs text-[#737373]">{order.email}</p>
                  </td>
                  <td className="p-4 text-sm text-[#a3a3a3]">{order.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getPaymentBadgeColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getOrderBadgeColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-white font-medium">{order.amount}</td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-[#262626] text-white hover:bg-[#333] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-[#262626] flex items-center justify-between text-sm text-[#a3a3a3]">
          <span>Showing 1 to 7 of 42 entries</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-[#262626] hover:bg-[#262626] disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded bg-[#d2f000] text-black font-medium">1</button>
            <button className="px-3 py-1 rounded border border-[#262626] hover:bg-[#262626]">2</button>
            <button className="px-3 py-1 rounded border border-[#262626] hover:bg-[#262626]">3</button>
            <button className="px-3 py-1 rounded border border-[#262626] hover:bg-[#262626]">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
