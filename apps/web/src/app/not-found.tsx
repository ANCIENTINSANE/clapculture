import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | CLAPCULTURE',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-deep-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Glitch Effect Background Text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none pointer-events-none overflow-hidden">
        <h1 className="font-headline-xl text-[40vw] text-electric-lime">404</h1>
      </div>
      
      <div className="relative z-10 text-center">
        <h1 className="font-headline-xl text-8xl md:text-9xl mb-4 relative inline-block group">
          <span className="relative z-10">404</span>
          {/* Glitch layers */}
          <span className="absolute top-0 left-[-2px] text-red-500 opacity-70 z-0 group-hover:animate-ping mix-blend-screen">404</span>
          <span className="absolute top-0 right-[-2px] text-blue-500 opacity-70 z-0 group-hover:animate-pulse mix-blend-screen">404</span>
        </h1>
        
        <h2 className="font-headline-md text-3xl md:text-4xl mb-8 uppercase tracking-widest text-gray-300">
          LOST IN THE CULTURE
        </h2>
        
        <p className="text-gray-400 font-label-caps mb-12 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to a new drop.
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-electric-lime text-black font-headline-md px-10 py-4 text-xl hover:bg-white transition-colors uppercase group"
        >
          <span className="material-symbols-outlined transform group-hover:-translate-x-1 transition-transform">arrow_back</span>
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
