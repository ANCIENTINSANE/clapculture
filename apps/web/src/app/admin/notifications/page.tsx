'use client';
import { useState } from 'react';

type NotificationType = 'order' | 'payment' | 'stock' | 'system' | 'customer';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'order', title: 'New order #CLAP10245', description: 'Alex ordered 2 items totaling $140.00', timestamp: '2 mins ago', read: false },
  { id: '2', type: 'payment', title: 'Payment received', description: 'Payment of $140.00 for #CLAP10245 verified', timestamp: '5 mins ago', read: false },
  { id: '3', type: 'stock', title: 'Low stock warning', description: 'CLAP OVERSIZED TEE (Black, M) is low on stock (2 left)', timestamp: '1 hour ago', read: false },
  { id: '4', type: 'customer', title: 'New customer registration', description: 'Sam joined ClapCulture', timestamp: '2 hours ago', read: true },
  { id: '5', type: 'order', title: 'Order #CLAP10244 shipped', description: 'Tracking #TRK987654321 added', timestamp: 'Yesterday', read: true },
  { id: '6', type: 'system', title: 'System maintenance scheduled', description: 'Downtime expected on Sunday at 2 AM', timestamp: 'Yesterday', read: true },
  { id: '7', type: 'payment', title: 'Refund processed', description: 'Refund of $45.00 for #CLAP10230 completed', timestamp: '2 days ago', read: true },
  { id: '8', type: 'order', title: 'New order #CLAP10243', description: 'Jordan ordered 1 item totaling $65.00', timestamp: '2 days ago', read: true },
  { id: '9', type: 'stock', title: 'Product restocked', description: 'CULTURE HOODIE (Grey, L) is back in stock', timestamp: '3 days ago', read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<string>('All');

  const tabs = ['All', 'Orders', 'Payments', 'Stock', 'System'];

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Orders') return n.type === 'order';
    if (activeTab === 'Payments') return n.type === 'payment';
    if (activeTab === 'Stock') return n.type === 'stock';
    if (activeTab === 'System') return n.type === 'system';
    return true;
  });

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'order': return 'shopping_bag';
      case 'payment': return 'payments';
      case 'stock': return 'warning';
      case 'customer': return 'person';
      case 'system': return 'settings';
      default: return 'notifications';
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <button
            onClick={markAllAsRead}
            className="text-sm bg-[#1a1a1a] border border-[#262626] text-white px-4 py-2 rounded-lg hover:bg-[#262626] transition-colors"
          >
            Mark All as Read
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-[#d2f000] text-black'
                  : 'bg-[#1a1a1a] border border-[#262626] text-[#a3a3a3] hover:bg-[#262626] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-5xl text-[#262626] mb-4">notifications_off</span>
              <p className="text-[#a3a3a3]">No notifications found in this category.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#262626]">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={`p-4 flex gap-4 transition-colors ${!notification.read ? 'cursor-pointer' : ''} ${
                    notification.read 
                      ? 'hover:bg-[#1a1a1a]' 
                      : 'bg-[#d2f000]/5 hover:bg-[#d2f000]/10 border-l-4 border-l-[#d2f000]'
                  }`}
                >
                  <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.read ? 'bg-[#1a1a1a] text-[#737373]' : 'bg-[#d2f000]/20 text-[#d2f000]'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{getIcon(notification.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className={`font-medium truncate ${notification.read ? 'text-[#a3a3a3]' : 'text-white'}`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-[#737373] whitespace-nowrap mt-1">
                        {notification.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-[#737373] mt-1">{notification.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}