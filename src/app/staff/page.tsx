"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useStore } from '@/lib/store';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { fmtMoney, getPaymentStatus, netPayable, getAttendanceCounts, grossPay, bonusTotal, advanceTotal, deductionTotal, daysInMonth } from '@/lib/calculations';

export default function StaffList() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  const { staff, attendance, advances, adjustments, payments } = useStore();
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
  const dim = daysInMonth(year, month);

  const list = staff.filter(s => {
    if (filter === 'daily' && s.payType !== 'daily') return false;
    if (filter === 'monthly' && s.payType !== 'monthly') return false;
    if (filter === 'inactive' && s.active) return false;
    if (filter === 'active' && !s.active) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="sticky top-0 z-20 bg-paper border-b border-line-soft pt-[max(6px,env(safe-area-inset-top))] px-5 pb-3">
        <div className="flex items-center justify-between gap-[10px]">
          <h1 className="font-display font-semibold text-[21px] m-0">Staff</h1>
          <Link href="/staff/add" className="w-[34px] h-[34px] rounded-full border border-line bg-paper-card flex items-center justify-center text-ink-soft flex-none active:scale-95 transition-transform">
            <Plus size={17} />
          </Link>
        </div>
      </div>

      <div className="p-1 px-5 pb-[calc(110px+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-[9px] bg-paper-card border-[1.4px] border-line rounded-[12px] p-[10px_13px] mb-3 mt-1">
          <Search size={18} className="text-ink-faint flex-none" />
          <input 
            placeholder="Search staff" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border-none bg-transparent outline-none text-[14px] text-ink"
          />
        </div>
        
        <ChipGroup className="mb-4">
          {['all', 'daily', 'monthly', 'active', 'inactive'].map(f => (
            <Chip key={f} selected={filter === f} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Chip>
          ))}
        </ChipGroup>

        {list.length === 0 ? (
          <div className="text-center pt-[50px] px-5 pb-[30px]">
            <div className="text-[38px] mb-[14px]">🗂️</div>
            <div className="font-extrabold text-[16px] mb-1">No staff found</div>
            <div className="text-[13px] text-ink-soft leading-relaxed">Try a different search or filter.</div>
          </div>
        ) : (
          <Card className="py-1.5 px-4">
            {list.map(s => {
              const initials = s.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
              
              // Calculate net payable for display
              const counts = getAttendanceCounts(s.id, attendance, year, month);
              const gross = grossPay(s, counts, dim);
              const bon = bonusTotal(s.id, adjustments, monthPrefix);
              const adv = advanceTotal(s.id, advances, monthPrefix);
              const ded = deductionTotal(s.id, adjustments, monthPrefix);
              const net = netPayable(gross, bon, adv, ded);
              
              const status = getPaymentStatus(s.id, monthPrefix, payments);
              
              return (
                <Link key={s.id} href={`/staff/detail?id=${s.id}`} className="flex items-center gap-[11px] py-[10px] border-b border-line-soft last:border-b-0 cursor-pointer">
                  <div className="w-[40px] h-[40px] rounded-full flex-none flex items-center justify-center font-extrabold text-[14px] text-white bg-sage">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[14.5px] truncate">{s.name}</div>
                    <div className="text-[12px] text-ink-faint mt-[1px]">
                      {s.category} · {s.payType === 'monthly' ? `${fmtMoney(s.rate)}/mo` : `${fmtMoney(s.rate)}/day`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-[13.5px] num">{fmtMoney(net)}</div>
                    <Badge status={status as any} className="mt-[2px]" />
                  </div>
                </Link>
              );
            })}
          </Card>
        )}
        
        <Link href="/staff/add" className="block mt-4">
          <Button variant="marigold">
            <Plus size={16} /> Add staff
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}
