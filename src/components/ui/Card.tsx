import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div 
      className={`bg-paper-card border border-line-soft rounded-[14px] shadow-[0_1px_2px_rgba(32,42,66,0.06),0_6px_16px_rgba(32,42,66,0.05)] p-4 mb-[14px] ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitleRow({ title, sub }: { title: string, sub?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between mb-[10px]">
      <span className="font-extrabold text-[14.5px] text-ink">{title}</span>
      {sub && <span className="text-[12px] text-ink-faint">{sub}</span>}
    </div>
  );
}
