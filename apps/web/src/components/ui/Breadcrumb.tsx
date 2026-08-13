import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-xs md:text-sm font-label-caps uppercase text-gray-500 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-electric-lime transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-white" : ""}>{item.label}</span>
            )}
            
            {!isLast && (
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
