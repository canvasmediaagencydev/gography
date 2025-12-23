import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createActivitySchema = z.object({
  activity_time: z.string().optional().nullable(),
  activity_description: z.string().min(1, 'กรุณากรอกรายละเอียดกิจกรรม'),
  order_index: z.number().default(0),
  is_active: z.boolean().default(true),
})

type RouteContext = {
  params: Promise<{ dayId: string }>
}

// POST /api/itinerary/[dayId]/activities - Create activity
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { dayId } = await context.params
    const supabase = await createClient()
    const body = await request.json()

    const validationResult = createActivitySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { data: { user } } = await supabase.auth.getUser()

    const { data: activity, error } = await supabase
      .from('trip_itinerary_activities')
      .insert({
        ...validationResult.data,
        itinerary_day_id: dayId,
        created_by: user?.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating activity:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้างกิจกรรม' },
        { status: 500 }
      )
    }

    return NextResponse.json({ activity }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
