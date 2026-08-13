import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-charcoal text-white',
    success: 'bg-electric-lime text-black',
    warning: 'bg-yellow-500 text-black',
    danger: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <span className={cn(
      "px-2 py-1 text-[10px] uppercase font-bold tracking-wider inline-flex items-center justify-center",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
