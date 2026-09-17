"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import { useStore } from '@/lib/store';
import { useToastStore } from '@/components/ui/Toast';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PayType, SalaryRule } from '@/lib/db';

const CATEGORIES = ['Cook', 'Maid', 'Labor', 'Driver', 'Milk', 'Cleaner', 'Gardener', 'Security', 'Other'];
const PAY_TYPES: {v: PayType, l: string}[] = [
  {v: 'daily', l: 'Daily'}, 
  {v: 'monthly', l: 'Monthly'}, 
  {v: 'visit', l: 'Per visit'}
];

export default function AddStaff() {
  const router = useRouter();
  const { addStaff } = useStore();
  const { showToast } = useToastStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Labor');
  const [payType, setPayType] = useState<PayType>('daily');
  const [rate, setRate] = useState('');
  const [salaryRule, setSalaryRule] = useState<SalaryRule>('fixed');
  
  const [nameErr, setNameErr] = useState(false);
  const [rateErr, setRateErr] = useState(false);

  const handleSubmit = async () => {
    let valid = true;
    if (!name.trim()) {
      setNameErr(true);
      showToast("Enter the staff member's name");
      valid = false;
    }
    const rateVal = parseFloat(rate);
    if (!rateVal || rateVal <= 0) {
      setRateErr(true);
      valid = false;
    }
    if (!valid) return;

    await addStaff({
      name: name.trim(),
      category,
      payType,
      rate: rateVal,
      salaryRule,
      active: true
    });

    showToast('Staff member added');
    router.push('/staff');
  };

  return (
    <AppLayout showNav={false}>
      <div className="sticky top-0 z-20 bg-paper border-b border-line-soft pt-[max(6px,env(safe-area-inset-top))] px-5 pb-3">
        <div className="flex items-center justify-between gap-[10px]">
          <div 
            onClick={() => router.back()} 
            className="w-[34px] h-[34px] rounded-full border border-line bg-paper-card flex items-center justify-center cursor-pointer text-ink flex-none active:scale-95 transition-transform"
          >
            <ChevronLeft size={17} />
          </div>
          <h1 className="font-display font-semibold text-[21px] m-0">Add staff</h1>
          <div className="w-[34px]" />
        </div>
      </div>

      <div className="p-1 px-5 pb-[calc(30px+env(safe-area-inset-bottom))]">
        
        <div className="text-[11.5px] font-extrabold tracking-[0.3px] text-ink-faint my-[10px] mt-[22px]">Personal information</div>
        
        <div className="mb-[14px]">
          <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Name</label>
          <input 
            placeholder="e.g. Ramesh Kumar" 
            value={name}
            onChange={e => { setName(e.target.value); setNameErr(false); }}
            className={`w-full p-[12px_13px] rounded-[11px] border-[1.4px] bg-paper-card text-ink text-[14.5px] outline-none transition-colors ${nameErr ? 'border-brick' : 'border-line focus:border-marigold focus:ring-2 focus:ring-marigold/20'}`}
          />
        </div>

        <div className="mb-[14px]">
          <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Work type</label>
          <ChipGroup>
            {CATEGORIES.map(c => (
              <Chip key={c} selected={category === c} onClick={() => setCategory(c)}>{c}</Chip>
            ))}
          </ChipGroup>
        </div>

        <div className="text-[11.5px] font-extrabold tracking-[0.3px] text-ink-faint my-[10px] mt-[22px]">Payment information</div>

        <div className="mb-[14px]">
          <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Payment method</label>
          <ChipGroup>
            {PAY_TYPES.map(p => (
              <Chip key={p.v} selected={payType === p.v} onClick={() => setPayType(p.v)}>{p.l}</Chip>
            ))}
          </ChipGroup>
        </div>

        <div className="mb-[14px]">
          <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">
            {payType === 'monthly' ? 'Monthly salary (₹)' : payType === 'visit' ? 'Rate per visit (₹)' : 'Daily rate (₹)'}
          </label>
          <input 
            type="number"
            inputMode="numeric"
            placeholder="e.g. 500" 
            value={rate}
            onChange={e => { setRate(e.target.value); setRateErr(false); }}
            className={`w-full p-[12px_13px] rounded-[11px] border-[1.4px] bg-paper-card text-ink text-[14.5px] outline-none transition-colors ${rateErr ? 'border-brick' : 'border-line focus:border-marigold focus:ring-2 focus:ring-marigold/20'}`}
          />
          {rateErr && <div className="text-brick text-[12px] mt-1 font-semibold">Please enter a valid rate.</div>}
        </div>

        {payType === 'monthly' && (
          <div className="mb-[14px]">
            <label className="block text-[12.5px] font-bold text-ink-soft mb-[6px]">Salary calculation</label>
            <div className="bg-paper-card border border-line-soft rounded-[14px] p-[4px_14px]">
              <div 
                className="flex items-center gap-[10px] py-[11px] border-b border-line-soft cursor-pointer"
                onClick={() => setSalaryRule('fixed')}
              >
                <div className={`w-[20px] h-[20px] rounded-full border-2 relative flex-none ${salaryRule === 'fixed' ? 'border-marigold-deep' : 'border-line'}`}>
                  {salaryRule === 'fixed' && <div className="absolute inset-[3px] rounded-full bg-marigold-deep" />}
                </div>
                <div>
                  <div className="text-[13.5px] font-bold">Fixed monthly salary</div>
                  <div className="text-[11.5px] text-ink-faint mt-[1px]">Attendance doesn't change the amount</div>
                </div>
              </div>
              <div 
                className="flex items-center gap-[10px] py-[11px] cursor-pointer"
                onClick={() => setSalaryRule('prorata')}
              >
                <div className={`w-[20px] h-[20px] rounded-full border-2 relative flex-none ${salaryRule === 'prorata' ? 'border-marigold-deep' : 'border-line'}`}>
                  {salaryRule === 'prorata' && <div className="absolute inset-[3px] rounded-full bg-marigold-deep" />}
                </div>
                <div>
                  <div className="text-[13.5px] font-bold">Pro-rata on attendance</div>
                  <div className="text-[11.5px] text-ink-faint mt-[1px]">Scales with days present</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Button variant="marigold" className="mt-[20px]" onClick={handleSubmit}>Add staff</Button>
      </div>
    </AppLayout>
  );
}
