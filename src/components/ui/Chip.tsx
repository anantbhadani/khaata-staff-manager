import React from 'react';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
}

export function Chip({ selected = false, className = '', children, ...props }: ChipProps) {
  return (
    <button
      className={`px-[14px] py-[9px] rounded-[20px] border-[1.4px] text-[13px] font-bold cursor-pointer transition-colors ${
        selected 
          ? 'bg-ink text-paper border-ink' 
          : 'bg-paper-card text-ink-soft border-line'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ChipGroup({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`flex gap-[8px] flex-wrap ${className}`}>
      {children}
    </div>
  );
}
