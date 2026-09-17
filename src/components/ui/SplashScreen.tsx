"use client";

import React, { useEffect, useState } from 'react';

export function SplashScreen() {
  const [stage, setStage] = useState<'intro' | 'reveal' | 'done'>('intro');

  useEffect(() => {
    // Stage 1: Logo Intro (0 to 800ms)
    // Stage 2: Slide Up Reveal (800ms to 1200ms)
    // Stage 3: Unmount (1200ms)

    const t1 = setTimeout(() => setStage('reveal'), 800);
    const t2 = setTimeout(() => setStage('done'), 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (stage === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#171A23] via-[#202A42] to-[#4C7A55] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center ${stage === 'reveal' ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className={`relative w-[130px] h-[130px] rounded-[30px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(224,167,46,0.2)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${stage === 'intro' ? 'scale-100 opacity-100' : 'scale-[0.2] opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-marigold/20 to-transparent mix-blend-overlay pointer-events-none" />
        <img src="/logo.jpg" alt="Khaata Logo" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
