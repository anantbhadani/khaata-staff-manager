"use client";

import React, { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardTitleRow } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store';
import { IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { daysInMonth, getAttendanceCounts, grossPay, bonusTotal, advanceTotal, deductionTotal, netPayable, getPaymentStatus, fmtMoney } from '@/lib/calculations';

export default function Payments() {
  const { staff, attendance, advances, adjustments, payments } = useStore();
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
  const monthLabel = today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const dim = daysInMonth(year, month);

  const totals = useMemo(() => {
    let total = 0, paid = 0;
    let paidCount = 0, pendingCount = 0;
    
    staff.forEach(s => {
      const counts = getAttendanceCounts(s.id, attendance, year, month);
      const gross = grossPay(s, counts, dim);
      const bon = bonusTotal(s.id, adjustments, monthPrefix);
      const adv = advanceTotal(s.id, advances, monthPrefix);
      const ded = deductionTotal(s.id, adjustments, monthPrefix);
      const net = netPayable(gross, bon, adv, ded);
      
      const status = getPaymentStatus(s.id, monthPrefix, payments);
      
      total += net;
      if (status === 'paid') {
        paid += net;
        paidCount++;
      } else {
        pendingCount++;
      }
    });
    
    return { total, paid, remaining: total - paid, paidCount, pendingCount };
  }, [staff, attendance, advances, adjustments, payments, year, month, monthPrefix, dim]);

  return (
    <AppLayout>
      <div className="sticky top-0 z-20 bg-paper border-b border-line-soft pt-[max(6px,env(safe-area-inset-top))] px-5 pb-3">
        <div className="flex items-center justify-between gap-[10px]">
          <h1 className="font-display font-semibold text-[21px] m-0">Payments</h1>
          <Link href="/reports" className="w-[34px] h-[34px] rounded-full border border-line bg-paper-card flex items-center justify-center text-ink-soft flex-none active:scale-95 transition-transform">
            <IndianRupee size={17} />
          </Link>
        </div>
      </div>

      <div className="p-1 px-5 pb-[calc(110px+env(safe-area-inset-bottom))] mt-1">
        
        {/* Hero */}
        <Card className="bg-gradient-to-br from-marigold-bg to-paper-card border border-line-soft">
          <div className="text-[12.5px] text-ink-soft font-bold">{monthLabel}</div>
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
        </Card>

        {/* List */}
        <Card className="py-1.5 px-4">
          {staff.map(s => {
            const initials = s.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
            
            const counts = getAttendanceCounts(s.id, attendance, year, month);
            const gross = grossPay(s, counts, dim);
            const bon = bonusTotal(s.id, adjustments, monthPrefix);
            const adv = advanceTotal(s.id, advances, monthPrefix);
            const ded = deductionTotal(s.id, adjustments, monthPrefix);
            const net = netPayable(gross, bon, adv, ded);
            const status = getPaymentStatus(s.id, monthPrefix, payments);
            
            return (
              <Link key={s.id} href={`/payments/detail?id=${s.id}`} className="flex items-center gap-[11px] py-[10px] border-b border-line-soft last:border-b-0 cursor-pointer">
                <div className="w-[40px] h-[40px] rounded-full flex-none flex items-center justify-center font-extrabold text-[14px] text-white bg-sage">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[14.5px] truncate">{s.name}</div>
                  <div className="text-[12px] text-ink-faint mt-[1px]">{s.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-[13.5px] num">{fmtMoney(net)}</div>
                  <Badge status={status as any} className="mt-[2px]" />
                </div>
              </Link>
            );
          })}
          {staff.length === 0 && (
            <div className="py-4 text-center text-ink-faint text-[13px]">
              No staff added yet.
            </div>
          )}
        </Card>

        <div className="text-[11.5px] font-extrabold tracking-[0.3px] text-ink-faint my-[10px] mt-[22px]">Monthly closing</div>
        <Card>
          <CardTitleRow title={monthLabel} sub={`${staff.length} staff`} />
          <div className="flex justify-between py-2 border-b border-dashed border-line text-[13.5px]">
            <span className="text-ink-soft">✓ Payments completed</span>
            <span className="font-bold num">{totals.paidCount}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-dashed border-line text-[13.5px]">
            <span className="text-brick">⚠ Payments pending</span>
            <span className="font-bold text-brick num">{totals.pendingCount}</span>
          </div>
          <div className="h-[10px]" />
          <Link href="/reports">
            <Button variant="outline">Review monthly report</Button>
          </Link>
        </Card>

      </div>
    </AppLayout>
  );
}
