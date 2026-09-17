import React from 'react';

type ButtonVariant = 'primary' | 'marigold' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'default' | 'sm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'default', className = '', children, ...props }: ButtonProps) {
  let variantClass = '';
  switch (variant) {
    case 'primary':
      variantClass = 'bg-ink text-paper';
      break;
    case 'marigold':
      variantClass = 'bg-marigold text-[#2A2107]';
      break;
    case 'outline':
      variantClass = 'bg-transparent text-ink border-[1.4px] border-line';
      break;
    case 'ghost':
      variantClass = 'bg-gray/10 text-ink-soft'; // Or var(--gray-bg) if defined
      break;
    case 'danger':
      variantClass = 'bg-brick/10 text-brick'; // Or var(--brick-bg)
      break;
  }

  const sizeClass = size === 'sm' ? 'px-3 py-2 text-[12.5px] rounded-[9px] w-auto' : 'px-[18px] py-[13px] text-[14px] rounded-[12px] w-full';

  return (
    <button 
      className={`font-extrabold flex items-center justify-center gap-[7px] cursor-pointer transition-transform active:scale-[0.98] ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
