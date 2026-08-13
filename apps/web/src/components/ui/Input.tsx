import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "bg-charcoal border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-electric-lime transition-colors w-full placeholder:text-gray-600",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
