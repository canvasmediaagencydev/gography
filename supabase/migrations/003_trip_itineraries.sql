-- Trip Itineraries Schema
-- Description: Creates tables for daily trip itineraries with timed activities and day-specific images

-- ========================================
-- 1. Trip Itinerary Days Table
-- ========================================
CREATE TABLE IF NOT EXISTS trip_itinerary_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship to trip (not schedule - trip-level itinerary)
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,

    -- Day information
    day_number INTEGER NOT NULL CHECK (day_number >= 0),
    day_title VARCHAR(255) NOT NULL,
    day_description TEXT,

    -- Ordering
    order_index INTEGER DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Audit
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure unique day numbers per trip
    CONSTRAINT unique_trip_day UNIQUE (trip_id, day_number)
);

-- ========================================
-- 2. Trip Itinerary Activities Table
-- ========================================
CREATE TABLE IF NOT EXISTS trip_itinerary_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship to itinerary day
    itinerary_day_id UUID NOT NULL REFERENCES trip_itinerary_days(id) ON DELETE CASCADE,

    -- Activity timing (optional - some activities may not have specific time)
    activity_time TIME,

    -- Activity details
    activity_description TEXT NOT NULL,

    -- Ordering within the day
    order_index INTEGER DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Audit
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 3. Trip Itinerary Day Images Table
-- ========================================
CREATE TABLE IF NOT EXISTS trip_itinerary_day_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship to itinerary day
    itinerary_day_id UUID NOT NULL REFERENCES trip_itinerary_days(id) ON DELETE CASCADE,

    -- File Storage Info (similar to gallery_images)
    storage_path TEXT NOT NULL,
    storage_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,

    -- Image metadata
    caption VARCHAR(255),
    alt_text VARCHAR(255),

    -- Ordering
    order_index INTEGER DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Audit
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 4. Indexes for Performance
-- ========================================

-- Itinerary days indexes
CREATE INDEX idx_itinerary_days_trip ON trip_itinerary_days (trip_id, order_index)
    WHERE is_active = true;
CREATE INDEX idx_itinerary_days_day_number ON trip_itinerary_days (trip_id, day_number)
    WHERE is_active = true;

-- Activities indexes
CREATE INDEX idx_itinerary_activities_day ON trip_itinerary_activities (itinerary_day_id, order_index)
    WHERE is_active = true;
CREATE INDEX idx_itinerary_activities_time ON trip_itinerary_activities (itinerary_day_id, activity_time)
    WHERE is_active = true;

-- Day images indexes
CREATE INDEX idx_itinerary_day_images_day ON trip_itinerary_day_images (itinerary_day_id, order_index)
    WHERE is_active = true;

-- ========================================
-- 5. Enable Row Level Security (RLS)
-- ========================================
ALTER TABLE trip_itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_itinerary_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_itinerary_day_images ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 6. RLS Policies - Public Read Access
-- ========================================

-- Public can read active itinerary days (for trips that are active)
CREATE POLICY "Public can read active itinerary days" ON trip_itinerary_days
  FOR SELECT USING (
    is_active = true AND
    EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_itinerary_days.trip_id AND trips.is_active = true)
  );

-- Public can read active activities
CREATE POLICY "Public can read active activities" ON trip_itinerary_activities
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM trip_itinerary_days
      WHERE trip_itinerary_days.id = trip_itinerary_activities.itinerary_day_id
      AND trip_itinerary_days.is_active = true
    )
  );

-- Public can read active day images
CREATE POLICY "Public can read active day images" ON trip_itinerary_day_images
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM trip_itinerary_days
      WHERE trip_itinerary_days.id = trip_itinerary_day_images.itinerary_day_id
      AND trip_itinerary_days.is_active = true
    )
  );

-- ========================================
-- 7. RLS Policies - Admin Full Access
-- ========================================

-- Admins can manage all itinerary days
CREATE POLICY "Admins can manage itinerary days" ON trip_itinerary_days
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

-- Admins can manage all activities
CREATE POLICY "Admins can manage activities" ON trip_itinerary_activities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

-- Admins can manage all day images
CREATE POLICY "Admins can manage day images" ON trip_itinerary_day_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

-- ========================================
-- 8. Updated_at Triggers
-- ========================================

CREATE TRIGGER update_trip_itinerary_days_updated_at BEFORE UPDATE ON trip_itinerary_days
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_itinerary_activities_updated_at BEFORE UPDATE ON trip_itinerary_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_itinerary_day_images_updated_at BEFORE UPDATE ON trip_itinerary_day_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Migration Complete!
-- ========================================
