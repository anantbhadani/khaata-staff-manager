import React from 'react';

type BadgeStatus = 'paid' | 'pending' | 'not-marked' | 'holiday' | 'active' | 'inactive';

interface BadgeProps {
  status: BadgeStatus;
  children?: React.ReactNode;
  className?: string;
}

export function Badge({ status, children, className = '' }: BadgeProps) {
  let colorClass = '';
  let defaultText = '';

  switch (status) {
    case 'paid':
    case 'active':
      colorClass = 'bg-sage/20 text-sage'; // Approximation of sage-bg
      defaultText = status === 'paid' ? 'Paid' : 'Active';
      break;
    case 'pending':
      colorClass = 'bg-brick/20 text-brick';
      defaultText = 'Pending';
      break;
    case 'not-marked':
    case 'inactive':
      colorClass = 'bg-gray/20 text-gray';
      defaultText = status === 'inactive' ? 'Inactive' : 'Not marked';
      break;
    case 'holiday':
      colorClass = 'bg-marigold/20 text-marigold-deep';
      defaultText = 'Holiday';
      break;
  }

  return (
    <span className={`text-[11px] font-extrabold px-[9px] py-[3px] rounded-[20px] inline-flex items-center gap-[5px] ${colorClass} ${className}`}>
      {children || defaultText}
    </span>
  );
}
