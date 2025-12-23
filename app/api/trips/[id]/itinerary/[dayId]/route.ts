import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateItineraryDaySchema = z.object({
  day_number: z.number().int().min(0).optional(),
  day_title: z.string().min(3).max(255).optional(),
  day_description: z.string().optional().nullable(),
  order_index: z.number().optional(),
  is_active: z.boolean().optional(),
})

type RouteContext = {
  params: Promise<{ id: string; dayId: string }>
}

// GET /api/trips/[id]/itinerary/[dayId] - Get single itinerary day
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { dayId } = await context.params
    const supabase = await createClient()

    const { data: day, error } = await supabase
      .from('trip_itinerary_days')
      .select(`
        *,
        activities:trip_itinerary_activities(*),
        images:trip_itinerary_day_images(*)
      `)
      .eq('id', dayId)
      .single()

    if (error || !day) {
      return NextResponse.json(
        { error: 'ไม่พบวันเดินทางนี้' },
        { status: 404 }
      )
    }

    return NextResponse.json({ day })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// PUT /api/trips/[id]/itinerary/[dayId] - Update itinerary day
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { dayId } = await context.params
    const supabase = await createClient()
    const body = await request.json()

    const validationResult = updateItineraryDaySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { data: day, error } = await supabase
      .from('trip_itinerary_days')
      .update(validationResult.data)
      .eq('id', dayId)
      .select()
      .single()

    if (error || !day) {
      console.error('Error updating itinerary day:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัพเดตวันเดินทาง' },
        { status: 500 }
      )
    }

    return NextResponse.json({ day })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// DELETE /api/trips/[id]/itinerary/[dayId] - Delete itinerary day
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { dayId } = await context.params
    const supabase = await createClient()

    const { error } = await supabase
      .from('trip_itinerary_days')
      .delete()
      .eq('id', dayId)

    if (error) {
      console.error('Error deleting itinerary day:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบวันเดินทาง' },
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
