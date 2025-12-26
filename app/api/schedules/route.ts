import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for creating a schedule
const createScheduleSchema = z.object({
  trip_id: z.string().uuid('ทริปไม่ถูกต้อง'),
  departure_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'วันที่เดินทางไม่ถูกต้อง',
  }),
  return_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'วันที่กลับไม่ถูกต้อง',
  }),
  registration_deadline: z.string().optional().transform((val) => val === '' ? null : val).refine((date) => !date || !isNaN(Date.parse(date)), {
    message: 'วันปิดรับสมัครไม่ถูกต้อง',
  }),
  total_seats: z.number().int().positive('จำนวนที่นั่งต้องมากกว่า 0'),
  available_seats: z.number().int().min(0, 'ที่นั่งว่างต้องไม่ติดลบ'),
  is_active: z.boolean().default(true),
})

// GET /api/schedules - List all schedules
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    const trip_id = searchParams.get('trip_id')
    const is_active = searchParams.get('is_active')

    // Build query
    let query = supabase
      .from('trip_schedules')
      .select(
        `
        *,
        trip:trips(*)
      `
      )
      .order('departure_date', { ascending: true })

    // Apply filters
    if (trip_id) {
      query = query.eq('trip_id', trip_id)
    }
    if (is_active !== null && is_active !== undefined && is_active !== '') {
      query = query.eq('is_active', is_active === 'true')
    }

    const { data: schedules, error } = await query

    if (error) {
      console.error('Error fetching schedules:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรอบเดินทาง' },
        { status: 500 }
      )
    }

    return NextResponse.json({ schedules })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// POST /api/schedules - Create new schedule
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validationResult = createScheduleSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'ข้อมูลไม่ถูกต้อง',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const scheduleData = validationResult.data

    // Additional validation: check dates
    const departureDate = new Date(scheduleData.departure_date)
    const returnDate = new Date(scheduleData.return_date)

    if (returnDate < departureDate) {
      return NextResponse.json(
        { error: 'วันที่กลับต้องไม่น้อยกว่าวันที่เดินทาง' },
        { status: 400 }
      )
    }

    // Only validate deadline if it's provided
    if (scheduleData.registration_deadline) {
      const deadlineDate = new Date(scheduleData.registration_deadline)
      if (deadlineDate > departureDate) {
        return NextResponse.json(
          { error: 'วันปิดรับสมัครต้องไม่เกินวันที่เดินทาง' },
          { status: 400 }
        )
      }
    }

    if (scheduleData.available_seats > scheduleData.total_seats) {
      return NextResponse.json(
        { error: 'ที่นั่งว่างต้องไม่เกินจำนวนที่นั่งทั้งหมด' },
        { status: 400 }
      )
    }

    // Create schedule
    const { data: schedule, error } = await supabase
      .from('trip_schedules')
      .insert(scheduleData)
      .select(
        `
        *,
        trip:trips(*)
      `
      )
      .single()

    if (error) {
      console.error('Error creating schedule:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้างรอบเดินทาง' },
        { status: 500 }
      )
    }

    return NextResponse.json({ schedule }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
