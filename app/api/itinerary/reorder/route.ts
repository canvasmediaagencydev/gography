import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const reorderSchema = z.object({
  type: z.enum(['days', 'activities', 'images']),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      order_index: z.number(),
    })
  ),
})

// PUT /api/itinerary/reorder - Reorder days, activities, or images
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const validationResult = reorderSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { type, items } = validationResult.data

    // Determine table name
    const tableMap = {
      days: 'trip_itinerary_days',
      activities: 'trip_itinerary_activities',
      images: 'trip_itinerary_day_images',
    }
    const tableName = tableMap[type]

    // Update each item's order_index
    const updatePromises = items.map((item) =>
      supabase
        .from(tableName)
        .update({ order_index: item.order_index })
        .eq('id', item.id)
    )

    const results = await Promise.all(updatePromises)

    // Check for errors
    const hasError = results.some((result) => result.error)
    if (hasError) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการเรียงลำดับ' },
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
