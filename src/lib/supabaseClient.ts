import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Appointment, Salon, Service, Stylist } from './types';
import { INITIAL_APPOINTMENTS, INITIAL_SALON, INITIAL_SERVICES, INITIAL_STYLISTS } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase') && 
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==============================================================================
// REALTIME SYNC ENGINE (SUPABASE REALTIME + BROADCAST CHANNEL + STORAGE EVENT)
// ==============================================================================
const STORAGE_KEY_APPOINTMENTS = 'styliq_appointments_v1';
const BROADCAST_CHANNEL_NAME = 'styliq_realtime_queue_sync';

type RealtimeCallback = (appointments: Appointment[]) => void;
const subscribers = new Set<RealtimeCallback>();
let broadcastChannel: BroadcastChannel | null = null;

if (typeof window !== 'undefined') {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'QUEUE_UPDATED') {
        const fresh = getLocalAppointments();
        subscribers.forEach((cb) => cb(fresh));
      }
    };
  } catch (err) {
    console.warn('BroadcastChannel not supported or restricted:', err);
  }

  // Cross-tab storage event listener fallback
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY_APPOINTMENTS) {
      const fresh = getLocalAppointments();
      subscribers.forEach((cb) => cb(fresh));
    }
  });
}

export function getLocalAppointments(): Appointment[] {
  if (typeof window === 'undefined') return INITIAL_APPOINTMENTS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
      return INITIAL_APPOINTMENTS;
    }
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_APPOINTMENTS;
  }
}

export function setLocalAppointments(appointments: Appointment[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(appointments));
    // Notify all local subscribers in current tab immediately
    subscribers.forEach((cb) => cb(appointments));
    // Broadcast to other open tabs/windows
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'QUEUE_UPDATED', timestamp: Date.now() });
    }
  } catch (e) {
    console.error('Error saving appointments to storage:', e);
  }
}

/**
 * Fetch current appointments
 */
export async function fetchAppointments(): Promise<Appointment[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, service:services(*), stylist:stylists(*)')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase fetch error, falling back to local state:', error);
        return getLocalAppointments();
      }
      return (data as unknown as Appointment[]) || [];
    } catch (e) {
      console.warn('Supabase query failed, falling back:', e);
      return getLocalAppointments();
    }
  }
  return getLocalAppointments();
}

/**
 * Subscribe to realtime queue changes
 */
export function subscribeToAppointments(callback: RealtimeCallback): () => void {
  subscribers.add(callback);
  // Immediate invocation with current data
  callback(getLocalAppointments());

  let supabaseChannel: ReturnType<SupabaseClient['channel']> | null = null;

  if (isSupabaseConfigured && supabase) {
    supabaseChannel = supabase
      .channel('public:appointments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        async () => {
          const fresh = await fetchAppointments();
          callback(fresh);
        }
      )
      .subscribe();
  }

  // Return unsubscribe cleanup function
  return () => {
    subscribers.delete(callback);
    if (supabaseChannel && supabase) {
      supabase.removeChannel(supabaseChannel);
    }
  };
}

/**
 * Update an appointment status or attributes dynamically
 */
export async function updateAppointment(
  id: string,
  updates: Partial<Appointment>
): Promise<Appointment | null> {
  const current = getLocalAppointments();
  const index = current.findIndex((a) => a.id === id);

  if (index === -1) return null;

  const now = new Date().toISOString();
  const updatedItem: Appointment = {
    ...current[index],
    ...updates,
    updated_at: now,
    ...(updates.status === 'in_chair' && !current[index].actual_start_time
      ? { actual_start_time: now }
      : {}),
    ...(updates.status === 'color_processing'
      ? { processing_start_time: now }
      : {}),
    ...(updates.status === 'completed'
      ? { completed_at: now }
      : {}),
  };

  current[index] = updatedItem;
  setLocalAppointments([...current]);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('appointments')
        .update({
          ...updates,
          updated_at: now,
        })
        .eq('id', id);
    } catch (err) {
      console.warn('Supabase update failed:', err);
    }
  }

  return updatedItem;
}

/**
 * Create a new appointment (from booking, QR scan, or walk-in)
 */
export async function createAppointment(
  data: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
): Promise<Appointment> {
  const current = getLocalAppointments();
  const nextNum = 100 + current.length + 1;
  const queue_number = data.queue_number || `SQ-${nextNum}`;

  const newAppointment: Appointment = {
    ...data,
    id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    queue_number,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Populate service & stylist references if available
  if (!newAppointment.service && newAppointment.service_id) {
    newAppointment.service = INITIAL_SERVICES.find((s) => s.id === newAppointment.service_id);
  }
  if (!newAppointment.stylist && newAppointment.stylist_id) {
    newAppointment.stylist = INITIAL_STYLISTS.find((st) => st.id === newAppointment.stylist_id);
  }

  // Append new appointment so FIFO (First In First Out) order is preserved
  const updatedList = [...current, newAppointment];
  setLocalAppointments(updatedList);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('appointments').insert([
        {
          salon_id: newAppointment.salon_id,
          service_id: newAppointment.service_id,
          stylist_id: newAppointment.stylist_id,
          customer_name: newAppointment.customer_name,
          customer_phone: newAppointment.customer_phone,
          customer_email: newAppointment.customer_email,
          queue_number: newAppointment.queue_number,
          status: newAppointment.status,
          is_walk_in: newAppointment.is_walk_in,
          deposit_paid: newAppointment.deposit_paid,
          deposit_amount_inr: newAppointment.deposit_amount_inr,
          razorpay_payment_id: newAppointment.razorpay_payment_id,
          estimated_start_time: newAppointment.estimated_start_time,
          notes: newAppointment.notes,
        },
      ]);
    } catch (err) {
      console.warn('Supabase insert failed:', err);
    }
  }

  return newAppointment;
}

/**
 * Reset mock data to default initial state
 */
export function resetQueueToDefault(): Appointment[] {
  setLocalAppointments(INITIAL_APPOINTMENTS);
  return INITIAL_APPOINTMENTS;
}
