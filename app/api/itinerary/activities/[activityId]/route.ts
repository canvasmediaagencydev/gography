import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateActivitySchema = z.object({
  activity_time: z.string().optional().nullable(),
  activity_description: z.string().min(1).optional(),
  order_index: z.number().optional(),
  is_active: z.boolean().optional(),
})

type RouteContext = {
  params: Promise<{ activityId: string }>
}

// PUT /api/itinerary/activities/[activityId] - Update activity
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { activityId } = await context.params
    const supabase = await createClient()
    const body = await request.json()

    const validationResult = updateActivitySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { data: activity, error } = await supabase
      .from('trip_itinerary_activities')
      .update(validationResult.data)
      .eq('id', activityId)
      .select()
      .single()

    if (error || !activity) {
      console.error('Error updating activity:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัพเดตกิจกรรม' },
        { status: 500 }
      )
    }

    return NextResponse.json({ activity })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// DELETE /api/itinerary/activities/[activityId] - Delete activity
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { activityId } = await context.params
    const supabase = await createClient()

    const { error } = await supabase
      .from('trip_itinerary_activities')
      .delete()
      .eq('id', activityId)

    if (error) {
      console.error('Error deleting activity:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบกิจกรรม' },
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
