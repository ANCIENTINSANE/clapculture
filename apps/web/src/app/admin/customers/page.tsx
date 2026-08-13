'use client';

export default function CustomersPage() {
  const CUSTOMERS = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543210', orders: 4, spent: '₹12,400', lastOrder: 'Oct 25, 2023' },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', phone: '+91 9876543211', orders: 1, spent: '₹2,299', lastOrder: 'Oct 24, 2023' },
    { id: 3, name: 'Amit Singh', email: 'amit@example.com', phone: '+91 9876543212', orders: 7, spent: '₹28,500', lastOrder: 'Oct 20, 2023' },
    { id: 4, name: 'Neha Gupta', email: 'neha@example.com', phone: '+91 9876543213', orders: 2, spent: '₹4,598', lastOrder: 'Sep 15, 2023' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Customers</h1>
      
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#262626]">
          <input
            type="text"
            placeholder="Search customers by name, email or phone..."
            className="w-full max-w-md bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d2f000]"
          />
        </div>
        
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
          <tbody className="divide-y divide-[#262626]">
            {CUSTOMERS.map((c) => (
              <tr key={c.id} className="hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#262626] text-white flex items-center justify-center font-medium">
                      {c.name.charAt(0)}
                    </div>
                    <span className="text-white font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm">
                  <p className="text-white">{c.email}</p>
                  <p className="text-[#737373]">{c.phone}</p>
                </td>
                <td className="p-4 text-sm text-[#a3a3a3]">{c.orders}</td>
                <td className="p-4 text-sm text-[#d2f000] font-medium">{c.spent}</td>
                <td className="p-4 text-sm text-[#a3a3a3]">{c.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
