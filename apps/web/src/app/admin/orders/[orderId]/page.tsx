'use client';

import { useState, use } from 'react';
import Link from 'next/link';

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [paymentStatus, setPaymentStatus] = useState('SUBMITTED');
  const [orderStatus, setOrderStatus] = useState('PLACED');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [toast, setToast] = useState<{show: boolean, msg: string}>({ show: false, msg: '' });

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const MOCK_ORDER = {
    id: orderId,
    date: 'Oct 25, 2023, 14:32 PM',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 9876543210'
    },
    address: {
      street: '123 Main Street, Apt 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400001',
      country: 'India'
    },
    items: [
      { id: 1, name: 'CLAP OVERSIDE TEE - BLACK', size: 'L', qty: 1, price: 2299, img: 'https://placehold.co/100x100/1a1a1a/fff?text=TEE' },
      { id: 2, name: 'CULTURE HOODIE - GREY', size: 'M', qty: 1, price: 3499, img: 'https://placehold.co/100x100/1a1a1a/fff?text=HOODIE' },
    ],
    subtotal: 5798,
    shipping: 100,
    total: 5898,
    payment: {
      transactionId: 'UPI1234567890',
      date: 'Oct 25, 2023, 14:35 PM',
      screenshot: 'https://placehold.co/300x500/1a1a1a/fff?text=Screenshot'
    }
  };

  const getBadgeColor = (status: string) => {
    switch(status) {
      case 'VERIFIED': case 'CONFIRMED': case 'DELIVERED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'PENDING': case 'PLACED': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'SUBMITTED': case 'PROCESSING': case 'SHIPPED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PACKED': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'REJECTED': case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi ${MOCK_ORDER.customer.name}, your order #${MOCK_ORDER.id} from CLAPCULTURE has been confirmed. Thank you for shopping with us!`);
    window.open(`https://wa.me/${MOCK_ORDER.customer.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 relative">
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-20 right-6 bg-[#d2f000] text-black px-4 py-3 rounded-lg shadow-lg z-50 font-medium flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/admin/orders" className="text-[#a3a3a3] hover:text-white transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Order #{MOCK_ORDER.id}</h1>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getBadgeColor(orderStatus)}`}>
              {orderStatus}
            </span>
          </div>
          <p className="text-sm text-[#737373] ml-9">{MOCK_ORDER.date}</p>
        </div>
        <div className="flex gap-3 ml-9 sm:ml-0">
          <button className="px-4 py-2 bg-[#141414] border border-[#262626] text-white rounded-lg text-sm hover:bg-[#1a1a1a] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#737373]">person</span>
                Customer Info
              </h3>
              <div className="space-y-3">
                <p className="text-white font-medium">{MOCK_ORDER.customer.name}</p>
                <a href={`mailto:${MOCK_ORDER.customer.email}`} className="text-[#a3a3a3] hover:text-[#d2f000] flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  {MOCK_ORDER.customer.email}
                </a>
                <a href={`tel:${MOCK_ORDER.customer.phone}`} className="text-[#a3a3a3] hover:text-[#d2f000] flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  {MOCK_ORDER.customer.phone}
                </a>
              </div>
            </div>
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#737373]">local_shipping</span>
                Delivery Address
              </h3>
              <div className="space-y-1 text-sm text-[#a3a3a3]">
                <p className="text-white">{MOCK_ORDER.customer.name}</p>
                <p>{MOCK_ORDER.address.street}</p>
                <p>{MOCK_ORDER.address.city}, {MOCK_ORDER.address.state} {MOCK_ORDER.address.zip}</p>
                <p>{MOCK_ORDER.address.country}</p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
            <h3 className="text-white font-medium mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#262626] text-[#737373] text-xs uppercase tracking-wider">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium text-center">Qty</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {MOCK_ORDER.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 flex items-center gap-3">
                        <img src={item.img} alt={item.name} className="w-12 h-12 rounded bg-[#1a1a1a] object-cover" />
                        <div>
                          <p className="text-sm text-white font-medium">{item.name}</p>
                          <p className="text-xs text-[#737373]">Size: {item.size}</p>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-[#a3a3a3]">₹{item.price}</td>
                      <td className="py-4 text-sm text-[#a3a3a3] text-center">{item.qty}</td>
                      <td className="py-4 text-sm text-white font-medium text-right">₹{item.price * item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#262626] space-y-2">
              <div className="flex justify-between text-sm text-[#a3a3a3]">
                <span>Subtotal</span>
                <span>₹{MOCK_ORDER.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-[#a3a3a3]">
                <span>Shipping</span>
                <span>₹{MOCK_ORDER.shipping}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#262626]">
                <span>Total</span>
                <span className="text-[#d2f000]">₹{MOCK_ORDER.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Card */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
            <h3 className="text-white font-medium mb-4 flex justify-between items-center">
              <span>Payment Details</span>
              <span className={`px-2 py-0.5 rounded text-xs border ${getBadgeColor(paymentStatus)}`}>
                {paymentStatus}
              </span>
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[#737373]">Transaction ID</span>
                <span className="text-white font-medium">{MOCK_ORDER.payment.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Date</span>
                <span className="text-white">{MOCK_ORDER.payment.date}</span>
              </div>
              
              <div className="mt-4">
                <p className="text-[#737373] mb-2">Payment Screenshot</p>
                <div className="border border-[#262626] rounded-lg overflow-hidden bg-[#1a1a1a]">
                  <img src={MOCK_ORDER.payment.screenshot} alt="Screenshot" className="w-full h-auto" />
                </div>
              </div>

              {paymentStatus === 'SUBMITTED' && (
                <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-[#262626]">
                  <button 
                    onClick={() => { setPaymentStatus('REJECTED'); showToast('Payment rejected'); }}
                    className="py-2 px-4 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium text-center"
                  >
                    REJECT
                  </button>
                  <button 
                    onClick={() => { setPaymentStatus('VERIFIED'); setOrderStatus('CONFIRMED'); showToast('Payment verified successfully'); }}
                    className="py-2 px-4 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 transition-colors font-medium text-center"
                  >
                    VERIFY
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Status Action */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
            <h3 className="text-white font-medium mb-4">Order Status</h3>
            
            <div className="space-y-4">
              {/* Timeline minimal */}
              <div className="space-y-4 mb-6">
                {['PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED'].map((step, idx) => {
                  const statusOrder = ['PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
                  const currentIndex = statusOrder.indexOf(orderStatus);
                  const stepIndex = statusOrder.indexOf(step);
                  const isPast = stepIndex <= currentIndex && orderStatus !== 'CANCELLED';
                  
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isPast ? 'bg-[#d2f000]' : 'bg-[#262626]'}`}>
                        {isPast && <div className="w-2 h-2 bg-black rounded-full" />}
                      </div>
                      <span className={`text-sm ${isPast ? 'text-white' : 'text-[#737373]'}`}>{step}</span>
                    </div>
                  );
                })}
              </div>

              {/* Status Actions */}
              {orderStatus !== 'CANCELLED' && orderStatus !== 'DELIVERED' && (
                <div className="pt-4 border-t border-[#262626] space-y-3">
                  {orderStatus === 'PLACED' && paymentStatus === 'VERIFIED' && (
                    <button 
                      onClick={() => { setOrderStatus('CONFIRMED'); showToast('Order confirmed'); }}
                      className="w-full py-2 bg-[#d2f000] text-black rounded-lg font-medium hover:bg-[#b8d400] transition-colors"
                    >
                      CONFIRM ORDER
                    </button>
                  )}
                  {orderStatus === 'CONFIRMED' && (
                    <button 
                      onClick={() => { setOrderStatus('PROCESSING'); showToast('Order processing'); }}
                      className="w-full py-2 bg-[#d2f000] text-black rounded-lg font-medium hover:bg-[#b8d400] transition-colors"
                    >
                      START PROCESSING
                    </button>
                  )}
                  {orderStatus === 'PROCESSING' && (
                    <button 
                      onClick={() => { setOrderStatus('PACKED'); showToast('Order marked as packed'); }}
                      className="w-full py-2 bg-[#d2f000] text-black rounded-lg font-medium hover:bg-[#b8d400] transition-colors"
                    >
                      MARK AS PACKED
                    </button>
                  )}
                  {orderStatus === 'PACKED' && (
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="Tracking Number"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm"
                      />
                      <button 
                        onClick={() => { 
                          if(!trackingNumber) return showToast('Please enter tracking number');
                          setOrderStatus('SHIPPED'); 
                          showToast('Order shipped'); 
                        }}
                        className="w-full py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                      >
                        MARK AS SHIPPED
                      </button>
                    </div>
                  )}
                  {orderStatus === 'SHIPPED' && (
                    <button 
                      onClick={() => { setOrderStatus('DELIVERED'); showToast('Order delivered'); }}
                      className="w-full py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      MARK AS DELIVERED
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      if(confirm('Are you sure you want to cancel this order?')) {
                        setOrderStatus('CANCELLED');
                        showToast('Order cancelled');
                      }
                    }}
                    className="w-full py-2 bg-transparent text-red-500 border border-red-500/20 rounded-lg font-medium hover:bg-red-500/10 transition-colors text-sm"
                  >
                    CANCEL ORDER
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Communication */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
            <h3 className="text-white font-medium mb-4">Communication</h3>
            <div className="space-y-3">
              <button 
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-lg font-medium hover:bg-[#25D366]/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Send WhatsApp Update
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 bg-[#1a1a1a] text-white border border-[#262626] rounded-lg font-medium hover:bg-[#262626] transition-colors">
                <span className="material-symbols-outlined text-[20px]">mail</span>
                Send Email Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
