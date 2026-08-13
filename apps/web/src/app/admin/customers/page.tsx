'use client';

import { useState } from 'react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Customers</h1>
      
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#262626]">
          <input
            type="text"
            placeholder="Search customers by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d2f000]"
          />
        </div>
        
        {filteredCustomers.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#262626] bg-[#1a1a1a] text-[#737373] text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium">Total Spent</th>
                <th className="p-4 font-medium">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626] text-sm">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-[#1a1a1a]">
                  <td className="p-4 font-medium text-white">{customer.name}</td>
                  <td className="p-4 text-[#a3a3a3]">
                    <div>{customer.email}</div>
                    <div className="text-xs text-[#737373]">{customer.phone}</div>
                  </td>
                  <td className="p-4 text-white">{customer.orders}</td>
                  <td className="p-4 font-medium text-[#d2f000]">{customer.spent}</td>
                  <td className="p-4 text-[#737373] text-xs">{customer.lastOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center text-[#737373]">
            <span className="material-symbols-outlined text-4xl mb-2 text-[#737373]">group</span>
            <p className="text-white text-base font-medium">No customers found</p>
            <p className="text-xs text-[#737373] mt-1">Customer profiles will automatically appear here once orders are placed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
