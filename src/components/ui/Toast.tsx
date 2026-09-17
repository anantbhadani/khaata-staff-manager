"use client";

import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import { create } from 'zustand';

interface ToastState {
  message: string;
  isVisible: boolean;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  isVisible: false,
  showToast: (msg) => set({ message: msg, isVisible: true }),
  hideToast: () => set({ isVisible: false }),
}));

export function ToastProvider() {
  const { message, isVisible, hideToast } = useToastStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hideToast]);

  return (
    <div 
      className={`absolute left-1/2 bottom-[calc(96px+env(safe-area-inset-bottom))] -translate-x-1/2 bg-ink text-paper px-[18px] py-[11px] rounded-[30px] text-[13px] font-bold flex items-center gap-2 z-[200] pointer-events-none transition-all duration-250 shadow-[0_8px_24px_rgba(0,0,0,0.25)] whitespace-nowrap ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'
      }`}
    >
      <Check size={15} className="flex-none" strokeWidth={3} />
      <span>{message}</span>
    </div>
  );
}
