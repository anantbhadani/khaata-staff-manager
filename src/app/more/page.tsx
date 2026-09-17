"use client";

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function More() {
  return (
    <AppLayout>
      <div className="sticky top-0 z-20 bg-paper border-b border-line-soft pt-[max(6px,env(safe-area-inset-top))] px-5 pb-3">
        <h1 className="font-display font-semibold text-[21px] m-0">More</h1>
      </div>

      <div className="p-1 px-5 pb-[calc(110px+env(safe-area-inset-bottom))] mt-1">
        <Card className="px-4 py-1.5">
          <Link href="/reports" className="flex items-center gap-[11px] py-[11px] border-b border-line-soft cursor-pointer">
            <div className="w-[8px] h-[8px] rounded-full bg-marigold flex-none" />
            <div className="flex-1 text-[13.5px] font-semibold">Monthly reports</div>
            <ChevronRight size={16} className="text-ink-faint flex-none" />
          </Link>
          <Link href="/reminders" className="flex items-center gap-[11px] py-[11px] border-b border-line-soft cursor-pointer">
            <div className="w-[8px] h-[8px] rounded-full bg-marigold flex-none" />
            <div className="flex-1 text-[13.5px] font-semibold">Reminders</div>
            <ChevronRight size={16} className="text-ink-faint flex-none" />
          </Link>
          <Link href="/settings" className="flex items-center gap-[11px] py-[11px] cursor-pointer">
            <div className="w-[8px] h-[8px] rounded-full bg-marigold flex-none" />
            <div className="flex-1 text-[13.5px] font-semibold">Settings &amp; data</div>
            <ChevronRight size={16} className="text-ink-faint flex-none" />
          </Link>
        </Card>

        <div className="text-[11.5px] font-extrabold tracking-[0.3px] text-ink-faint my-[10px] mt-[22px]">About</div>
        <Card>
          <div className="text-[12px] text-ink-soft leading-relaxed">
            Khaata helps you track attendance and pay for the people who work for you — no notebook required.
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
