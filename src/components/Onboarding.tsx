"use client";

import React, { useState } from 'react';
import { Users, CheckCircle, IndianRupee } from 'lucide-react';
import { Button } from './ui/Button';
import { useStore } from '@/lib/store';

const slides = [
  {
    title: 'Manage your staff effortlessly',
    text: 'Track attendance and payments for everyone who works for you, in one place.',
    Icon: Users
  },
  {
    title: 'Mark attendance in seconds',
    text: 'Full day, half day, absent — one tap records it, every single day.',
    Icon: CheckCircle
  },
  {
    title: 'Know exactly what to pay',
    text: 'Automatic salary calculations, advances, and a clear payment history.',
    Icon: IndianRupee
  }
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const { setOnboardingDone } = useStore();
  
  const slide = slides[step];
  const Icon = slide.Icon;

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(s => s + 1);
    } else {
      setOnboardingDone();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-paper">
      <div className="flex-1 flex flex-col items-center justify-center text-center p-[30px]">
        <div className="w-[96px] h-[96px] rounded-[26px] bg-marigold-bg flex items-center justify-center mb-[26px] text-marigold-deep">
          <Icon size={42} strokeWidth={2} />
        </div>
        <h1 className="font-display font-semibold text-[24px] m-0 mb-[10px] leading-tight">
          {slide.title}
        </h1>
        <p className="text-[14px] text-ink-soft leading-relaxed max-w-[280px]">
          {slide.text}
        </p>
      </div>

      <div className="p-6 pb-[calc(30px+env(safe-area-inset-bottom))]">
        <div className="flex gap-[6px] justify-center pb-4">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-[6px] rounded-full transition-all duration-300 ${i === step ? 'w-[18px] bg-marigold-deep' : 'w-[6px] bg-line'}`} 
            />
          ))}
        </div>
        
        <Button variant="marigold" onClick={handleNext}>
          {step < slides.length - 1 ? 'Continue' : 'Get started'}
        </Button>
        
        {step < slides.length - 1 && (
          <div 
            className="text-center mt-3 text-[12.5px] text-ink-faint font-bold cursor-pointer"
            onClick={setOnboardingDone}
          >
            Skip
          </div>
        )}
      </div>
    </div>
  );
}
