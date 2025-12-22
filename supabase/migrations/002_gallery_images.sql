-- Gography Admin System - Gallery Images Schema
-- Description: Creates gallery_images table for admin gallery management

-- ========================================
-- 1. Gallery Images Table
-- ========================================
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- File Storage Info
    storage_path TEXT NOT NULL,
    storage_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,

    -- Organization & Relationships
    country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,

    -- SEO & Descriptions
    title VARCHAR(255) NOT NULL,
    description TEXT,
    alt_text VARCHAR(255),

    -- Display Features
    is_highlight BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Audit
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 2. Indexes for Performance
-- ========================================

-- Active images index
CREATE INDEX idx_gallery_images_active ON gallery_images (is_active)
    WHERE is_active = true;

-- Country filter index
CREATE INDEX idx_gallery_images_country ON gallery_images (country_id, is_active);

-- Highlight images index (for carousel)
CREATE INDEX idx_gallery_images_highlight ON gallery_images (is_highlight, order_index)
    WHERE is_active = true AND is_highlight = true;

-- Trip relationship index
CREATE INDEX idx_gallery_images_trip ON gallery_images (trip_id)
    WHERE trip_id IS NOT NULL;

-- Sorting index
CREATE INDEX idx_gallery_images_order ON gallery_images (order_index, created_at);

-- ========================================
-- 3. Enable Row Level Security (RLS)
-- ========================================
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. RLS Policies - Public Read Access
-- ========================================

-- Public can read active gallery images
CREATE POLICY "Public can read active gallery images" ON gallery_images
  FOR SELECT USING (is_active = true);

-- ========================================
-- 5. RLS Policies - Admin Full Access
-- ========================================

-- Admins can manage all gallery images
CREATE POLICY "Admins can manage gallery images" ON gallery_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

-- ========================================
-- 6. Updated_at Trigger
-- ========================================

-- Apply updated_at trigger (function already exists from 001_initial_schema.sql)
CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Migration Complete!
-- ========================================
-- Next steps:
-- 1. Create Supabase Storage bucket 'gallery-images' via Dashboard
-- 2. Apply storage policies for public read, admin write
-- 3. Use the admin gallery management interface!
