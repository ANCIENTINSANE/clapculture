'use client';

import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Orders', value: '0', icon: 'shopping_bag', color: 'text-blue-400' },
    { label: 'Total Sales', value: '₹0', icon: 'payments', color: 'text-green-400' },
    { label: 'Pending Payments', value: '0', icon: 'pending', color: 'text-yellow-400' },
    { label: 'Confirmed Orders', value: '0', icon: 'check_circle', color: 'text-[#d2f000]' },
    { label: 'Shipped', value: '0', icon: 'local_shipping', color: 'text-purple-400' },
    { label: 'Delivered', value: '0', icon: 'inventory', color: 'text-gray-400' },
  ];

  const recentOrders: any[] = [];

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/orders?status=pending" className="bg-[#141414] border border-[#262626] hover:border-[#d2f000] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-[18px] text-yellow-400">warning</span>
          View Pending Payments
        </Link>
        <Link href="/admin/products/new" className="bg-[#141414] border border-[#262626] hover:border-[#d2f000] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
        <Link href="/admin/orders?status=new" className="bg-[#d2f000] text-black font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#b8d400] transition-colors">
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          View New Orders
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#141414] border border-[#262626] rounded-xl p-4">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#a3a3a3] text-sm font-medium">{stat.label}</span>
              <span className={`material-symbols-outlined text-[20px] ${stat.color}`}>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#262626] rounded-xl p-6">
          <h3 className="text-white font-medium mb-4">Revenue Overview</h3>
          <div className="h-64 w-full bg-[#1a1a1a] rounded-lg flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#262626]">
            <span className="material-symbols-outlined text-4xl text-[#737373] mb-2">bar_chart</span>
            <p className="text-white text-sm font-medium">No sales data recorded yet</p>
            <p className="text-xs text-[#737373] mt-1">Revenue chart will populate automatically as orders are placed.</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-[#d2f000] hover:underline">View All</Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order, i) => (
                <div key={i} className="flex justify-between items-center p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors border border-transparent hover:border-[#262626]">
                  <div>
                    <Link href={`/admin/orders/${order.id.replace('#', '')}`} className="text-white font-medium hover:text-[#d2f000]">{order.id}</Link>
                    <p className="text-sm text-[#737373]">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">{order.amount}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#262626] text-[#a3a3a3]">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[#737373]">
              <span className="material-symbols-outlined text-3xl mb-2 text-[#737373]">inbox</span>
              <p className="text-white text-sm font-medium">No recent orders</p>
              <p className="text-xs text-[#737373] mt-1">New customer orders will show up here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
