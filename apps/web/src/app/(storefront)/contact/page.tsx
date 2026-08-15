'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to transmit message. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-white pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-headline-xl text-5xl md:text-7xl uppercase mb-4">HIT US UP</h1>
        <p className="text-gray-400 font-label-caps tracking-widest">WE&apos;RE HERE FOR THE CULTURE.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-16">
        <div className="w-full md:w-1/2">
          {status === 'success' ? (
            <div className="bg-charcoal p-10 md:p-12 text-center border border-electric-lime rounded-lg animate-in fade-in duration-500">
              <span className="material-symbols-outlined text-6xl text-electric-lime mb-4">check_circle</span>
              <h2 className="font-headline-md text-3xl uppercase mb-2">TRANSMISSION RECEIVED</h2>
              <p className="text-gray-300 mb-2">
                Thank you, <strong className="text-white">{formData.name}</strong>. A confirmation email has been dispatched to <strong className="text-electric-lime">{formData.email}</strong>.
              </p>
              <p className="text-gray-400 text-sm mb-6">Our support crew will respond within 24 hours.</p>
              <button
                onClick={() => {
                  setStatus('idle');
                  setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                }}
                className="bg-transparent border border-gray-600 hover:border-electric-lime hover:text-electric-lime text-xs font-label-caps uppercase px-6 py-2.5 transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === 'error' && (
                <div className="p-3.5 bg-red-950/80 border border-red-500 rounded text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="NAME *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-charcoal border border-gray-700 p-4 text-white focus:outline-none focus:border-electric-lime text-sm"
                />
                <input
                  required
                  type="email"
                  placeholder="EMAIL *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-charcoal border border-gray-700 p-4 text-white focus:outline-none focus:border-electric-lime text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="SUBJECT *"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-charcoal border border-gray-700 p-4 text-white focus:outline-none focus:border-electric-lime text-sm"
                />
                <input
                  type="tel"
                  placeholder="PHONE (OPTIONAL)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-charcoal border border-gray-700 p-4 text-white focus:outline-none focus:border-electric-lime text-sm"
                />
              </div>

              <textarea
                required
                placeholder="YOUR MESSAGE *"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-charcoal border border-gray-700 p-4 text-white focus:outline-none focus:border-electric-lime resize-none text-sm"
              ></textarea>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-electric-lime text-black font-headline-md text-xl py-4 uppercase hover:bg-white transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    TRANSMITTING...
                  </>
                ) : (
                  'SEND MESSAGE'
                )}
              </button>
            </form>
          )}
        </div>

        <div className="w-full md:w-1/2 space-y-10">
          <div>
            <h2 className="font-headline-md text-2xl uppercase border-b border-charcoal pb-2 mb-4">CONTACT INFO</h2>
            <div className="space-y-4 text-gray-300 font-body-sm">
              <p className="flex items-center gap-4">
                <span className="material-symbols-outlined text-electric-lime">mail</span>
                <a href="mailto:clapcultureofficial@gmail.com" className="hover:underline text-white">clapcultureofficial@gmail.com</a>
              </p>
              <p className="flex items-center gap-4">
                <span className="material-symbols-outlined text-electric-lime">chat</span>
                <a 
                  href="https://wa.me/917569684299?text=Hi%20CLAPCULTURE%20Team%2C%20I%20have%20an%20inquiry." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline text-white flex items-center gap-2"
                >
                  <span>WhatsApp: <strong className="text-electric-lime font-mono">+91 7569684299</strong></span>
                  <span className="text-[10px] bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 px-2 py-0.5 rounded font-bold uppercase">Chat Now</span>
                </a>
              </p>
              <p className="flex items-center gap-4">
                <span className="material-symbols-outlined text-electric-lime">photo_camera</span>
                <a 
                  href="https://www.instagram.com/clapculture_" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline text-white flex items-center gap-2"
                >
                  <span>Instagram: <strong className="text-electric-lime font-mono">@clapculture_</strong></span>
                  <span className="text-[10px] bg-pink-500/20 text-pink-400 border border-pink-500/40 px-2 py-0.5 rounded font-bold uppercase">Follow</span>
                </a>
              </p>
              <p className="flex items-center gap-4">
                <span className="material-symbols-outlined text-electric-lime">support_agent</span>
                <span>Direct Support Mon&ndash;Sun 10:00 AM &ndash; 8:00 PM IST</span>
              </p>
              <p className="flex items-center gap-4">
                <span className="material-symbols-outlined text-electric-lime">location_on</span>
                <span>Hyderabad, Telangana, India</span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-headline-md text-2xl uppercase border-b border-charcoal pb-2 mb-4">CONNECT</h2>
            <div className="flex gap-4">
              <a 
                href="https://wa.me/917569684299?text=Hi%20CLAPCULTURE%20Team" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Chat on WhatsApp"
                className="w-12 h-12 bg-charcoal border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all rounded-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.301-.15-1.777-.877-2.052-.977-.276-.1-.476-.15-.677.15-.2.3-.777.977-.952 1.177-.175.2-.351.225-.651.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.3-.019-.462.132-.612.136-.135.301-.35.451-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.677-1.633-.928-2.235-.244-.588-.493-.508-.677-.518-.175-.008-.376-.01-.577-.01-.201 0-.527.075-.803.375-.276.3-1.053 1.028-1.053 2.508s1.078 2.909 1.229 3.109c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.634.721.23 1.378.197 1.9.12.581-.087 1.777-.727 2.028-1.428.251-.701.251-1.302.175-.142-.075-.125-.276-.2-.577-.35zm-5.466 7.618c-2.02 0-3.99-.54-5.714-1.564l-.409-.243-4.247 1.114 1.133-4.14-.267-.424c-1.125-1.79-1.722-3.864-1.722-5.993 0-6.196 5.04-11.236 11.238-11.236 3.003 0 5.827 1.17 7.95 3.293 2.123 2.124 3.292 4.947 3.292 7.951 0 6.197-5.041 11.242-11.244 11.242zm9.605-18.847c-2.565-2.567-5.976-3.981-9.605-3.981-7.48 0-13.567 6.088-13.567 13.57 0 2.392.624 4.728 1.81 6.784l-1.925 7.028 7.195-1.887c1.989 1.084 4.237 1.656 6.527 1.656 7.481 0 13.569-6.089 13.569-13.572 0-3.628-1.414-7.04-3.981-9.607z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/clapculture_" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Follow us on Instagram (@clapculture_)"
                className="w-12 h-12 bg-charcoal border border-gray-800 flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-500 hover:bg-pink-500/10 transition-all rounded-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="mailto:clapcultureofficial@gmail.com" 
                title="Send Email"
                className="w-12 h-12 bg-charcoal border border-gray-800 flex items-center justify-center text-gray-400 hover:text-electric-lime hover:border-electric-lime hover:bg-electric-lime/10 transition-all rounded-lg"
              >
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
            </div>
          </div>

          <div className="bg-charcoal p-6 border border-gray-800 rounded-lg">
            <h3 className="font-headline-md text-xl uppercase mb-2 text-white">QUICK ANSWERS</h3>
            <p className="text-gray-400 text-sm mb-4">Check our FAQ for instant info regarding shipping timelines, returns, and oversized sizing.</p>
            <Link href="/faq" className="text-electric-lime underline text-xs font-label-caps tracking-wider uppercase font-bold">VIEW FAQ &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
