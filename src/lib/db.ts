import Dexie, { type Table } from 'dexie';

export type PayType = 'daily' | 'monthly' | 'visit';
export type SalaryRule = 'fixed' | 'prorata';
export type AttendanceStatus = 'full' | 'half' | 'absent' | 'holiday';
export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'other';

export interface Staff {
  id: string;
  name: string;
  category: string;
  phone?: string;
  payType: PayType;
  rate: number;
  salaryRule: SalaryRule;
  active: boolean;
  createdAt: string;
}

export interface AttendanceEntry {
  id?: string; // UUID primary key
  staffId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
}

export interface Advance {
  id: string;
  staffId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Adjustment {
  id: string;
  staffId: string;
  kind: 'bonus' | 'deduct';
  amount: number;
  note?: string;
  date: string;
}

export interface Payment {
  id?: string;
  staffId: string;
  month: string; // YYYY-MM
  amount: number;
  status: 'paid' | 'pending';
  method?: PaymentMethod;
  date?: string;
  note?: string;
}

export class KhaataDatabase extends Dexie {
  staff!: Table<Staff, string>;
  attendance!: Table<AttendanceEntry, string>;
  advances!: Table<Advance, string>;
  adjustments!: Table<Adjustment, string>;
  payments!: Table<Payment, string>;

  constructor() {
    super('KhaataDB');
    this.version(1).stores({
      staff: 'id, category, active',
      attendance: 'id, staffId, date, [staffId+date]', // Indexed by staffId+date for quick queries
      advances: 'id, staffId, date',
      adjustments: 'id, staffId, date',
      payments: 'id, staffId, month, [staffId+month]'
    });
  }
}

export const db = new KhaataDatabase();
