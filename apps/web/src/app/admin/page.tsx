'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token && token.length > 10) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#d2f000] border-t-transparent rounded-full animate-spin mb-3" />
      <p className="font-mono text-xs uppercase tracking-widest text-[#737373]">Redirecting to Admin Portal...</p>
    </div>
  );
}
