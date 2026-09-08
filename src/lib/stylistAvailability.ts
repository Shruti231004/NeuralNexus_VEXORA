import { Stylist } from './types';
import { INITIAL_STYLISTS } from './mockData';

export interface TimeSlotOption {
  time: string; // e.g. "10:00 AM"
  period: 'morning' | 'afternoon' | 'evening';
}

export const ALL_TIME_SLOTS: TimeSlotOption[] = [
  { time: '10:00 AM', period: 'morning' },
  { time: '10:30 AM', period: 'morning' },
  { time: '11:00 AM', period: 'morning' },
  { time: '11:30 AM', period: 'morning' },
  { time: '12:00 PM', period: 'morning' },
  { time: '12:30 PM', period: 'afternoon' },
  { time: '01:00 PM', period: 'afternoon' },
  { time: '01:30 PM', period: 'afternoon' },
  { time: '02:00 PM', period: 'afternoon' },
  { time: '02:30 PM', period: 'afternoon' },
  { time: '03:00 PM', period: 'afternoon' },
  { time: '03:30 PM', period: 'afternoon' },
  { time: '04:00 PM', period: 'afternoon' },
  { time: '04:30 PM', period: 'evening' },
  { time: '05:00 PM', period: 'evening' },
  { time: '05:30 PM', period: 'evening' },
  { time: '06:00 PM', period: 'evening' },
  { time: '06:30 PM', period: 'evening' },
  { time: '07:00 PM', period: 'evening' },
  { time: '07:30 PM', period: 'evening' },
  { time: '08:00 PM', period: 'evening' },
];

export interface StylistScheduleRecord {
  stylistId: string;
  date: string; // YYYY-MM-DD
  availableSlots: string[];
  isOffDuty: boolean;
}

const STORAGE_KEY = 'rose_rogue_stylist_schedules_v1';

// Default default shifts for each artisan
const DEFAULT_SHIFT_PATTERNS: Record<string, string[]> = {
  // Antoine Dubois (Morning & Afternoon Master): 10:00 AM - 04:30 PM
  'b0000000-0000-0000-0000-000000000001': [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ],
  // Camille Laurent (Midday to Evening Color Lead): 11:30 AM - 07:30 PM
  'b0000000-0000-0000-0000-000000000002': [
    '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'
  ],
  // Julien Moreau (Afternoon to Night Precision Lead): 01:00 PM - 08:00 PM
  'b0000000-0000-0000-0000-000000000003': [
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'
  ],
  // Élodie Fontaine (Full Day Restorative Care): 10:00 AM - 06:00 PM
  'b0000000-0000-0000-0000-000000000004': [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'
  ],
};

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getAllSchedulesFromStorage(): Record<string, StylistScheduleRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function saveAllSchedulesToStorage(data: Record<string, StylistScheduleRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Dispatch custom event for cross-component live reactive updates
    window.dispatchEvent(new Event('stylist-availability-updated'));
  } catch (e) {}
}

/**
 * Returns schedule for a given stylist and date, creating defaults if not yet initialized.
 */
export function getStylistSchedule(stylistId: string, dateStr: string): StylistScheduleRecord {
  const all = getAllSchedulesFromStorage();
  const key = `${stylistId}_${dateStr}`;
  if (all[key]) {
    return all[key];
  }

  // Generate standard default shift
  const defaultSlots = DEFAULT_SHIFT_PATTERNS[stylistId] || ALL_TIME_SLOTS.map((s) => s.time);
  return {
    stylistId,
    date: dateStr,
    availableSlots: defaultSlots,
    isOffDuty: false,
  };
}

/**
 * Toggle a specific slot's availability for a stylist
 */
export function toggleStylistSlotAvailability(
  stylistId: string,
  dateStr: string,
  timeSlot: string
): StylistScheduleRecord {
  const current = getStylistSchedule(stylistId, dateStr);
  const exists = current.availableSlots.includes(timeSlot);

  const updatedSlots = exists
    ? current.availableSlots.filter((t) => t !== timeSlot)
    : [...current.availableSlots, timeSlot];

  const updatedRecord: StylistScheduleRecord = {
    ...current,
    availableSlots: updatedSlots,
  };

  const all = getAllSchedulesFromStorage();
  all[`${stylistId}_${dateStr}`] = updatedRecord;
  saveAllSchedulesToStorage(all);

  return updatedRecord;
}

/**
 * Set stylist full-day duty status
 */
export function setStylistDutyStatus(
  stylistId: string,
  dateStr: string,
  isOffDuty: boolean
): StylistScheduleRecord {
  const current = getStylistSchedule(stylistId, dateStr);
  const updatedRecord: StylistScheduleRecord = {
    ...current,
    isOffDuty,
  };

  const all = getAllSchedulesFromStorage();
  all[`${stylistId}_${dateStr}`] = updatedRecord;
  saveAllSchedulesToStorage(all);

  return updatedRecord;
}

/**
 * Returns ONLY the stylists who are actually available at the chosen date and time slot.
 */
export function getAvailableStylistsForSlot(dateStr: string, timeSlot: string): Stylist[] {
  return INITIAL_STYLISTS.filter((stylist) => {
    if (!stylist.is_active) return false;
    const schedule = getStylistSchedule(stylist.id, dateStr);
    if (schedule.isOffDuty) return false;
    return schedule.availableSlots.includes(timeSlot);
  });
}

/**
 * Returns list of time slots with the count of currently available artisans for each.
 */
export function getAvailableSlotsSummary(dateStr: string): { slot: string; period: string; availableCount: number }[] {
  return ALL_TIME_SLOTS.map((slotObj) => {
    const available = getAvailableStylistsForSlot(dateStr, slotObj.time);
    return {
      slot: slotObj.time,
      period: slotObj.period,
      availableCount: available.length,
    };
  });
}
