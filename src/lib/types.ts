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
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Customer Rating & Review
  customer_rating?: number; // 1 to 5 stars
  customer_review?: string;
  customer_tags?: string[];
  rated_at?: string;

  // Joined relational data
  service?: Service;
  stylist?: Stylist;
}

export interface OverlapAlert {
  stylistId: string;
  stylistName: string;
  chairNumber: number;
  processingAppointmentId: string;
  processingCustomerName: string;
  windowMinutes: number;
  overlapCandidateAppointmentId?: string;
  overlapCandidateCustomerName?: string;
  overlapCandidateService?: string;
}

// -------------------------------------------------------------
// AUTH & MULTI-TENANT ROLES
// -------------------------------------------------------------
export type UserRole = 'customer' | 'staff' | 'manager' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  auth_provider?: 'google' | 'phone' | 'pin' | 'email';
  created_at: string;
  
  // Specific profile links
  staff_profile?: StaffProfile;
  customer_profile?: CustomerProfile;
}

export interface StaffProfile {
  id: string;
  profile_id: string;
  salon_id: string;
  stylist_id?: string;
  role_title: string; // e.g. 'Artistic Director', 'Master Colorist'
  pin_code: string;
  access_level: 'stylist' | 'receptionist' | 'manager' | 'owner';
  shift_status: 'on_duty' | 'break' | 'off_duty';
}

export interface CustomerProfile {
  id: string;
  profile_id: string;
  phone: string;
  vip_tier: 'Classic' | 'Gold VIP' | 'Platinum VIP';
  loyalty_points: number;
  preferred_stylist_id?: string;
  hair_type: string;
  allergies_notes?: string;
  total_bookings_count: number;
}
