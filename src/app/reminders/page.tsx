"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Reminders() {
  const router = useRouter();
  const [attOn, setAttOn] = useState(true);
  const [payOn, setPayOn] = useState(true);

  return (
    <AppLayout showNav={false}>
      <div className="sticky top-0 z-20 bg-paper border-b border-line-soft pt-[max(6px,env(safe-area-inset-top))] px-5 pb-3">
        <div className="flex items-center gap-[10px]">
          <div onClick={() => router.back()} className="w-[34px] h-[34px] rounded-full border border-line bg-paper-card flex items-center justify-center cursor-pointer text-ink flex-none active:scale-95 transition-transform">
            <ChevronLeft size={17} />
          </div>
          <h1 className="font-display font-semibold text-[21px] m-0">Reminders</h1>
        </div>
      </div>

      <div className="p-1 px-5 pb-[calc(30px+env(safe-area-inset-bottom))] mt-1">
        <Card className="px-4 py-1.5">
          <div className="flex items-center justify-between py-[13px] border-b border-line-soft">
            <div>
              <div className="text-[13.5px] font-bold">Remind me to mark attendance</div>
              <div className="text-[11.5px] text-ink-faint font-medium mt-[2px]">Daily at 8:00 PM</div>
            </div>
            <div 
              className={`w-[42px] h-[25px] rounded-[20px] relative cursor-pointer transition-colors ${attOn ? 'bg-sage' : 'bg-line'}`}
              onClick={() => setAttOn(!attOn)}
            >
              <div className={`absolute top-[3px] w-[19px] h-[19px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-all ${attOn ? 'left-[20px]' : 'left-[3px]'}`} />
            </div>
          </div>
          <div className="flex items-center justify-between py-[13px]">
            <div>
              <div className="text-[13.5px] font-bold">Remind me about unpaid salaries</div>
              <div className="text-[11.5px] text-ink-faint font-medium mt-[2px]">Last day of month</div>
            </div>
            <div 
              className={`w-[42px] h-[25px] rounded-[20px] relative cursor-pointer transition-colors ${payOn ? 'bg-sage' : 'bg-line'}`}
              onClick={() => setPayOn(!payOn)}
            >
              <div className={`absolute top-[3px] w-[19px] h-[19px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-all ${payOn ? 'left-[20px]' : 'left-[3px]'}`} />
            </div>
          </div>
        </Card>

        <div className="text-[11.5px] font-extrabold tracking-[0.3px] text-ink-faint my-[10px] mt-[22px]">Preview</div>
        <Card className="bg-marigold-bg border-none">
          <div className="text-[13px] font-bold text-ink">
            You haven't marked attendance for 2 staff members today.
          </div>
        </Card>
        <Card className="bg-sage-bg border-none">
          <div className="text-[13px] font-bold text-ink">
            September 2026 payments are ready. ₹4,500 is still pending.
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
