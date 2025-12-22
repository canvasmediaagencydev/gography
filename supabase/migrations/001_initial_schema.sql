-- Gography Admin System - Initial Database Schema
-- Description: Creates tables for trip management system

-- ========================================
-- 1. Countries Table
-- ========================================
CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(3) UNIQUE NOT NULL,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    flag_emoji VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 2. Trips Table
-- ========================================
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    country_id UUID REFERENCES countries(id),
    price_per_person DECIMAL(10,2) NOT NULL CHECK (price_per_person > 0),
    cover_image_url TEXT,
    file_link TEXT,
    trip_type VARCHAR(20) DEFAULT 'group' CHECK (trip_type IN ('group', 'private')),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 3. Trip Schedules Table
-- ========================================
CREATE TABLE IF NOT EXISTS trip_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    registration_deadline DATE NOT NULL,
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    available_seats INTEGER NOT NULL CHECK (available_seats >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_dates CHECK (return_date >= departure_date),
    CONSTRAINT valid_deadline CHECK (registration_deadline <= departure_date),
    CONSTRAINT valid_seats CHECK (available_seats <= total_seats)
);

-- ========================================
-- 4. Admin Users Table
-- ========================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'admin' CHECK (role = 'admin'),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 5. Enable Row Level Security (RLS)
-- ========================================
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 6. RLS Policies - Public Read Access
-- ========================================

-- Public can read active trips
CREATE POLICY "Public can read active trips" ON trips
  FOR SELECT USING (is_active = true);

-- Public can read active schedules
CREATE POLICY "Public can read active schedules" ON trip_schedules
  FOR SELECT USING (is_active = true);

-- Public can read active countries
CREATE POLICY "Public can read active countries" ON countries
  FOR SELECT USING (is_active = true);

-- ========================================
-- 7. RLS Policies - Admin Full Access
-- ========================================

-- Admins can manage all trips
CREATE POLICY "Admins can manage trips" ON trips
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

-- Admins can manage all schedules
CREATE POLICY "Admins can manage schedules" ON trip_schedules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

-- Admins can manage all countries
CREATE POLICY "Admins can manage countries" ON countries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

-- Admins can read all admin_users
CREATE POLICY "Admins can read admin_users" ON admin_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

-- ========================================
-- 8. Indexes for Performance
-- ========================================

-- Trips indexes
CREATE INDEX idx_trips_active_country ON trips (is_active, country_id);
CREATE INDEX idx_trips_created_at ON trips (created_at DESC);
CREATE INDEX idx_trips_trip_type ON trips (trip_type) WHERE is_active = true;

-- Schedules indexes
CREATE INDEX idx_schedules_active_upcoming ON trip_schedules (trip_id, departure_date)
    WHERE is_active = true;
CREATE INDEX idx_schedules_trip_id ON trip_schedules (trip_id);
CREATE INDEX idx_schedules_departure_date ON trip_schedules (departure_date)
    WHERE is_active = true AND departure_date >= CURRENT_DATE;

-- Countries indexes
CREATE INDEX idx_countries_active ON countries (is_active) WHERE is_active = true;
CREATE INDEX idx_countries_code ON countries (code);

-- ========================================
-- 9. Initial Country Data
-- ========================================
INSERT INTO countries (code, name_th, name_en, flag_emoji) VALUES
  ('NO', 'นอร์เวย์', 'Norway', '🇳🇴'),
  ('RU', 'รัสเซีย', 'Russia', '🇷🇺'),
  ('IS', 'ไอซ์แลนด์', 'Iceland', '🇮🇸'),
  ('FI', 'ฟินแลนด์', 'Finland', '🇫🇮'),
  ('AR', 'อาร์เจนตินา', 'Argentina', '🇦🇷'),
  ('DK', 'เดนมาร์ก', 'Denmark', '🇩🇰')
ON CONFLICT (code) DO NOTHING;

-- ========================================
-- 10. Updated_at Trigger Function
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_schedules_updated_at BEFORE UPDATE ON trip_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Migration Complete!
-- ========================================
-- Next steps:
-- 1. Create an admin user via Supabase Dashboard Authentication
-- 2. Insert the user into admin_users table with their auth.users.id
-- 3. Start using the admin panel!
