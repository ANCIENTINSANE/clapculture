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
                <a href="mailto:clapculture.co@gmail.com" className="hover:underline text-white">clapculture.co@gmail.com</a>
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
                className="w-12 h-12 bg-charcoal border border-gray-800 flex items-center justify-center hover:text-[#25D366] hover:border-[#25D366] transition-all"
              >
                <span className="material-symbols-outlined">chat</span>
              </a>
              <a 
                href="https://www.instagram.com/clapculture_" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Follow us on Instagram (@clapculture_)"
                className="w-12 h-12 bg-charcoal border border-gray-800 flex items-center justify-center hover:text-pink-500 hover:border-pink-500 transition-all"
              >
                <span className="material-symbols-outlined">photo_camera</span>
              </a>
              <a 
                href="mailto:clapculture.co@gmail.com" 
                title="Send Email"
                className="w-12 h-12 bg-charcoal border border-gray-800 flex items-center justify-center hover:text-electric-lime hover:border-electric-lime transition-all"
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
