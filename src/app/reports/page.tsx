"use client";

import React, { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardTitleRow } from '@/components/ui/Card';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import { useStore } from '@/lib/store';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  daysInMonth, getAttendanceCounts, grossPay, 
  bonusTotal, advanceTotal, deductionTotal, netPayable, 
  getPaymentStatus, fmtMoney 
} from '@/lib/calculations';

export default function Reports() {
  const router = useRouter();
  const { staff, attendance, advances, adjustments, payments } = useStore();
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
  const monthLabel = today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const dim = daysInMonth(year, month);

  const stats = useMemo(() => {
    let total = 0, paid = 0;
    let full = 0, half = 0, absent = 0;
    const chartData: any[] = [];
    
    staff.forEach(s => {
      const c = getAttendanceCounts(s.id, attendance, year, month);
      full += c.full; half += c.half; absent += c.absent;

      const gross = grossPay(s, c, dim);
      const bon = bonusTotal(s.id, adjustments, monthPrefix);
      const adv = advanceTotal(s.id, advances, monthPrefix);
      const ded = deductionTotal(s.id, adjustments, monthPrefix);
      const net = netPayable(gross, bon, adv, ded);
      
      const status = getPaymentStatus(s.id, monthPrefix, payments);
      
      total += net;
      if (status === 'paid') paid += net;

      chartData.push({
        name: s.name.split(' ')[0],
        salary: net,
        status
      });
    });

    chartData.sort((a, b) => b.salary - a.salary);
    
    return { total, paid, remaining: total - paid, full, half, absent, chartData };
  }, [staff, attendance, advances, adjustments, payments, year, month, monthPrefix, dim]);

  return (
    <AppLayout showNav={false}>
      <div className="sticky top-0 z-20 bg-paper border-b border-line-soft pt-[max(6px,env(safe-area-inset-top))] px-5 pb-3">
        <div className="flex items-center justify-between gap-[10px]">
          <div onClick={() => router.back()} className="w-[34px] h-[34px] rounded-full border border-line bg-paper-card flex items-center justify-center cursor-pointer text-ink flex-none active:scale-95 transition-transform">
            <ChevronLeft size={17} />
          </div>
          <h1 className="font-display font-semibold text-[21px] m-0">Monthly report</h1>
          <div className="w-[34px]" />
        </div>
      </div>

      <div className="p-1 px-5 pb-[calc(30px+env(safe-area-inset-bottom))] mt-1">
        
        <ChipGroup className="mb-[14px]">
          <Chip selected>{monthLabel}</Chip>
          <Chip>All staff</Chip>
        </ChipGroup>

        <div className="grid grid-cols-2 gap-[10px] mb-[14px]">
          <div className="bg-paper-card border border-line-soft rounded-[12px] p-[13px]">
            <div className="text-[20px] font-extrabold">{staff.length}</div>
            <div className="text-[11.5px] text-ink-faint font-bold mt-[2px]">Total staff</div>
          </div>
          <div className="bg-paper-card border border-line-soft rounded-[12px] p-[13px]">
            <div className="text-[20px] font-extrabold num">{fmtMoney(stats.total)}</div>
            <div className="text-[11.5px] text-ink-faint font-bold mt-[2px]">Total salary</div>
          </div>
          <div className="bg-paper-card border border-line-soft rounded-[12px] p-[13px]">
            <div className="text-[20px] font-extrabold text-sage num">{fmtMoney(stats.paid)}</div>
            <div className="text-[11.5px] text-ink-faint font-bold mt-[2px]">Paid</div>
          </div>
          <div className="bg-paper-card border border-line-soft rounded-[12px] p-[13px]">
            <div className="text-[20px] font-extrabold text-brick num">{fmtMoney(stats.remaining)}</div>
            <div className="text-[11.5px] text-ink-faint font-bold mt-[2px]">Remaining</div>
          </div>
        </div>

        <Card>
          <CardTitleRow title="Salary by staff" />
          <div className="h-[250px] w-full -ml-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'var(--ink)', fontSize: 12, fontWeight: 700}}
                />
                <Tooltip 
                  cursor={{fill: 'var(--line-soft)'}}
                  contentStyle={{borderRadius: '12px', border: '1px solid var(--line-soft)', backgroundColor: 'var(--paper-card)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  formatter={(value: any) => [fmtMoney(value as number), 'Salary']}
                />
                <Bar dataKey="salary" radius={[0, 4, 4, 0]} barSize={16}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="var(--marigold)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitleRow title="Attendance summary" />
          <div className="flex justify-between py-[8px] border-b border-dashed border-line text-[13.5px]">
            <span className="text-ink-soft flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sage inline-block"/> Full days</span>
            <span className="font-bold num">{stats.full}</span>
          </div>
          <div className="flex justify-between py-[8px] border-b border-dashed border-line text-[13.5px]">
            <span className="text-ink-soft flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber inline-block"/> Half days</span>
            <span className="font-bold num">{stats.half}</span>
          </div>
          <div className="flex justify-between py-[8px] border-b border-dashed border-line text-[13.5px]">
            <span className="text-ink-soft flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brick inline-block"/> Absent</span>
            <span className="font-bold num">{stats.absent}</span>
          </div>
        </Card>
        
      </div>
    </AppLayout>
  );
}
