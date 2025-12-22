import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for updating a gallery image
const updateGalleryImageSchema = z.object({
  title: z.string().min(3, 'ชื่อต้องมีอย่างน้อย 3 ตัวอักษร').max(255).optional(),
  description: z.string().optional().nullable(),
  alt_text: z.string().optional().nullable(),
  country_id: z.string().uuid('ประเทศไม่ถูกต้อง').optional().nullable(),
  trip_id: z.string().uuid('ทริปไม่ถูกต้อง').optional().nullable(),
  is_highlight: z.boolean().optional(),
  order_index: z.number().optional(),
  is_active: z.boolean().optional(),
})

// GET /api/gallery/[id] - Get single gallery image
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data: image, error } = await supabase
      .from('gallery_images')
      .select(
        `
        *,
        country:countries(*),
        trip:trips(*)
      `
      )
      .eq('id', id)
      .single()

    if (error || !image) {
      return NextResponse.json({ error: 'ไม่พบรูปภาพ' }, { status: 404 })
    }

    return NextResponse.json({ image })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// PUT /api/gallery/[id] - Update gallery image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    // Validate input
    const validationResult = updateGalleryImageSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'ข้อมูลไม่ถูกต้อง',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const updateData = validationResult.data

    // Update image
    const { data: image, error } = await supabase
      .from('gallery_images')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        country:countries(*),
        trip:trips(*)
      `
      )
      .single()

    if (error) {
      console.error('Error updating gallery image:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัปเดตรูปภาพ' },
        { status: 500 }
      )
    }

    return NextResponse.json({ image })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// DELETE /api/gallery/[id] - Delete gallery image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Get image to find storage path
    const { data: image } = await supabase
      .from('gallery_images')
      .select('storage_path')
      .eq('id', id)
      .single()

    if (!image) {
      return NextResponse.json({ error: 'ไม่พบรูปภาพ' }, { status: 404 })
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('gallery-images')
      .remove([image.storage_path])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue anyway to delete DB record
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id)

    if (dbError) {
      console.error('Database deletion error:', dbError)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบรูปภาพ' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
