"use client";

import React, { useState, Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardTitleRow } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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

function StaffProfileInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { staff, attendance, advances, adjustments, payments, addAdvance, addAdjustment } = useStore();
  const { showToast } = useToastStore();

  const [advSheetOpen, setAdvSheetOpen] = useState(false);
  const [advAmt, setAdvAmt] = useState('');
  const [advDate, setAdvDate] = useState(new Date().toISOString().split('T')[0]);
  const [advNote, setAdvNote] = useState('');
  const [advErr, setAdvErr] = useState(false);

  const [adjSheetOpen, setAdjSheetOpen] = useState(false);
  const [adjKind, setAdjKind] = useState<'bonus' | 'deduct'>('bonus');
  const [adjAmt, setAdjAmt] = useState('');
  const [adjNote, setAdjNote] = useState('');
  const [adjErr, setAdjErr] = useState(false);

  const s = staff.find(x => x.id === id);
  
  if (!s) {
    return (
      <AppLayout showNav={false}>
        <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
          <div className="text-[38px] mb-[14px]">🙈</div>
          <div className="font-extrabold text-[16px] mb-[6px]">Not found</div>
          <div className="text-[13px] text-ink-soft mb-5">This staff member no longer exists.</div>
          <Button variant="marigold" size="sm" onClick={() => router.back()}>Go back</Button>
        </div>
      </AppLayout>
    );
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
  const dim = daysInMonth(year, month);
  const monthLabel = today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const c = getAttendanceCounts(s.id, attendance, year, month);
  const gross = grossPay(s, c, dim);
  const adv = advanceTotal(s.id, advances, monthPrefix);
  const ded = deductionTotal(s.id, adjustments, monthPrefix);
  const bon = bonusTotal(s.id, adjustments, monthPrefix);
  const net = netPayable(gross, bon, adv, ded);
  const status = getPaymentStatus(s.id, monthPrefix, payments);

  const initials = s.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();

  const submitAdvance = async () => {
    const amt = parseFloat(advAmt);
    if (!amt || amt <= 0) { setAdvErr(true); return; }
    await addAdvance({ staffId: s.id, amount: amt, date: advDate, note: advNote });
    showToast('Advance recorded');
    setAdvSheetOpen(false);
    setAdvAmt(''); setAdvNote(''); setAdvErr(false);
  };

  const submitAdjustment = async () => {
    const amt = parseFloat(adjAmt);
    if (!amt || amt <= 0) { setAdjErr(true); return; }
    const date = new Date().toISOString().split('T')[0];
    await addAdjustment({ staffId: s.id, kind: adjKind, amount: amt, date, note: adjNote });
    showToast(adjKind === 'bonus' ? 'Bonus added' : 'Deduction added');
    setAdjSheetOpen(false);
    setAdjAmt(''); setAdjNote(''); setAdjErr(false);
  };

  return (
    <AppLayout showNav={false}>
      <div className="sticky top-0 z-20 bg-paper border-b border-line-soft pt-[max(6px,env(safe-area-inset-top))] px-5 pb-3">
        <div className="flex items-center justify-between gap-[10px]">
          <div onClick={() => router.back()} className="w-[34px] h-[34px] rounded-full border border-line bg-paper-card flex items-center justify-center cursor-pointer text-ink flex-none active:scale-95 transition-transform">
            <ChevronLeft size={17} />
          </div>
          <h1 className="font-display font-semibold text-[21px] m-0">{s.name.split(' ')[0]}</h1>
          <div className="w-[34px]" />
        </div>
      </div>

      <div className="p-1 px-5 pb-[calc(30px+env(safe-area-inset-bottom))]">
        <Card className="flex items-center gap-[13px]">
          <div className="w-[52px] h-[52px] rounded-full flex-none flex items-center justify-center font-extrabold text-[17px] text-white bg-sage">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-[16px] truncate">{s.name}</div>
            <div className="text-[12px] text-ink-faint mt-[1px]">
              {s.category} · {s.payType === 'monthly' ? `${fmtMoney(s.rate)}/month` : `${fmtMoney(s.rate)}/${s.payType === 'visit' ? 'visit' : 'day'}`}
            </div>
          </div>
          <Badge status={s.active ? 'active' : 'inactive'} />
        </Card>

        <div className="flex gap-[10px] mb-[14px]">
          <Link href="/attendance" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">Mark attendance</Button>
          </Link>
          <Link href="/attendance" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">View calendar</Button>
          </Link>
        </div>

        <Card>
          <CardTitleRow title={`${monthLabel} summary`} />
          <div className="grid grid-cols-2 gap-[10px]">
            <div className="bg-paper-card border border-line-soft rounded-[12px] p-[13px]">
              <div className="text-[20px] font-extrabold text-sage">{c.full}</div>
              <div className="text-[11.5px] text-ink-faint font-bold mt-[2px]">Full days</div>
            </div>
            <div className="bg-paper-card border border-line-soft rounded-[12px] p-[13px]">
              <div className="text-[20px] font-extrabold text-amber">{c.half}</div>
              <div className="text-[11.5px] text-ink-faint font-bold mt-[2px]">Half days</div>
            </div>
            <div className="bg-paper-card border border-line-soft rounded-[12px] p-[13px]">
              <div className="text-[20px] font-extrabold text-brick">{c.absent}</div>
              <div className="text-[11.5px] text-ink-faint font-bold mt-[2px]">Absent</div>
            </div>
            <div className="bg-paper-card border border-line-soft rounded-[12px] p-[13px]">
              <div className="text-[20px] font-extrabold text-marigold-deep">{c.holiday}</div>
              <div className="text-[11.5px] text-ink-faint font-bold mt-[2px]">Holiday</div>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitleRow title="Salary breakdown" sub="How this is calculated" />
          
          {s.payType !== 'monthly' ? (
            <>
              <div className="flex justify-between py-2 border-b border-dashed border-line text-[13.5px]">
                <span className="text-ink-soft">{c.full} full days × {fmtMoney(s.rate)}</span>
                <span className="font-bold num">{fmtMoney(c.full * s.rate)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-line text-[13.5px]">
                <span className="text-ink-soft">{c.half} half days × {fmtMoney(s.rate / 2)}</span>
                <span className="font-bold num">{fmtMoney(c.half * (s.rate / 2))}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between py-2 border-b border-dashed border-line text-[13.5px]">
              <span className="text-ink-soft">{s.salaryRule === 'prorata' ? 'Pro-rata base salary' : 'Fixed monthly salary'}</span>
              <span className="font-bold num">{fmtMoney(gross)}</span>
            </div>
          )}

          {bon > 0 && (
            <div className="flex justify-between py-2 border-b border-dashed border-line text-[13.5px]">
              <span className="text-ink-soft">Bonus / extra work</span>
              <span className="font-bold num">+{fmtMoney(bon)}</span>
            </div>
          )}
          {adv > 0 && (
            <div className="flex justify-between py-2 border-b border-dashed border-line text-[13.5px]">
              <span className="text-brick">Advance deducted</span>
              <span className="font-bold text-brick num">− {fmtMoney(adv)}</span>
            </div>
          )}
          {ded > 0 && (
            <div className="flex justify-between py-2 border-b border-dashed border-line text-[13.5px]">
              <span className="text-brick">Other deductions</span>
              <span className="font-bold text-brick num">− {fmtMoney(ded)}</span>
            </div>
          )}

          <div className="flex justify-between pt-[11px] mt-[4px] border-t-[1.5px] border-ink text-[16px] font-extrabold">
            <span>Final payable</span>
            <span className="num">{fmtMoney(net)}</span>
          </div>

          <div className="h-[12px]" />
          <div className="flex gap-[10px]">
            <Button variant="ghost" size="sm" onClick={() => setAdvSheetOpen(true)}>+ Advance</Button>
            <Button variant="ghost" size="sm" onClick={() => setAdjSheetOpen(true)}>+ Adjustment</Button>
          </div>
        </Card>

        <Link href={`/payments/detail?id=${s.id}`}>
          <Button variant="primary">{status === 'paid' ? 'View payment' : 'Review & mark as paid'}</Button>
        </Link>

        {/* Advance Sheet */}
        <BottomSheet isOpen={advSheetOpen} onClose={() => setAdvSheetOpen(false)} title="Add advance" sub="Recorded against this month's payment">
          <div className="mb-[14px]">
            <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Amount (₹)</label>
            <input type="number" inputMode="numeric" placeholder="2000" value={advAmt} onChange={e => { setAdvAmt(e.target.value); setAdvErr(false); }} className={`w-full p-[12px_13px] rounded-[11px] border-[1.4px] bg-paper-card text-ink text-[14.5px] outline-none transition-colors ${advErr ? 'border-brick' : 'border-line focus:border-marigold'}`} />
            {advErr && <div className="text-brick text-[12px] mt-1 font-semibold">Please enter a valid amount.</div>}
          </div>
          <div className="mb-[14px]">
            <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Date</label>
            <input type="date" value={advDate} onChange={e => setAdvDate(e.target.value)} className="w-full p-[12px_13px] rounded-[11px] border-[1.4px] border-line bg-paper-card text-ink text-[14.5px] outline-none" />
          </div>
          <div className="mb-[20px]">
            <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Note (optional)</label>
            <input placeholder="e.g. Festival advance" value={advNote} onChange={e => setAdvNote(e.target.value)} className="w-full p-[12px_13px] rounded-[11px] border-[1.4px] border-line bg-paper-card text-ink text-[14.5px] outline-none" />
          </div>
          <div className="flex gap-[10px]">
            <Button variant="ghost" onClick={() => setAdvSheetOpen(false)}>Cancel</Button>
            <Button variant="marigold" onClick={submitAdvance}>Save</Button>
          </div>
        </BottomSheet>

        {/* Adjustment Sheet */}
        <BottomSheet isOpen={adjSheetOpen} onClose={() => setAdjSheetOpen(false)} title="Add adjustment" sub="Bonus, overtime, loan repayment, or other">
          <div className="mb-[14px]">
            <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Type</label>
            <div className="flex gap-2">
              <button onClick={() => setAdjKind('bonus')} className={`px-[14px] py-[9px] rounded-[20px] border-[1.4px] text-[13px] font-bold ${adjKind === 'bonus' ? 'bg-ink text-paper border-ink' : 'bg-paper-card text-ink-soft border-line'}`}>Bonus / extra</button>
              <button onClick={() => setAdjKind('deduct')} className={`px-[14px] py-[9px] rounded-[20px] border-[1.4px] text-[13px] font-bold ${adjKind === 'deduct' ? 'bg-ink text-paper border-ink' : 'bg-paper-card text-ink-soft border-line'}`}>Deduction</button>
            </div>
          </div>
          <div className="mb-[14px]">
            <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Amount (₹)</label>
            <input type="number" inputMode="numeric" placeholder="500" value={adjAmt} onChange={e => { setAdjAmt(e.target.value); setAdjErr(false); }} className={`w-full p-[12px_13px] rounded-[11px] border-[1.4px] bg-paper-card text-ink text-[14.5px] outline-none transition-colors ${adjErr ? 'border-brick' : 'border-line focus:border-marigold'}`} />
            {adjErr && <div className="text-brick text-[12px] mt-1 font-semibold">Please enter a valid amount.</div>}
          </div>
          <div className="mb-[20px]">
            <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Note (optional)</label>
            <input placeholder="e.g. Overtime on Sunday" value={adjNote} onChange={e => setAdjNote(e.target.value)} className="w-full p-[12px_13px] rounded-[11px] border-[1.4px] border-line bg-paper-card text-ink text-[14.5px] outline-none" />
          </div>
          <div className="flex gap-[10px]">
            <Button variant="ghost" onClick={() => setAdjSheetOpen(false)}>Cancel</Button>
            <Button variant="marigold" onClick={submitAdjustment}>Save</Button>
          </div>
        </BottomSheet>

      </div>
    </AppLayout>
  );
}

export default function StaffProfile() {
  return (
    <Suspense fallback={<AppLayout showNav={false}><div className="p-5 text-center text-ink-faint">Loading...</div></AppLayout>}>
      <StaffProfileInner />
    </Suspense>
  );
}
