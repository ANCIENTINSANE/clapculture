'use client';

import React, { useEffect, useState } from 'react';

// Define the interface for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // 1. Register the Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.error('Service Worker registration failed: ', err);
        });
      });
    }

    // 2. Check if already dismissed
    const hasDismissed = localStorage.getItem('pwa-dismissed');
    if (hasDismissed === 'true') {
      return;
    }

    // 3. Detect iOS for manual instructions (iOS doesn't support beforeinstallprompt)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    
    // Check if it's already installed on iOS (standalone mode)
    const isIosStandalone = ('standalone' in window.navigator) && (window.navigator as unknown as { standalone?: boolean }).standalone;
    
    if (isIosDevice && !isIosStandalone) {
      setTimeout(() => setIsIOS(true), 0);
      // Wait a bit before showing the prompt on first visit
      setTimeout(() => setShowIOSPrompt(true), 3000);
    }

    // 4. Listen for Chrome/Android install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show our custom UI
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    await deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowPrompt(false);
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSPrompt(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  if (!showPrompt && !showIOSPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-9999 p-4 md:p-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="max-w-md mx-auto bg-deep-black border-2 border-charcoal shadow-2xl rounded-2xl overflow-hidden relative">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-electric-lime/0 via-electric-lime to-electric-lime/0"></div>
        
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        <div className="p-5 flex items-start gap-4">
          <div className="w-12 h-12 bg-charcoal rounded-xl border border-gray-800 shrink-0 overflow-hidden flex items-center justify-center">
            <span className="text-xl font-bold font-hero-lg text-electric-lime">C</span>
          </div>
          
          <div className="flex-1">
            <h3 className="font-label-caps font-bold text-white uppercase text-sm tracking-wider mb-1">Install ClapCulture App</h3>
            <p className="text-xs text-gray-400 mb-4">Get the full premium streetwear experience, exclusive drops, and faster access.</p>
            
            {isIOS && showIOSPrompt ? (
              <div className="bg-charcoal p-3 rounded-lg text-xs text-gray-300">
                Tap the <span className="inline-block align-middle mx-1 bg-white/10 rounded px-1"><span className="material-symbols-outlined text-[14px]">ios_share</span></span> icon at the bottom of Safari and select <strong className="text-white">&quot;Add to Home Screen&quot;</strong>.
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full bg-electric-lime text-black font-label-caps font-bold text-xs py-2.5 rounded hover:bg-white transition-colors uppercase tracking-widest"
              >
                Install App Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
