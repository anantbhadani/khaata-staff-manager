"use client";

import React, { useEffect } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  sub?: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, sub, children }: BottomSheetProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#14140f]/40 z-[300] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="absolute left-0 right-0 bottom-0 bg-paper-card rounded-t-[22px] px-5 pt-[10px] pb-[calc(26px+env(safe-area-inset-bottom))] z-[301] max-h-[82%] overflow-y-auto shadow-[0_-8px_30px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom duration-300">
        <div className="w-[36px] h-[4px] rounded-[3px] bg-line mx-auto mt-[6px] mb-[14px]" />
        
        {title && <h2 className="font-display font-semibold text-[19px] m-0 mb-1">{title}</h2>}
        {sub && <p className="text-[12.5px] text-ink-faint mb-4">{sub}</p>}
        
        {children}
      </div>
    </>
  );
}
