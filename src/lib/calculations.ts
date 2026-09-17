import { Staff, AttendanceEntry, Advance, Adjustment, Payment } from './db';

export function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function getAttendanceCounts(staffId: string, attendance: AttendanceEntry[], year: number, month: number) {
  let full = 0, half = 0, absent = 0, holiday = 0;
  
  attendance.forEach(entry => {
    if (entry.staffId !== staffId) return;
    
    const d = new Date(entry.date);
    if (d.getFullYear() === year && (d.getMonth() + 1) === month) {
      if (entry.status === 'full') full++;
      if (entry.status === 'half') half++;
      if (entry.status === 'absent') absent++;
      if (entry.status === 'holiday') holiday++;
    }
  });
  
  return { full, half, absent, holiday };
}

export function grossPay(staff: Staff, counts: {full: number; half: number}, daysInMonth: number): number {
  if (staff.payType === 'daily' || staff.payType === 'visit') {
    return counts.full * staff.rate + counts.half * (staff.rate / 2);
  }
  if (staff.salaryRule === 'prorata') {
    const workedUnits = counts.full + counts.half * 0.5;
    return Math.round((staff.rate / daysInMonth) * workedUnits);
  }
  return staff.rate; // fixed monthly
}

export function advanceTotal(staffId: string, advances: Advance[], monthPrefix: string): number {
  return advances
    .filter(a => a.staffId === staffId && a.date.startsWith(monthPrefix))
    .reduce((sum, a) => sum + a.amount, 0);
}

export function deductionTotal(staffId: string, adjustments: Adjustment[], monthPrefix: string): number {
  return adjustments
    .filter(a => a.staffId === staffId && a.kind === 'deduct' && a.date.startsWith(monthPrefix))
    .reduce((sum, a) => sum + a.amount, 0);
}

export function bonusTotal(staffId: string, adjustments: Adjustment[], monthPrefix: string): number {
  return adjustments
    .filter(a => a.staffId === staffId && a.kind === 'bonus' && a.date.startsWith(monthPrefix))
    .reduce((sum, a) => sum + a.amount, 0);
}

export function netPayable(gross: number, bonusTotal: number, advanceTotal: number, deductionTotal: number): number {
  return gross + bonusTotal - advanceTotal - deductionTotal;
}

export function getPaymentStatus(staffId: string, month: string, payments: Payment[]) {
  const p = payments.find(p => p.staffId === staffId && p.month === month);
  return p ? p.status : 'pending';
}

export function fmtMoney(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}
