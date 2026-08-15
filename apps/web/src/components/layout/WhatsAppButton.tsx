'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

export function WhatsAppButton() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Hide floating WhatsApp button on admin routes to prevent overlay on admin controls
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const phoneNumber = '917569684299';
  const message = encodeURIComponent('Hi CLAPCULTURE Team, I need help with an order/product inquiry.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip */}
      <div
        className={`hidden sm:flex items-center bg-[#141414] border border-[#2e2e2e] text-white text-xs font-mono py-2 px-3.5 rounded-full shadow-2xl mr-3 transition-all duration-300 pointer-events-none select-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] mr-2 animate-pulse" />
        <span>Chat on WhatsApp (+91 7569684299)</span>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chat with us on WhatsApp"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        <svg
          className="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.778.978-.954 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.588-.493-.508-.678-.518-.176-.009-.377-.01-.578-.01-.201 0-.527.075-.803.376-.276.3-1.054 1.03-1.054 2.512 0 1.482 1.079 2.912 1.23 3.113.15.2 2.123 3.242 5.143 4.547.718.31 1.279.496 1.716.635.722.23 1.379.197 1.898.12.578-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.2-.577-.351zM12.042 21.996h-.008c-1.77 0-3.507-.476-5.029-1.376l-.361-.214-3.741.981 1-3.647-.235-.374a10.024 10.024 0 0 1-1.536-5.326c0-5.545 4.512-10.058 10.06-10.058 2.687 0 5.214 1.047 7.114 2.95 1.9 1.902 2.946 4.43 2.944 7.12-.004 5.548-4.517 10.061-10.069 10.061zM12.042 0C5.402 0 0 5.402 0 12.042c0 2.12.553 4.19 1.603 6.01L0 24l6.113-1.603a11.966 11.966 0 0 0 5.929 1.56h.005c6.638 0 12.04-5.402 12.04-12.042C24.087 5.402 18.685 0 12.042 0z" />
        </svg>
      </a>
    </div>
  );
}
