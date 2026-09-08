import { createClient } from '@supabase/supabase-js';

/**
 * ==============================================================================
 * VEXORA SALON — SUPABASE RELATIONAL DATABASE & REALTIME PUBSUB ENGINE
 * ==============================================================================
 * 
 * To set up Supabase in Production, run the following SQL schema in your Supabase SQL Editor:
 * 
 * CREATE TABLE IF NOT EXISTS public.bookings (
 *     id TEXT PRIMARY KEY,
 *     customer_name TEXT NOT NULL,
 *     customer_phone TEXT NOT NULL,
 *     customer_gender TEXT DEFAULT 'all',
 *     service_id TEXT NOT NULL,
 *     stylist_id TEXT NOT NULL,
 *     slot TEXT NOT NULL,
 *     status TEXT NOT NULL DEFAULT 'booked',
 *     queue_order INT DEFAULT 0,
 *     checked_in BOOLEAN DEFAULT FALSE,
 *     amount NUMERIC(10, 2) DEFAULT 0.00,
 *     payment_status TEXT DEFAULT 'pending',
 *     payment_method TEXT DEFAULT 'none',
 *     refund_status TEXT DEFAULT 'none',
 *     refund_amount NUMERIC(10, 2) DEFAULT 0.00,
 *     feedback JSONB DEFAULT NULL,
 *     created_at TIMESTAMPTZ DEFAULT NOW(),
 *     updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://demo-vexora-salon.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-key';

export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('demo-vexora')
  );
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetch all bookings from Supabase PostgreSQL DB
 */
export async function fetchBookingsFromSupabase() {
  if (!isSupabaseConfigured()) {
    console.warn('[Vexora Supabase] Operating in local-first mode (VITE_SUPABASE_URL env variable not provided)');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[Vexora Supabase] Error fetching bookings:', error);
      return null;
    }

    // Map DB snake_case columns back to application camelCase properties
    return data.map(b => ({
      id: b.id,
      customerName: b.customer_name,
      customerPhone: b.customer_phone,
      customerGender: b.customer_gender,
      serviceId: b.service_id,
      stylistId: b.stylist_id,
      slot: b.slot,
      status: b.status,
      queueOrder: b.queue_order,
      checkedIn: b.checked_in,
      amount: b.amount,
      paymentStatus: b.payment_status,
      paymentMethod: b.payment_method,
      refundStatus: b.refund_status,
      refundAmount: b.refund_amount,
      feedback: b.feedback
    }));
  } catch (err) {
    console.error('[Vexora Supabase] Exception fetching bookings:', err);
    return null;
  }
}

/**
 * Upsert (Insert or Update) a booking record into Supabase PostgreSQL DB
 */
export async function upsertBookingToSupabase(booking) {
  if (!isSupabaseConfigured()) return;

  try {
    const row = {
      id: booking.id,
      customer_name: booking.customerName,
      customer_phone: booking.customerPhone,
      customer_gender: booking.customerGender || 'all',
      service_id: booking.serviceId,
      stylist_id: booking.stylistId,
      slot: booking.slot,
      status: booking.status,
      queue_order: booking.queueOrder || 0,
      checked_in: !!booking.checkedIn,
      amount: booking.amount || 0,
      payment_status: booking.paymentStatus || 'pending',
      payment_method: booking.paymentMethod || 'none',
      refund_status: booking.refundStatus || 'none',
      refund_amount: booking.refundAmount || 0,
      feedback: booking.feedback || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('bookings')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('[Vexora Supabase] Error upserting booking:', error);
    }
  } catch (err) {
    console.error('[Vexora Supabase] Exception during upsert:', err);
  }
}

/**
 * Subscribe to real-time PostgreSQL database changes via WebSockets
 */
export function subscribeToSupabaseRealtime(onPayload) {
  if (!isSupabaseConfigured()) return () => {};

  const subscription = supabase
    .channel('public:bookings')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookings' },
      (payload) => {
        console.log('[Vexora Supabase Realtime Event]:', payload);
        if (onPayload) onPayload(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}
