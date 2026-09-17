"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardTitleRow } from '@/components/ui/Card';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { AttendancePillGroup } from '@/components/ui/AttendancePill';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useStore } from '@/lib/store';
import { ChevronLeft, ChevronRight, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { daysInMonth, getAttendanceCounts, fmtMoney } from '@/lib/calculations';
import { AttendanceStatus } from '@/lib/db';

export default function Attendance() {
  const [mode, setMode] = useState<'today' | 'calendar'>('today');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  
  const { staff, attendance, setAttendance } = useStore();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; 
  const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  return (
    <AppLayout>
      <div className="sticky top-0 z-20 bg-paper border-b border-line-soft pt-[max(6px,env(safe-area-inset-top))] px-5 pb-3">
        <div className="flex items-center justify-between gap-[10px]">
          <h1 className="font-display font-semibold text-[21px] m-0">Attendance</h1>
          <Link href="/reports" className="w-[34px] h-[34px] rounded-full border border-line bg-paper-card flex items-center justify-center text-ink-soft flex-none active:scale-95 transition-transform">
            <IndianRupee size={17} />
          </Link>
        </div>
        <div className="flex gap-2 mt-3">
          <Chip selected={mode === 'today'} onClick={() => setMode('today')}>Today's list</Chip>
          <Chip selected={mode === 'calendar'} onClick={() => setMode('calendar')}>Calendar</Chip>
        </div>
      </div>

      <div className="p-1 px-5 pb-[calc(110px+env(safe-area-inset-bottom))]">
        {mode === 'today' ? (
          <TodayList staff={staff} attendance={attendance} todayStr={todayStr} setAttendance={setAttendance} />
        ) : (
          <CalendarView 
            staff={staff} 
            attendance={attendance} 
            selectedStaff={selectedStaff} 
            setSelectedStaff={setSelectedStaff}
            setAttendance={setAttendance}
            year={year}
            month={month}
          />
        )}
      </div>
    </AppLayout>
  );
}

function TodayList({ staff, attendance, todayStr, setAttendance }: any) {
  const dateLabel = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  
  return (
    <Card>
      <CardTitleRow title={dateLabel} sub="Tap to mark" />
      {staff.map((s: any) => {
        const currentEntry = attendance.find((a: any) => a.staffId === s.id && a.date === todayStr);
        const currentStatus = currentEntry?.status;
        const initials = s.name.split(' ').map((n: string) => n[0]).slice(0,2).join('').toUpperCase();
        
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
    </Card>
  );
}

function CalendarView({ staff, attendance, selectedStaff, setSelectedStaff, setAttendance, year, month }: any) {
  return (
    <>
      <div className="text-[11.5px] font-extrabold tracking-[0.3px] text-ink-faint my-[10px] mt-[14px]">View by staff</div>
      <ChipGroup className="mb-4">
        <Chip selected={selectedStaff === 'all'} onClick={() => setSelectedStaff('all')}>All staff</Chip>
        {staff.map((s: any) => (
          <Chip key={s.id} selected={selectedStaff === s.id} onClick={() => setSelectedStaff(s.id)}>
            {s.name.split(' ')[0]}
          </Chip>
        ))}
      </ChipGroup>
      
      {selectedStaff === 'all' ? (
        <CalendarCard attendance={attendance} staff={staff} year={year} month={month} />
      ) : (
        <StaffAttendanceBlock staff={staff.find((s: any) => s.id === selectedStaff)} attendance={attendance} year={year} month={month} setAttendance={setAttendance} />
      )}
    </>
  );
}

function CalendarCard({ attendance, staff, year, month, specificStaffId, onDayClick }: any) {
  const monthLabel = new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const dim = daysInMonth(year, month);
  const firstDow = new Date(year, month - 1, 1).getDay();
  
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(<div key={`empty-${i}`} className="aspect-square invisible" />);
  
  for (let d = 1; d <= dim; d++) {
    const dStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    let status = null;
    
    if (specificStaffId) {
      status = attendance.find((a: any) => a.staffId === specificStaffId && a.date === dStr)?.status;
    } else {
      // Logic for all staff: if all active staff marked, full. Else if past and partial, partial.
      const activeStaff = staff.filter((s: any) => s.active);
      const marks = activeStaff.map((s: any) => attendance.find((a: any) => a.staffId === s.id && a.date === dStr));
      const allMarked = activeStaff.length > 0 && marks.every((m: any) => !!m);
      const isPast = new Date(dStr) <= new Date();
      status = allMarked ? 'full' : (isPast ? 'partial' : null);
    }
    
    const isToday = dStr === new Date().toISOString().split('T')[0];
    
    cells.push(
      <div 
        key={d} 
        onClick={() => specificStaffId && onDayClick?.(dStr, status)}
        className={`aspect-square rounded-[9px] flex flex-col items-center justify-center text-[12px] font-bold text-ink bg-paper relative ${isToday ? 'shadow-[inset_0_0_0_2px_var(--marigold-deep)]' : ''} ${specificStaffId ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
      >
        <span>{d}</span>
        {status && (
          <span className={`w-[5px] h-[5px] rounded-full mt-[3px] ${
            status === 'full' ? 'bg-sage' :
            status === 'half' ? 'bg-amber' :
            status === 'absent' ? 'bg-brick' :
            status === 'holiday' ? 'bg-marigold' : 'bg-gray'
          }`} />
        )}
      </div>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-[10px]">
        <div className="w-[30px] h-[30px] rounded-full border border-line bg-paper-card flex items-center justify-center text-ink-soft"><ChevronLeft size={16} /></div>
        <div className="font-extrabold text-[14.5px]">{monthLabel}</div>
        <div className="w-[30px] h-[30px] rounded-full border border-line bg-paper-card flex items-center justify-center text-ink-soft"><ChevronRight size={16} /></div>
      </div>
      
      <div className="grid grid-cols-7 gap-[5px]">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-[10px] text-center text-ink-faint font-extrabold pb-1">{d}</div>
        ))}
        {cells}
      </div>
      
      <div className="flex flex-wrap gap-[10px] mt-3 text-[11px] text-ink-soft">
        <span className="flex items-center gap-[5px]"><span className="w-[7px] h-[7px] rounded-full bg-sage" />Full day</span>
        <span className="flex items-center gap-[5px]"><span className="w-[7px] h-[7px] rounded-full bg-amber" />Half day</span>
        <span className="flex items-center gap-[5px]"><span className="w-[7px] h-[7px] rounded-full bg-brick" />Absent</span>
        <span className="flex items-center gap-[5px]"><span className="w-[7px] h-[7px] rounded-full bg-marigold" />Holiday</span>
      </div>
    </Card>
  );
}

function StaffAttendanceBlock({ staff: s, attendance, year, month, setAttendance }: any) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetDay, setSheetDay] = useState<{date: string, status: AttendanceStatus | null} | null>(null);

  const counts = getAttendanceCounts(s.id, attendance, year, month);
  const initials = s.name.split(' ').map((n: string) => n[0]).slice(0,2).join('').toUpperCase();

  const handleDayClick = (date: string, status: AttendanceStatus | null) => {
    setSheetDay({ date, status });
    setSheetOpen(true);
  };

  const handleSetStatus = (status: AttendanceStatus | null) => {
    if (sheetDay) {
      if (status) {
        setAttendance(s.id, sheetDay.date, status);
      } else {
        // Toggle logic internally removes if it matches current, but let's just enforce removal.
        // Zustand toggle handles removal if same status is passed. We'll simulate it by passing current status to remove it.
        if (sheetDay.status) {
          setAttendance(s.id, sheetDay.date, sheetDay.status); // toggles off
        }
      }
      setSheetOpen(false);
    }
  };

  return (
    <>
      <Card>
        <div className="flex items-center gap-[11px] mb-1">
          <div className="w-[40px] h-[40px] rounded-full flex-none flex items-center justify-center font-extrabold text-[14px] text-white bg-sage">
            {initials}
          </div>
          <div>
            <div className="font-bold text-[14.5px]">{s.name}</div>
            <div className="text-[12px] text-ink-faint mt-[1px]">
              {s.payType === 'monthly' ? `${fmtMoney(s.rate)}/month` : `${fmtMoney(s.rate)}/${s.payType === 'visit' ? 'visit' : 'day'}`}
            </div>
          </div>
        </div>
      </Card>
      
      <CalendarCard attendance={attendance} year={year} month={month} specificStaffId={s.id} onDayClick={handleDayClick} />
      
      <Card>
        <CardTitleRow title="Summary" />
        <div className="grid grid-cols-2 gap-[10px]">
          <div className="bg-paper-card border border-line-soft rounded-[12px] p-[13px]">
            <div className="text-[20px] font-extrabold text-sage">{counts.full}</div>
            <div className="text-[11.5px] text-ink-faint font-bold mt-[2px]">Full days</div>
          </div>
          <div className="bg-paper-card border border-line-soft rounded-[12px] p-[13px]">
            <div className="text-[20px] font-extrabold text-amber">{counts.half}</div>
            <div className="text-[11.5px] text-ink-faint font-bold mt-[2px]">Half days</div>
          </div>
          <div className="bg-paper-card border border-line-soft rounded-[12px] p-[13px]">
            <div className="text-[20px] font-extrabold text-brick">{counts.absent}</div>
            <div className="text-[11.5px] text-ink-faint font-bold mt-[2px]">Absent</div>
          </div>
          <div className="bg-paper-card border border-line-soft rounded-[12px] p-[13px]">
            <div className="text-[20px] font-extrabold text-marigold-deep">{counts.holiday}</div>
            <div className="text-[11.5px] text-ink-faint font-bold mt-[2px]">Holiday</div>
          </div>
        </div>
      </Card>
      
      <Link href={`/staff/detail?id=${s.id}`}>
        <Button variant="outline">View salary breakdown</Button>
      </Link>

      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title={sheetDay ? new Date(sheetDay.date).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'}) : ''} sub={s.name}>
        <div className="space-y-1 mt-2">
          {[
            {v: 'full', label: 'Full day'}, 
            {v: 'half', label: 'Half day'}, 
            {v: 'absent', label: 'Absent'}, 
            {v: 'holiday', label: 'Holiday'}
          ].map((o) => (
            <div 
              key={o.v} 
              className="flex items-center gap-[10px] py-[11px] border-b border-line-soft last:border-b-0 cursor-pointer"
              onClick={() => handleSetStatus(o.v as AttendanceStatus)}
            >
              <div className={`w-[20px] h-[20px] rounded-full border-2 relative flex-none ${sheetDay?.status === o.v ? 'border-marigold-deep' : 'border-line'}`}>
                {sheetDay?.status === o.v && <div className="absolute inset-[3px] rounded-full bg-marigold-deep" />}
              </div>
              <div className="text-[13.5px] font-bold">{o.label}</div>
            </div>
          ))}
          {sheetDay?.status && (
            <div 
              className="flex items-center gap-[10px] py-[11px] border-b border-line-soft last:border-b-0 cursor-pointer text-brick"
              onClick={() => handleSetStatus(null)}
            >
              <div className="w-[20px] h-[20px] rounded-full border-2 border-brick/40 relative flex-none" />
              <div className="text-[13.5px] font-bold">Clear attendance</div>
            </div>
          )}
        </div>
        <div className="flex gap-[10px] mt-[8px]">
          <Button variant="ghost" onClick={() => setSheetOpen(false)}>Cancel</Button>
        </div>
      </BottomSheet>
    </>
  );
}
