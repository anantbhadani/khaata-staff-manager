"use client";

import React, { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardTitleRow } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AttendancePillGroup } from '@/components/ui/AttendancePill';
import { useStore } from '@/lib/store';
import { Bell, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { 
  getAttendanceCounts, daysInMonth, grossPay, 
  bonusTotal, advanceTotal, deductionTotal, netPayable, 
  getPaymentStatus, fmtMoney 
} from '@/lib/calculations';

export default function Home() {
  const { staff, attendance, advances, adjustments, payments, setAttendance } = useStore();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 1-12
  const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

  const dateLabel = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const monthLabel = today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  // Calculate totals
  const totals = useMemo(() => {
    let total = 0, paid = 0;
    const dim = daysInMonth(year, month);
    
    staff.forEach(s => {
      const counts = getAttendanceCounts(s.id, attendance, year, month);
      const gross = grossPay(s, counts, dim);
      const bon = bonusTotal(s.id, adjustments, monthPrefix);
      const adv = advanceTotal(s.id, advances, monthPrefix);
      const ded = deductionTotal(s.id, adjustments, monthPrefix);
      const net = netPayable(gross, bon, adv, ded);
      
      total += net;
      if (getPaymentStatus(s.id, monthPrefix, payments) === 'paid') {
        paid += net;
      }
    });
    
    return { total, paid, remaining: total - paid };
  }, [staff, attendance, advances, adjustments, payments, year, month, monthPrefix]);

  const unmarkedStaff = staff.filter(s => s.active && !attendance.find(a => a.staffId === s.id && a.date === todayStr));
  const notMarkedCount = unmarkedStaff.length;

  return (
    <AppLayout>
      <div className="sticky top-0 z-20 bg-paper pt-[max(6px,env(safe-area-inset-top))] px-5 pb-3">
        <div className="flex items-center justify-between gap-[10px]">
          <div>
            <p className="text-[13px] text-ink-faint m-0 mt-[2px]">{dateLabel}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/reminders" className="w-[34px] h-[34px] rounded-full border border-line bg-paper-card flex items-center justify-center text-ink-soft flex-none active:scale-95 transition-transform">
              <Bell size={17} />
            </Link>
            <Link href="/settings" className="w-[34px] h-[34px] rounded-full border border-line bg-marigold-deep text-[#2A2107] flex items-center justify-center font-extrabold text-[12px] flex-none active:scale-95 transition-transform">
              A
            </Link>
          </div>
        </div>
        <h1 className="font-display italic font-medium text-[26px] m-0 mt-[2px] text-ink">Good morning, Anant</h1>
      </div>

      <div className="p-1 px-5 pb-[calc(110px+env(safe-area-inset-bottom))]">
        
        {/* Today's Attendance */}
        <Card>
          <CardTitleRow title="Today's attendance" sub={`${staff.length} staff members`} />
          {staff.map(s => {
            const currentEntry = attendance.find(a => a.staffId === s.id && a.date === todayStr);
            const currentStatus = currentEntry?.status;
            
            // Get initials
            const initials = s.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
            
            return (
              <div key={s.id} className="flex items-center gap-[11px] py-[10px] border-b border-line-soft last:border-b-0">
                <div className="w-[40px] h-[40px] rounded-full flex-none flex items-center justify-center font-extrabold text-[14px] text-white bg-sage">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[14.5px] truncate">{s.name}</div>
                  <div className="text-[12px] text-ink-faint mt-[1px]">
                    {currentStatus === 'full' ? 'Full day' : currentStatus === 'half' ? 'Half day' : currentStatus === 'absent' ? 'Absent' : 'Not marked'}
                  </div>
                </div>
                <AttendancePillGroup 
                  currentStatus={currentStatus} 
                  onUpdate={(status) => setAttendance(s.id, todayStr, status as any)} 
                />
              </div>
            );
          })}
          {staff.length === 0 && (
            <div className="py-4 text-center text-ink-faint text-[13px]">
              No staff added yet. Go to Staff tab to add someone.
            </div>
          )}
        </Card>

        {/* Payable Hero */}
        <Card className="bg-gradient-to-br from-marigold-bg to-paper-card border border-line-soft">
          <div className="text-[12.5px] text-ink-soft font-bold">{monthLabel} · Total payable</div>
          <div className="text-[38px] font-extrabold m-0 mt-[2px] mb-[12px] tracking-tight num">
            {fmtMoney(totals.total)}
          </div>
          <div className="flex gap-[22px]">
            <div className="text-[12px] text-ink-soft">
              <span className="inline-block w-[7px] h-[7px] rounded-full bg-sage mr-[5px]" />
              Paid
              <strong className="block text-[16px] text-ink mt-[1px] num">{fmtMoney(totals.paid)}</strong>
            </div>
            <div className="text-[12px] text-ink-soft">
              <span className="inline-block w-[7px] h-[7px] rounded-full bg-brick mr-[5px]" />
              Remaining
              <strong className="block text-[16px] text-ink mt-[1px] num">{fmtMoney(totals.remaining)}</strong>
            </div>
          </div>
          <div className="h-[12px]" />
          <Link href="/payments">
            <Button variant="outline">View payments</Button>
          </Link>
        </Card>

        {/* Action Required */}
        <Card>
          <CardTitleRow title="Action required" />
          
          {notMarkedCount > 0 && (
            <Link href="/attendance" className="flex items-center gap-[11px] py-[11px] border-b border-line-soft cursor-pointer last:border-b-0">
              <div className="w-[8px] h-[8px] rounded-full bg-brick flex-none" />
              <div className="flex-1 text-[13.5px] font-semibold">{notMarkedCount} staff attendance not marked today</div>
              <ChevronRight size={16} className="text-ink-faint flex-none" />
            </Link>
          )}

          {totals.remaining > 0 && (
            <Link href="/payments" className="flex items-center gap-[11px] py-[11px] border-b border-line-soft cursor-pointer last:border-b-0">
              <div className="w-[8px] h-[8px] rounded-full bg-marigold flex-none" />
              <div className="flex-1 text-[13.5px] font-semibold">{fmtMoney(totals.remaining)} in payments still pending</div>
              <ChevronRight size={16} className="text-ink-faint flex-none" />
            </Link>
          )}

          {advances.filter(a => a.date.startsWith(monthPrefix)).map(a => {
            const s = staff.find(x => x.id === a.staffId);
            if (!s) return null;
            return (
              <Link key={a.id} href={`/staff/detail?id=${s.id}`} className="flex items-center gap-[11px] py-[11px] border-b border-line-soft cursor-pointer last:border-b-0">
                <div className="w-[8px] h-[8px] rounded-full bg-amber flex-none" />
                <div className="flex-1 text-[13.5px] font-semibold">{s.name} has {fmtMoney(a.amount)} advance to deduct</div>
                <ChevronRight size={16} className="text-ink-faint flex-none" />
              </Link>
            );
          })}

          {notMarkedCount === 0 && totals.remaining === 0 && advances.length === 0 && (
            <div className="py-[14px] text-center text-ink-faint text-[13px]">
              You're all caught up 🎉
            </div>
          )}
        </Card>

      </div>
    </AppLayout>
  );
}
