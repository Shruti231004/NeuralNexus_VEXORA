import { Stylist } from './types';
import { INITIAL_STYLISTS } from './mockData';

export interface StylistScheduleRecord {
  stylistId: string;
  date: string; // YYYY-MM-DD
  isOffDuty: boolean;
  shiftStart: string; // e.g. "10:00 AM" or "10:00"
  shiftEnd: string;   // e.g. "08:00 PM" or "20:00"
  hasBreak?: boolean;
  breakStart?: string; // e.g. "01:30 PM"
  breakEnd?: string;   // e.g. "02:30 PM"
}

const STORAGE_KEY = 'rose_rogue_stylist_schedules_v2';

/**
 * Converts any 12-hour ("11:30 AM", "2:15 PM") or 24-hour ("14:30") string into minutes from midnight.
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 600; // Default 10:00 AM (10 * 60)
  const clean = timeStr.trim().toUpperCase();

  // Match 12-hour format: "02:30 PM" or "2:30PM"
  const match12 = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const meridiem = match12[3];
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // Match 24-hour format: "14:30"
  const match24 = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }

  return 600;
}

/**
 * Converts minutes from midnight back to 12-hour format "hh:mm AM/PM"
 */
export function minutesTo12Hour(totalMinutes: number): string {
  const norm = ((totalMinutes % 1440) + 1440) % 1440;
  const rawHours = Math.floor(norm / 60);
  const minutes = norm % 60;
  const meridiem = rawHours >= 12 ? 'PM' : 'AM';
  const hours12 = rawHours % 12 === 0 ? 12 : rawHours % 12;
  const padHours = String(hours12).padStart(2, '0');
  const padMinutes = String(minutes).padStart(2, '0');
  return `${padHours}:${padMinutes} ${meridiem}`;
}

/**
 * Default shift schedules for each master stylist
 */
const DEFAULT_DYNAMIC_SHIFTS: Record<string, Partial<StylistScheduleRecord>> = {
  // Antoine Dubois (Morning & Afternoon Master): 10:00 AM - 05:00 PM, Break: 01:30 PM - 02:15 PM
  'b0000000-0000-0000-0000-000000000001': {
    shiftStart: '10:00 AM',
    shiftEnd: '05:00 PM',
    hasBreak: true,
    breakStart: '01:30 PM',
    breakEnd: '02:15 PM',
    isOffDuty: false,
  },
  // Camille Laurent (Midday to Evening Color Lead): 11:00 AM - 08:00 PM, Break: 03:00 PM - 03:45 PM
  'b0000000-0000-0000-0000-000000000002': {
    shiftStart: '11:00 AM',
    shiftEnd: '08:00 PM',
    hasBreak: true,
    breakStart: '03:00 PM',
    breakEnd: '03:45 PM',
    isOffDuty: false,
  },
  // Julien Moreau (Precision Styling Lead): 12:00 PM - 08:30 PM, Break: 04:00 PM - 04:30 PM
  'b0000000-0000-0000-0000-000000000003': {
    shiftStart: '12:00 PM',
    shiftEnd: '08:30 PM',
    hasBreak: true,
    breakStart: '04:00 PM',
    breakEnd: '04:30 PM',
    isOffDuty: false,
  },
  // Élodie Fontaine (Restorative Care Lead): 10:00 AM - 06:30 PM, Break: 01:00 PM - 01:45 PM
  'b0000000-0000-0000-0000-000000000004': {
    shiftStart: '10:00 AM',
    shiftEnd: '06:30 PM',
    hasBreak: true,
    breakStart: '01:00 PM',
    breakEnd: '01:45 PM',
    isOffDuty: false,
  },
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
    window.dispatchEvent(new Event('stylist-availability-updated'));
  } catch (e) {}
}

/**
 * Returns dynamic schedule for a given stylist and date
 */
export function getStylistSchedule(stylistId: string, dateStr: string): StylistScheduleRecord {
  const all = getAllSchedulesFromStorage();
  const key = `${stylistId}_${dateStr}`;
  if (all[key]) {
    return all[key];
  }

  const defaultShift = DEFAULT_DYNAMIC_SHIFTS[stylistId] || {
    shiftStart: '10:00 AM',
    shiftEnd: '08:00 PM',
    hasBreak: false,
    isOffDuty: false,
  };

  return {
    stylistId,
    date: dateStr,
    isOffDuty: defaultShift.isOffDuty || false,
    shiftStart: defaultShift.shiftStart || '10:00 AM',
    shiftEnd: defaultShift.shiftEnd || '08:00 PM',
    hasBreak: defaultShift.hasBreak || false,
    breakStart: defaultShift.breakStart || '02:00 PM',
    breakEnd: defaultShift.breakEnd || '03:00 PM',
  };
}

/**
 * Update dynamic shift parameters for a stylist
 */
export function updateStylistShift(
  stylistId: string,
  dateStr: string,
  updates: Partial<StylistScheduleRecord>
): StylistScheduleRecord {
  const current = getStylistSchedule(stylistId, dateStr);
  const updatedRecord: StylistScheduleRecord = {
    ...current,
    ...updates,
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
  return updateStylistShift(stylistId, dateStr, { isOffDuty });
}

/**
 * Checks if a stylist is available at any dynamic time string (e.g. "11:45 AM", "02:15 PM")
 */
export function isStylistAvailableAtTime(
  stylistId: string,
  dateStr: string,
  timeStr: string
): boolean {
  const stylist = INITIAL_STYLISTS.find((s) => s.id === stylistId);
  if (!stylist || !stylist.is_active) return false;

  const schedule = getStylistSchedule(stylistId, dateStr);
  if (schedule.isOffDuty) return false;

  const targetMinutes = timeToMinutes(timeStr);
  const startMinutes = timeToMinutes(schedule.shiftStart);
  const endMinutes = timeToMinutes(schedule.shiftEnd);

  // Check within working hours
  if (targetMinutes < startMinutes || targetMinutes > endMinutes) {
    return false;
  }

  // Check break time
  if (schedule.hasBreak && schedule.breakStart && schedule.breakEnd) {
    const breakStartM = timeToMinutes(schedule.breakStart);
    const breakEndM = timeToMinutes(schedule.breakEnd);
    if (targetMinutes >= breakStartM && targetMinutes < breakEndM) {
      return false;
    }
  }

  return true;
}

/**
 * Returns ONLY the stylists who are actually available at any dynamic time on the chosen date.
 */
export function getAvailableStylistsForSlot(dateStr: string, timeStr: string): Stylist[] {
  return INITIAL_STYLISTS.filter((stylist) =>
    isStylistAvailableAtTime(stylist.id, dateStr, timeStr)
  );
}

