export type AppointmentStatus = 
  | 'waiting'           // Customer in lounge waiting for turn
  | 'in_chair'          // Actively being serviced in the styling chair
  | 'color_processing'  // Color/treatment developer working; stylist chair is free for overlap quick cut
  | 'completed'         // Service finished, bill settled
  | 'delayed'           // Running slightly behind
  | 'cancelled';

export interface Salon {
  id: string;
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  chairs_count: number;
}

export interface Stylist {
  id: string;
  salon_id: string;
  name: string;
  title: string;
  specialties: string[];
  avatar_url: string;
  chair_number: number;
  is_active: boolean;
  rating?: number;        // e.g. 4.98
  reviews_count?: number; // e.g. 184
}

export interface Service {
  id: string;
  salon_id: string;
  name: string;
  category: 'Cut & Style' | 'Color Services' | 'Hair Treatments' | 'Grooming' | 'Spa & Scalp Rituals' | 'Deluxe & Bridal Packages' | string;
  description: string;
  duration_minutes: number;
  processing_time_minutes: number; // Developer idle overlap window
  price_inr: number;
  deposit_required_inr: number;
  is_popular?: boolean;
  image_url?: string;
  tag?: string;
}

export interface Appointment {
  id: string;
  salon_id: string;
  service_id: string;
  stylist_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  queue_number: string; // e.g. "SQ-101"
  status: AppointmentStatus;
  is_walk_in: boolean;
  deposit_paid: boolean;
  deposit_amount_inr: number;
  razorpay_payment_id?: string;
  estimated_start_time: string; // ISO string
  actual_start_time?: string;
  processing_start_time?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  service?: Service;
  stylist?: Stylist;
}

export interface QueuePrediction {
  appointment_id: string;
  predicted_start_time: string;
  confidence_score: number;
  delay_minutes: number;
  overlap_available: boolean;
  overlap_stylist_id?: string;
}

export interface SalonSettings {
  id: string;
  salon_id: string;
  avg_cut_duration: number;
  avg_color_duration: number;
  avg_treatment_duration: number;
  deposit_amount_inr: number;
  overlap_optimization_enabled: boolean;
  allow_walk_ins: boolean;
  auto_notify_customer_lead_minutes: number;
  daily_opening_time: string; // e.g. "10:00"
  daily_closing_time: string; // e.g. "21:00"
}

export interface OverlapOpportunity {
  color_appointment: Appointment;
  available_window_minutes: number;
  eligible_waiting_appointments: Appointment[];
}
