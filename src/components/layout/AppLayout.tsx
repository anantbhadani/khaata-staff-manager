"use client";

import React, { useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { ToastProvider } from '../ui/Toast';
import { useStore } from '@/lib/store';
import { Onboarding } from '@/components/Onboarding';

export function AppLayout({ children, showNav = true }: { children: React.ReactNode, showNav?: boolean }) {
  const { isLoaded, loadInitialData, onboardingDone } = useStore();

  useEffect(() => {
    if (!isLoaded) {
      loadInitialData();
    }
  }, [isLoaded, loadInitialData]);

  if (!isLoaded) return <div className="flex-1 flex items-center justify-center">Loading...</div>;

  if (!onboardingDone) {
    return <Onboarding />;
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative no-scrollbar bg-paper">
        {children}
      </main>
      {showNav && <BottomNav />}
      <ToastProvider />
    </>
  );
}
