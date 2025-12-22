import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid('ID ไม่ถูกต้อง'),
      order_index: z.number(),
    })
  ),
})

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validationResult = reorderSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'ข้อมูลไม่ถูกต้อง',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { items } = validationResult.data

    // Update each item's order_index
    const updatePromises = items.map((item) =>
      supabase
        .from('gallery_images')
        .update({ order_index: item.order_index })
        .eq('id', item.id)
    )

    const results = await Promise.all(updatePromises)

    // Check for errors
    const hasError = results.some((result) => result.error)
    if (hasError) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการเรียงลำดับรูปภาพ' },
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
