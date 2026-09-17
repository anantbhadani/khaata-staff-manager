import { create } from 'zustand';
import { db, Staff, AttendanceEntry, Advance, Adjustment, Payment, AttendanceStatus } from './db';
interface KhaataState {
  isLoaded: boolean;
  onboardingDone: boolean;
  theme: 'light' | 'dark' | 'system';
  staff: Staff[];
  attendance: AttendanceEntry[];
  advances: Advance[];
  adjustments: Adjustment[];
  payments: Payment[];

  // Actions
  loadInitialData: () => Promise<void>;
  setOnboardingDone: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addStaff: (staff: Omit<Staff, 'id' | 'createdAt'>) => Promise<void>;
  updateStaff: (id: string, data: Partial<Staff>) => Promise<void>;
  setAttendance: (staffId: string, date: string, status: AttendanceStatus) => Promise<void>;
  addAdvance: (advance: Omit<Advance, 'id'>) => Promise<void>;
  addAdjustment: (adjustment: Omit<Adjustment, 'id'>) => Promise<void>;
  markPaymentPaid: (payment: Omit<Payment, 'id'>) => Promise<void>;
  undoPayment: (staffId: string, month: string) => Promise<void>;
}

export const useStore = create<KhaataState>((set, get) => ({
  isLoaded: false,
  onboardingDone: false, // In a real app, persist this flag in localStorage or Dexie
  theme: 'system',
  staff: [],
  attendance: [],
  advances: [],
  adjustments: [],
  payments: [],

  loadInitialData: async () => {
    try {
      const staff = await db.staff.toArray();
      const attendance = await db.attendance.toArray();
      const advances = await db.advances.toArray();
      const adjustments = await db.adjustments.toArray();
      const payments = await db.payments.toArray();
      
      const obDone = localStorage.getItem('onboardingDone') === 'true';
      const storedTheme = (localStorage.getItem('theme') as any) || 'system';

      set({ 
        staff, 
        attendance, 
        advances, 
        adjustments, 
        payments, 
        isLoaded: true,
        onboardingDone: obDone,
        theme: storedTheme
      });
    } catch (e) {
      console.error("Failed to load initial data", e);
      set({ isLoaded: true }); // even on fail, mark loaded to show UI
    }
  },

  setOnboardingDone: () => {
    localStorage.setItem('onboardingDone', 'true');
    set({ onboardingDone: true });
  },

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },

  addStaff: async (staffData) => {
    const id = crypto.randomUUID();
    const newStaff: Staff = { ...staffData, id, createdAt: new Date().toISOString() };
    
    // Sync update for instant UI
    set((state) => ({ staff: [...state.staff, newStaff] }));
    
    // Async DB update
    await db.staff.add(newStaff);
  },

  updateStaff: async (id, data) => {
    set((state) => ({
      staff: state.staff.map(s => s.id === id ? { ...s, ...data } : s)
    }));
    await db.staff.update(id, data);
  },

  setAttendance: async (staffId, date, status) => {
    // Check if exists
    const current = get().attendance.find(a => a.staffId === staffId && a.date === date);
    
    if (current && current.status === status) {
      // Toggle off (remove)
      set((state) => ({
        attendance: state.attendance.filter(a => !(a.staffId === staffId && a.date === date))
      }));
      if (current.id) {
        await db.attendance.delete(current.id);
      }
    } else {
      // Add or update
      if (current) {
        set((state) => ({
          attendance: state.attendance.map(a => 
            a.staffId === staffId && a.date === date ? { ...a, status } : a
          )
        }));
        if (current.id) {
          await db.attendance.update(current.id, { status });
        }
      } else {
        const id = crypto.randomUUID();
        const newEntry: AttendanceEntry = { id, staffId, date, status };
        // We do optimistic UI without DB id first, then fetch it back or just rely on state
        // For accurate ID sync, we might need to await the DB operation, but for speed:
        set((state) => ({
          attendance: [...state.attendance, newEntry]
        }));
        await db.attendance.add(newEntry);
      }
    }
  },

  addAdvance: async (advance) => {
    const id = crypto.randomUUID();
    const newAdv = { ...advance, id };
    set((state) => ({ advances: [...state.advances, newAdv] }));
    await db.advances.add(newAdv);
  },

  addAdjustment: async (adjustment) => {
    const id = crypto.randomUUID();
    const newAdj = { ...adjustment, id };
    set((state) => ({ adjustments: [...state.adjustments, newAdj] }));
    await db.adjustments.add(newAdj);
  },

  markPaymentPaid: async (payment) => {
    const current = get().payments.find(p => p.staffId === payment.staffId && p.month === payment.month);
    if (current) {
      set((state) => ({
        payments: state.payments.map(p => 
          p.staffId === payment.staffId && p.month === payment.month ? { ...p, ...payment, status: 'paid' } : p
        )
      }));
      if (current.id) {
        await db.payments.update(current.id, { ...payment, status: 'paid' });
      }
    } else {
      const id = crypto.randomUUID();
      const newPayment: Payment = { ...payment, id, status: 'paid' };
      set((state) => ({ payments: [...state.payments, newPayment] }));
      await db.payments.add(newPayment);
    }
  },

  undoPayment: async (staffId, month) => {
    const current = get().payments.find(p => p.staffId === staffId && p.month === month);
    if (current && current.id) {
      set((state) => ({
        payments: state.payments.filter(p => p.id !== current.id)
      }));
      await db.payments.delete(current.id);
    }
  }
}));
