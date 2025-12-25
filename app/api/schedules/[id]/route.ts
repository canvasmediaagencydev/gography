import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for updating a schedule
const updateScheduleSchema = z.object({
  departure_date: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
  return_date: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
  registration_deadline: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), {
    message: 'วันปิดรับสมัครไม่ถูกต้อง',
  }),
  total_seats: z.number().int().positive().optional(),
  available_seats: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
})

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/schedules/[id] - Get single schedule
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    const { data: schedule, error } = await supabase
      .from('trip_schedules')
      .select(
        `
        *,
        trip:trips(*)
      `
      )
      .eq('id', id)
      .single()

    if (error || !schedule) {
      return NextResponse.json(
        { error: 'ไม่พบรอบเดินทางนี้' },
        { status: 404 }
      )
    }

    return NextResponse.json({ schedule })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// PUT /api/schedules/[id] - Update schedule
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validationResult = updateScheduleSchema.safeParse(body)
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

    // Update schedule
    const { data: schedule, error } = await supabase
      .from('trip_schedules')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        trip:trips(*)
      `
      )
      .single()

    if (error || !schedule) {
      console.error('Error updating schedule:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัพเดตรอบเดินทาง' },
        { status: 500 }
      )
    }

    return NextResponse.json({ schedule })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// DELETE /api/schedules/[id] - Delete schedule
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    const { error } = await supabase
      .from('trip_schedules')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting schedule:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบรอบเดินทาง' },
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
