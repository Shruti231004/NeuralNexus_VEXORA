-- ==============================================================================
-- STYLIQ LUXURY SALON MANAGEMENT & REALTIME QUEUE ENGINE
-- PostgreSQL / Supabase Production Schema
-- ==============================================================================

-- 1. Create Salons Table
CREATE TABLE IF NOT EXISTS salons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255) DEFAULT 'Haute Coiffure & Esthétique',
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Mumbai',
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    chairs_count INT NOT NULL DEFAULT 6,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Stylists Table
CREATE TABLE IF NOT EXISTS stylists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL DEFAULT 'Senior Creative Stylist',
    specialties TEXT[] DEFAULT ARRAY['Precision Cut', 'Balayage', 'Hair Spa'],
    avatar_url TEXT,
    chair_number INT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.95,
    reviews_count INT DEFAULT 50,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Cut & Style', 'Color Services', 'Hair Treatments', 'Grooming'
    description TEXT,
    duration_minutes INT NOT NULL,
    processing_time_minutes INT DEFAULT 0, -- Overlap idle developer time (e.g. 35 mins for Balayage)
    price_inr NUMERIC(10, 2) NOT NULL,
    deposit_required_inr NUMERIC(10, 2) DEFAULT 99.00 NOT NULL,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Appointments / Queue Table
-- Statuses: 'waiting', 'in_chair', 'color_processing', 'completed', 'cancelled', 'delayed'
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
    stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    queue_number VARCHAR(20) NOT NULL, -- e.g. "SQ-101"
    status VARCHAR(50) DEFAULT 'waiting' NOT NULL,
    is_walk_in BOOLEAN DEFAULT false NOT NULL,
    deposit_paid BOOLEAN DEFAULT true NOT NULL,
    deposit_amount_inr NUMERIC(10, 2) DEFAULT 99.00 NOT NULL,
    razorpay_payment_id VARCHAR(255),
    estimated_start_time TIMESTAMP WITH TIME ZONE,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    processing_start_time TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    customer_rating INT, -- 1 to 5 stars
    customer_review TEXT,
    customer_tags TEXT[], -- e.g. ['Artistic Vision', 'Attentive & Gentle']
    rated_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Indexes for fast queue queries
CREATE INDEX IF NOT EXISTS idx_appointments_salon_status ON appointments (salon_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_stylist_status ON appointments (stylist_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments (created_at);

-- 6. Trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_appointments_updated_at ON appointments;
CREATE TRIGGER trigger_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Create Profiles & Role-Based Auth Tables
-- Role Enum: 'customer', 'staff', 'manager', 'admin'
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- Nullable or linked to Supabase auth.users
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'customer' NOT NULL, -- 'customer' or 'staff' or 'manager'
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Staff Specific Profile & Credentials Table
CREATE TABLE IF NOT EXISTS staff_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
    role_title VARCHAR(100) NOT NULL DEFAULT 'Master Stylist',
    pin_code VARCHAR(10) DEFAULT '1234' NOT NULL,
    access_level VARCHAR(50) DEFAULT 'stylist' NOT NULL, -- 'stylist', 'receptionist', 'manager'
    shift_status VARCHAR(50) DEFAULT 'on_duty' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Customer VIP & Preferences Profile Table
CREATE TABLE IF NOT EXISTS customer_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    phone VARCHAR(50) UNIQUE NOT NULL,
    vip_tier VARCHAR(50) DEFAULT 'Classic' NOT NULL, -- 'Classic', 'Gold VIP', 'Platinum VIP'
    loyalty_points INT DEFAULT 250,
    preferred_stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
    hair_type VARCHAR(100) DEFAULT 'Wavy / Fine Color-Treated',
    allergies_notes TEXT,
    total_bookings_count INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. ENABLE SUPABASE REALTIME FOR ALL QUEUE & AUTH EVENTS
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE staff_members;

-- 12. Seed Initial Salon, Stylists, Services, Staff and Customers
INSERT INTO salons (id, name, tagline, address, city, phone, email, chairs_count)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Styliq Haute Coiffure',
    'Parisian Luxury Editorial Hair & Beauty Lounge',
    '34 Rue de la Paix / Bandra West Luxury Arcade',
    'Mumbai',
    '+91 98200 12345',
    'concierge@styliqparis.com',
    6
) ON CONFLICT (id) DO NOTHING;

INSERT INTO stylists (id, salon_id, name, title, specialties, avatar_url, chair_number, is_active, rating, reviews_count)
VALUES 
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Antoine Dubois', 'Artistic Director', ARRAY['French Balayage', 'Editorial Cuts'], 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', 1, true, 4.98, 142),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Camille Laurent', 'Master Colorist', ARRAY['Blonde Alchemy', 'Gloss Treatments'], 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', 2, true, 4.96, 118),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Julien Moreau', 'Precision Styling Lead', ARRAY['Curtain Bangs', 'Men Haute Fade'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', 3, true, 4.94, 96),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Élodie Fontaine', 'Keratin & Spa Specialist', ARRAY['Caviar Hair Spa', 'Japanese Silk'], 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', 4, true, 4.97, 134)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, salon_id, name, category, description, duration_minutes, processing_time_minutes, price_inr, deposit_required_inr, is_popular)
VALUES 
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Signature French Cut & Blow-Dry', 'Cut & Style', 'Bespoke consultation, clarifying botanical wash, sculptural hair design and bouncy Parisian blow-dry.', 45, 0, 2400.00, 99.00, true),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Haute Couture Balayage & Glaze', 'Color Services', 'Hand-painted dimensional French highlights with pH-balancing luminous gloss toner. Includes 35-min developer setting window.', 90, 35, 6800.00, 99.00, true),
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Caviar & Peptide Molecular Restorative Spa', 'Hair Treatments', 'Intensive cellular repair infusion with micro-mist steam chamber and scalp acupressure.', 60, 20, 3500.00, 99.00, false),
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Executive Grooming & Beard Architecture', 'Grooming', 'Hot towel steam, razor-sharp contouring, organic beard oil soak & scalp stimulation massage.', 40, 0, 1800.00, 99.00, false),
    ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Luxe Gloss & Toning Express', 'Color Services', 'Instant mirror-shine glaze that revitalizes dull tones and locks in moisture in under 30 minutes.', 30, 15, 2100.00, 99.00, false)
ON CONFLICT (id) DO NOTHING;

-- Seed Staff Profiles
INSERT INTO profiles (id, email, role, full_name, phone, avatar_url)
VALUES 
    ('e0000000-0000-0000-0000-000000000001', 'antoine@styliqparis.com', 'staff', 'Antoine Dubois', '+91 98201 11111', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'),
    ('e0000000-0000-0000-0000-000000000002', 'camille@styliqparis.com', 'staff', 'Camille Laurent', '+91 98201 22222', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'),
    ('e0000000-0000-0000-0000-000000000003', 'manager@styliqparis.com', 'manager', 'Isabelle Marchand', '+91 98201 99999', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'),
    ('e0000000-0000-0000-0000-000000000004', 'vip.natasha@gmail.com', 'customer', 'Natasha Kapoor', '+91 98200 88888', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400')
ON CONFLICT (id) DO NOTHING;

INSERT INTO staff_members (profile_id, salon_id, stylist_id, role_title, pin_code, access_level, shift_status)
VALUES 
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Artistic Director', '1234', 'manager', 'on_duty'),
    ('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Master Colorist', '1234', 'stylist', 'on_duty')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customer_members (profile_id, phone, vip_tier, loyalty_points, hair_type, allergies_notes, total_bookings_count)
VALUES 
    ('e0000000-0000-0000-0000-000000000004', '+91 98200 88888', 'Platinum VIP', 640, 'Fine French Balayage', 'Sulfates-free shampoo preferred', 8)
ON CONFLICT (id) DO NOTHING;
