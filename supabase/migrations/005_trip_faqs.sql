-- Trip FAQs Schema
-- Description: Creates tables for trip-specific FAQs with optional multiple images per answer

-- ========================================
-- 1. Trip FAQs Table
-- ========================================
CREATE TABLE IF NOT EXISTS trip_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship to trip
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,

    -- FAQ content
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,

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
-- 2. Trip FAQ Images Table
-- ========================================
CREATE TABLE IF NOT EXISTS trip_faq_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship to FAQ
    faq_id UUID NOT NULL REFERENCES trip_faqs(id) ON DELETE CASCADE,

    -- File Storage Info (stored in 'gallery-images' bucket)
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
-- 3. Indexes
-- ========================================
-- FAQ indexes for efficient querying
CREATE INDEX idx_trip_faqs_trip ON trip_faqs (trip_id, order_index)
    WHERE is_active = true;

CREATE INDEX idx_trip_faqs_active ON trip_faqs (is_active);

-- FAQ images indexes
CREATE INDEX idx_trip_faq_images_faq ON trip_faq_images (faq_id, order_index)
    WHERE is_active = true;

CREATE INDEX idx_trip_faq_images_active ON trip_faq_images (is_active);

-- ========================================
-- 4. Row Level Security (RLS)
-- ========================================
-- Enable RLS
ALTER TABLE trip_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_faq_images ENABLE ROW LEVEL SECURITY;

-- Public can read active FAQs for active trips
CREATE POLICY "Public can read active faqs" ON trip_faqs
  FOR SELECT USING (
    is_active = true AND
    EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_faqs.trip_id AND trips.is_active = true)
  );

-- Public can read active FAQ images
CREATE POLICY "Public can read active faq images" ON trip_faq_images
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM trip_faqs
      WHERE trip_faqs.id = trip_faq_images.faq_id
      AND trip_faqs.is_active = true
    )
  );

-- Admins can manage all FAQs
CREATE POLICY "Admins can manage faqs" ON trip_faqs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

-- Admins can manage all FAQ images
CREATE POLICY "Admins can manage faq images" ON trip_faq_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

-- ========================================
-- 5. Updated_at Triggers
-- ========================================
CREATE TRIGGER update_trip_faqs_updated_at BEFORE UPDATE ON trip_faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_faq_images_updated_at BEFORE UPDATE ON trip_faq_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
