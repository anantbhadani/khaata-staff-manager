"use client";

import React from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Check } from 'lucide-react';

type PillStatus = 'full' | 'half' | 'absent' | 'holiday' | undefined;

interface AttendancePillProps {
  currentStatus: PillStatus;
  status: NonNullable<PillStatus>;
  onToggle: (status: NonNullable<PillStatus>) => void;
}

export function AttendancePill({ currentStatus, status, onToggle }: AttendancePillProps) {
  const isSelected = currentStatus === status;

  const handleTap = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      // Ignore if not on a device that supports haptics
    }
    onToggle(status);
  };

  let bgClass = 'bg-paper text-ink-faint border-line';
  if (isSelected) {
    if (status === 'full') bgClass = 'bg-sage border-sage text-white';
    if (status === 'half') bgClass = 'bg-amber border-amber text-white';
    if (status === 'absent') bgClass = 'bg-brick border-brick text-white';
  }

  let content;
  if (status === 'full') content = <Check size={16} strokeWidth={3} />;
  if (status === 'half') content = '½';
  if (status === 'absent') content = '✕';

  return (
    <button
      onClick={handleTap}
      className={`w-8 h-8 rounded-[9px] border-[1.4px] flex items-center justify-center font-extrabold text-[13px] cursor-pointer transition-transform active:scale-90 ${bgClass}`}
    >
      {content}
    </button>
  );
}

export function AttendancePillGroup({
  currentStatus,
  onUpdate
}: {
  currentStatus: PillStatus;
  onUpdate: (status: PillStatus) => void;
}) {
  const handleToggle = (status: NonNullable<PillStatus>) => {
    // Tap again to undo
    if (currentStatus === status) {
      onUpdate(undefined);
    } else {
      onUpdate(status);
    }
  };

  return (
    <div className="flex gap-[5px] flex-none">
      <AttendancePill currentStatus={currentStatus} status="full" onToggle={handleToggle} />
      <AttendancePill currentStatus={currentStatus} status="half" onToggle={handleToggle} />
      <AttendancePill currentStatus={currentStatus} status="absent" onToggle={handleToggle} />
    </div>
  );
}
