import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
  params: Promise<{ dayId: string }>
}

// POST /api/itinerary/[dayId]/images/upload - Upload day image
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { dayId } = await context.params
    const supabase = await createClient()
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์' }, { status: 400 })
    }

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'รองรับเฉพาะไฟล์ JPG, PNG, WebP เท่านั้น' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ขนาดไฟล์ต้องไม่เกิน 5MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    const ext = file.name.split('.').pop()
    const storagePath = `itinerary-images/${dayId}/${timestamp}_${randomId}.${ext}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(storagePath, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(storagePath)

    // Get additional metadata from form
    const caption = formData.get('caption') as string
    const alt_text = formData.get('alt_text') as string
    const order_index = parseInt(formData.get('order_index') as string || '0')

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    // Create database record
    const { data: image, error: dbError } = await supabase
      .from('trip_itinerary_day_images')
      .insert({
        itinerary_day_id: dayId,
        storage_path: storagePath,
        storage_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        caption: caption || null,
        alt_text: alt_text || null,
        order_index,
        created_by: user?.id,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Try to delete uploaded file
      await supabase.storage.from('gallery-images').remove([storagePath])
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
        { status: 500 }
      )
    }

    return NextResponse.json({ image }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
