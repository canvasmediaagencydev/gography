import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateImageSchema = z.object({
  caption: z.string().optional().nullable(),
  alt_text: z.string().optional().nullable(),
  order_index: z.number().optional(),
  is_active: z.boolean().optional(),
})

type RouteContext = {
  params: Promise<{ imageId: string }>
}

// PUT /api/faqs/images/[imageId] - Update image metadata
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { imageId } = await context.params
    const supabase = await createClient()
    const body = await request.json()

    const validationResult = updateImageSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { data: image, error } = await supabase
      .from('trip_faq_images')
      .update(validationResult.data)
      .eq('id', imageId)
      .select()
      .single()

    if (error || !image) {
      console.error('Error updating image:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัพเดตรูปภาพ' },
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

// DELETE /api/faqs/images/[imageId] - Delete image
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { imageId } = await context.params
    const supabase = await createClient()

    // Get image info to delete from storage
    const { data: image } = await supabase
      .from('trip_faq_images')
      .select('storage_path')
      .eq('id', imageId)
      .single()

    if (image?.storage_path) {
      // Delete from storage
      await supabase.storage.from('gallery-images').remove([image.storage_path])
    }

    // Delete from database
    const { error } = await supabase
      .from('trip_faq_images')
      .delete()
      .eq('id', imageId)

    if (error) {
      console.error('Error deleting image:', error)
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
