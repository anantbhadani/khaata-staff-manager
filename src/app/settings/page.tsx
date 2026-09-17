"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function Settings() {
  const router = useRouter();
  const [lockOn, setLockOn] = useState(false);
  const [bioOn, setBioOn] = useState(false);
  const { theme, setTheme } = useStore();

  return (
    <AppLayout showNav={false}>
      <div className="sticky top-0 z-20 bg-paper border-b border-line-soft pt-[max(6px,env(safe-area-inset-top))] px-5 pb-3">
        <div className="flex items-center gap-[10px]">
          <div onClick={() => router.back()} className="w-[34px] h-[34px] rounded-full border border-line bg-paper-card flex items-center justify-center cursor-pointer text-ink flex-none active:scale-95 transition-transform">
            <ChevronLeft size={17} />
          </div>
          <h1 className="font-display font-semibold text-[21px] m-0">Settings</h1>
        </div>
      </div>

      <div className="p-1 px-5 pb-[calc(30px+env(safe-area-inset-bottom))] mt-1">
        <Card className="flex items-center gap-[13px]">
          <div className="w-[48px] h-[48px] rounded-full bg-marigold-deep text-[#2A2107] flex items-center justify-center font-extrabold text-[15px]">A</div>
          <div>
            <div className="font-extrabold text-[15px]">Anant</div>
            <div className="text-[12px] text-ink-faint mt-[1px]">Bengaluru</div>
          </div>
        </Card>

        <div className="text-[11.5px] font-extrabold tracking-[0.3px] text-ink-faint my-[10px] mt-[22px]">Appearance</div>
        <Card className="px-4 py-3">
          <div className="flex gap-2">
            <button onClick={() => setTheme('system')} className={`flex-1 py-[9px] rounded-[10px] border-[1.4px] text-[13px] font-bold ${theme === 'system' ? 'bg-ink text-paper border-ink' : 'bg-paper-card text-ink-soft border-line'}`}>System</button>
            <button onClick={() => setTheme('light')} className={`flex-1 py-[9px] rounded-[10px] border-[1.4px] text-[13px] font-bold ${theme === 'light' ? 'bg-ink text-paper border-ink' : 'bg-paper-card text-ink-soft border-line'}`}>Light</button>
            <button onClick={() => setTheme('dark')} className={`flex-1 py-[9px] rounded-[10px] border-[1.4px] text-[13px] font-bold ${theme === 'dark' ? 'bg-ink text-paper border-ink' : 'bg-paper-card text-ink-soft border-line'}`}>Dark</button>
          </div>
        </Card>

        <div className="text-[11.5px] font-extrabold tracking-[0.3px] text-ink-faint my-[10px] mt-[22px]">Security</div>
        <Card className="px-4 py-1.5">
          <div className="flex items-center justify-between py-[13px] border-b border-line-soft">
            <div className="text-[13.5px] font-bold">App lock</div>
            <div className={`w-[42px] h-[25px] rounded-[20px] relative cursor-pointer transition-colors ${lockOn ? 'bg-sage' : 'bg-line'}`} onClick={() => setLockOn(!lockOn)}>
              <div className={`absolute top-[3px] w-[19px] h-[19px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-all ${lockOn ? 'left-[20px]' : 'left-[3px]'}`} />
            </div>
          </div>
          <div className="flex items-center justify-between py-[13px]">
            <div className="text-[13.5px] font-bold">Biometric unlock</div>
            <div className={`w-[42px] h-[25px] rounded-[20px] relative cursor-pointer transition-colors ${bioOn ? 'bg-sage' : 'bg-line'}`} onClick={() => setBioOn(!bioOn)}>
              <div className={`absolute top-[3px] w-[19px] h-[19px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-all ${bioOn ? 'left-[20px]' : 'left-[3px]'}`} />
            </div>
          </div>
        </Card>

        <div className="text-[11.5px] font-extrabold tracking-[0.3px] text-ink-faint my-[10px] mt-[22px]">Data</div>
        <Card className="px-4 py-1.5">
          <div className="flex items-center gap-[11px] py-[11px] border-b border-line-soft cursor-pointer">
            <div className="flex-1 text-[13.5px] font-semibold">Backup now</div>
            <ChevronRight size={16} className="text-ink-faint flex-none" />
          </div>
          <div className="flex items-center gap-[11px] py-[11px] border-b border-line-soft cursor-pointer">
            <div className="flex-1 text-[13.5px] font-semibold">Export monthly report</div>
            <ChevronRight size={16} className="text-ink-faint flex-none" />
          </div>
          <div className="flex items-center gap-[11px] py-[11px] cursor-pointer">
            <div className="flex-1 text-[13.5px] font-semibold text-brick">Restore from backup</div>
            <ChevronRight size={16} className="text-ink-faint flex-none" />
          </div>
        </Card>

        <div className="text-[11.5px] font-extrabold tracking-[0.3px] text-ink-faint my-[10px] mt-[22px]">Sync status</div>
        <Card>
          <div className="flex items-center gap-[8px] text-[13px] font-bold text-sage">
            <span className="inline-block w-[7px] h-[7px] rounded-full bg-sage" />
            All changes saved on this device
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
