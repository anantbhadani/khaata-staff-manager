"use client";

import React, { useState, Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardTitleRow } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useStore } from '@/lib/store';
import { useToastStore } from '@/components/ui/Toast';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  fmtMoney, getAttendanceCounts, grossPay, 
  advanceTotal, deductionTotal, bonusTotal, netPayable, 
  getPaymentStatus, daysInMonth 
} from '@/lib/calculations';
import { PaymentMethod } from '@/lib/db';

const METHODS: {v: PaymentMethod, l: string}[] = [
  {v: 'cash', l: 'Cash'},
  {v: 'upi', l: 'UPI'},
  {v: 'bank_transfer', l: 'Bank transfer'},
  {v: 'other', l: 'Other'},
];

function PaymentDetailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { staff, attendance, advances, adjustments, payments, markPaymentPaid, undoPayment } = useStore();
  const { showToast } = useToastStore();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [pmMethod, setPmMethod] = useState<PaymentMethod>('cash');
  const [pmDate, setPmDate] = useState(new Date().toISOString().split('T')[0]);
  const [pmNote, setPmNote] = useState('');

  const s = staff.find(x => x.id === id);
  
  if (!s) return null;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
  const monthLabel = today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const dim = daysInMonth(year, month);

  const c = getAttendanceCounts(s.id, attendance, year, month);
  const gross = grossPay(s, c, dim);
  const adv = advanceTotal(s.id, advances, monthPrefix);
  const ded = deductionTotal(s.id, adjustments, monthPrefix);
  const bon = bonusTotal(s.id, adjustments, monthPrefix);
  const net = netPayable(gross, bon, adv, ded);
  const status = getPaymentStatus(s.id, monthPrefix, payments);
  const payment = payments.find(p => p.staffId === s.id && p.month === monthPrefix);

  const initials = s.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();

  const handleMarkPaid = async () => {
    await markPaymentPaid({
      staffId: s.id,
      month: monthPrefix,
      amount: net,
      status: 'paid',
      method: pmMethod,
      date: pmDate,
      note: pmNote
    });
    showToast('Payment marked as paid');
    setSheetOpen(false);
  };

  const handleUndo = async () => {
    await undoPayment(s.id, monthPrefix);
    showToast('Marked as pending');
  };

  return (
    <AppLayout showNav={false}>
      <div className="sticky top-0 z-20 bg-paper border-b border-line-soft pt-[max(6px,env(safe-area-inset-top))] px-5 pb-3">
        <div className="flex items-center justify-between gap-[10px]">
          <div onClick={() => router.back()} className="w-[34px] h-[34px] rounded-full border border-line bg-paper-card flex items-center justify-center cursor-pointer text-ink flex-none active:scale-95 transition-transform">
            <ChevronLeft size={17} />
          </div>
          <h1 className="font-display font-semibold text-[21px] m-0">Payment</h1>
          <div className="w-[34px]" />
        </div>
      </div>

      <div className="p-1 px-5 pb-[calc(30px+env(safe-area-inset-bottom))]">
        <Card className="flex items-center gap-[13px] mt-1">
          <div className="w-[48px] h-[48px] rounded-full flex-none flex items-center justify-center font-extrabold text-[15px] text-white bg-sage">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-[15px] truncate">{s.name}</div>
            <div className="text-[12px] text-ink-faint mt-[1px]">{monthLabel}</div>
          </div>
          <Badge status={status as any} />
        </Card>

        <Card>
          <CardTitleRow title="Attendance" />
          <div className="flex justify-between py-[8px] border-b border-dashed border-line text-[13.5px]">
            <span className="text-ink-soft">Full days</span>
            <span className="font-bold num">{c.full}</span>
          </div>
          <div className="flex justify-between py-[8px] border-b border-dashed border-line text-[13.5px]">
            <span className="text-ink-soft">Half days</span>
            <span className="font-bold num">{c.half}</span>
          </div>
          <div className="flex justify-between py-[8px] border-b border-dashed border-line text-[13.5px]">
            <span className="text-ink-soft">Absent</span>
            <span className="font-bold num">{c.absent}</span>
          </div>
        </Card>

        <Card>
          <CardTitleRow title="Amount to pay" />
          <div className="flex justify-between py-[8px] border-b border-dashed border-line text-[13.5px]">
            <span className="text-ink-soft">Gross salary</span>
            <span className="font-bold num">{fmtMoney(gross)}</span>
          </div>
          <div className="flex justify-between py-[8px] border-b border-dashed border-line text-[13.5px]">
            <span className="text-ink-soft">Bonus</span>
            <span className="font-bold num">{fmtMoney(bon)}</span>
          </div>
          <div className="flex justify-between py-[8px] border-b border-dashed border-line text-[13.5px]">
            <span className="text-brick">Advance</span>
            <span className="font-bold text-brick num">{adv > 0 ? '− ' : ''}{fmtMoney(adv)}</span>
          </div>
          <div className="flex justify-between py-[8px] border-b border-dashed border-line text-[13.5px]">
            <span className="text-brick">Deduction</span>
            <span className="font-bold text-brick num">{ded > 0 ? '− ' : ''}{fmtMoney(ded)}</span>
          </div>
          <div className="flex justify-between pt-[11px] mt-[4px] border-t-[1.5px] border-ink text-[16px] font-extrabold">
            <span>Amount to pay</span>
            <span className="num">{fmtMoney(net)}</span>
          </div>
        </Card>

        {status === 'paid' ? (
          <>
            <Card>
              <CardTitleRow title="Paid" />
              <div className="flex justify-between py-[8px] border-b border-dashed border-line text-[13.5px]">
                <span className="text-ink-soft">Method</span>
                <span className="font-bold">{METHODS.find(m => m.v === payment?.method)?.l || '—'}</span>
              </div>
              <div className="flex justify-between py-[8px] border-b border-dashed border-line text-[13.5px]">
                <span className="text-ink-soft">Date</span>
                <span className="font-bold">{payment?.date ? new Date(payment.date).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'}) : '—'}</span>
              </div>
            </Card>
            <Button variant="outline" onClick={handleUndo}>Undo payment</Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setSheetOpen(true)}>Mark as paid</Button>
        )}

        <div className="text-[11.5px] font-extrabold tracking-[0.3px] text-ink-faint my-[10px] mt-[22px]">Payment history</div>
        <Card className="py-1.5 px-4">
          <div className="flex items-center py-[10px] border-b border-line-soft last:border-b-0">
            <div className="flex-1 font-bold text-[14.5px]">{monthLabel}</div>
            <div className="text-right">
              <div className="font-extrabold text-[13.5px] num">{fmtMoney(net)}</div>
              <Badge status={status as any} className="mt-[2px]" />
            </div>
          </div>
        </Card>

        <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Mark as paid" sub={`Amount: ${fmtMoney(net)}`}>
          <div className="mb-[14px]">
            <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Payment method</label>
            <ChipGroup>
              {METHODS.map(m => (
                <Chip key={m.v} selected={pmMethod === m.v} onClick={() => setPmMethod(m.v)}>{m.l}</Chip>
              ))}
            </ChipGroup>
          </div>
          <div className="mb-[14px]">
            <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Date</label>
            <input type="date" value={pmDate} onChange={e => setPmDate(e.target.value)} className="w-full p-[12px_13px] rounded-[11px] border-[1.4px] border-line bg-paper-card text-ink text-[14.5px] outline-none" />
          </div>
          <div className="mb-[20px]">
            <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Note (optional)</label>
            <input placeholder="Optional note" value={pmNote} onChange={e => setPmNote(e.target.value)} className="w-full p-[12px_13px] rounded-[11px] border-[1.4px] border-line bg-paper-card text-ink text-[14.5px] outline-none" />
          </div>
          <div className="flex gap-[10px]">
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleMarkPaid}>Confirm payment</Button>
          </div>
        </BottomSheet>
      </div>
    </AppLayout>
  );
}

export default function PaymentDetail() {
  return (
    <Suspense fallback={<AppLayout showNav={false}><div className="p-5 text-center text-ink-faint">Loading...</div></AppLayout>}>
      <PaymentDetailInner />
    </Suspense>
  );
}
