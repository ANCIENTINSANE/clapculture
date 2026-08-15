import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-deep-black border-t border-charcoal py-12 md:py-16 px-4 md:px-8 lg:px-12 2xl:px-16 w-full">
      <div className="max-w-[3840px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="text-3xl md:text-4xl 2xl:text-6xl font-headline-md text-white tracking-wider mb-4 md:mb-6 inline-block">
              CLAPCULTURE
            </Link>
            <p className="text-gray-400 text-xs md:text-sm 2xl:text-base max-w-sm mb-4">
              Redefining streetwear for the modern rebel. High-quality apparel designed to make a statement.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/clapculture_"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow us on Instagram (@clapculture_)"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-pink-400 font-mono transition-colors bg-charcoal border border-gray-800 px-3 py-1.5 rounded"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
                <span>@clapculture_</span>
              </a>
              <a
                href="https://wa.me/917569684299?text=Hi%20CLAPCULTURE%20Team"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp (+91 7569684299)"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#25D366] font-mono transition-colors bg-charcoal border border-gray-800 px-3 py-1.5 rounded"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 md:mb-6 text-white text-xs md:text-sm 2xl:text-base">SHOP</h4>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm 2xl:text-base text-gray-400">
              <li><Link href="/shop" className="hover:text-electric-lime transition-colors">All Products</Link></li>
              <li><Link href="/collections/hoodies" className="hover:text-electric-lime transition-colors">Hoodies</Link></li>
              <li><Link href="/collections/t-shirts" className="hover:text-electric-lime transition-colors">T-Shirts</Link></li>
              <li><Link href="/collections/bottoms" className="hover:text-electric-lime transition-colors">Bottoms</Link></li>
              <li><Link href="/collections/accessories" className="hover:text-electric-lime transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 md:mb-6 text-white text-xs md:text-sm 2xl:text-base">COMPANY</h4>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm 2xl:text-base text-gray-400">
              <li><Link href="/about" className="hover:text-electric-lime transition-colors">About Us</Link></li>
              <li><Link href="/our-story" className="hover:text-electric-lime transition-colors">Our Story</Link></li>
              <li><Link href="/careers" className="hover:text-electric-lime transition-colors">Careers</Link></li>
              <li><Link href="/sustainability" className="hover:text-electric-lime transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 md:mb-6 text-white text-xs md:text-sm 2xl:text-base">HELP</h4>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm 2xl:text-base text-gray-400">
              <li><Link href="/faq" className="hover:text-electric-lime transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-electric-lime transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-electric-lime transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/track-order" className="hover:text-electric-lime transition-colors">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-electric-lime transition-colors">Contact Us</Link></li>
              <li>
                <a 
                  href="https://wa.me/917569684299?text=Hi%20CLAPCULTURE%20Team%2C%20I%20need%20assistance." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline font-mono"
                >
                  <span>WhatsApp: 7569684299</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 md:mb-6 text-white text-xs md:text-sm 2xl:text-base">LEGAL</h4>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm 2xl:text-base text-gray-400">
              <li><Link href="/terms" className="hover:text-electric-lime transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-electric-lime transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-electric-lime transition-colors">Refund Policy</Link></li>
              <li><Link href="/cookie" className="hover:text-electric-lime transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row items-center justify-between pt-6 md:pt-8 border-t border-charcoal gap-6 text-center md:text-left">
          <div className="text-gray-500 text-[10px] md:text-xs 2xl:text-sm">
            © {new Date().getFullYear()} CLAPCULTURE. All rights reserved. • Designed & Developed by <a href="https://vcard.stemlen.com/u/surendra" target="_blank" rel="noopener noreferrer" className="text-electric-lime hover:underline">surendra.codes</a>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
            <span className="text-[10px] md:text-xs 2xl:text-sm text-gray-400 uppercase font-bold mr-0 sm:mr-2">WE ACCEPT:</span>
            <div className="flex flex-wrap justify-center gap-2">
              <div className="bg-white/10 px-2 py-1 rounded text-[9px] md:text-[10px] 2xl:text-xs font-bold">VISA</div>
              <div className="bg-white/10 px-2 py-1 rounded text-[9px] md:text-[10px] 2xl:text-xs font-bold">MC</div>
              <div className="bg-white/10 px-2 py-1 rounded text-[9px] md:text-[10px] 2xl:text-xs font-bold">UPI</div>
              <div className="bg-white/10 px-2 py-1 rounded text-[9px] md:text-[10px] 2xl:text-xs font-bold">PAY</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
