import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for creating an itinerary day
const createItineraryDaySchema = z.object({
  day_number: z.number().int().min(0),
  day_title: z.string().min(3, 'ชื่อวันต้องมีอย่างน้อย 3 ตัวอักษร').max(255),
  day_description: z.string().optional().nullable(),
  order_index: z.number().default(0),
  is_active: z.boolean().default(true),
})

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/trips/[id]/itinerary - Get all itinerary days for a trip
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: tripId } = await context.params
    const supabase = await createClient()

    const { data: days, error } = await supabase
      .from('trip_itinerary_days')
      .select(`
        *,
        activities:trip_itinerary_activities(
          *
        ),
        images:trip_itinerary_day_images(
          *
        )
      `)
      .eq('trip_id', tripId)
      .order('order_index', { ascending: true })
      .order('day_number', { ascending: true })

    if (error) {
      console.error('Error fetching itinerary days:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายการกำหนดการเดินทาง' },
        { status: 500 }
      )
    }

    // Sort activities and images within each day
    const sortedDays = days?.map(day => ({
      ...day,
      activities: day.activities?.sort((a: any, b: any) => {
        if (a.order_index !== b.order_index) {
          return a.order_index - b.order_index
        }
        // Secondary sort by time if order_index is same
        if (a.activity_time && b.activity_time) {
          return a.activity_time.localeCompare(b.activity_time)
        }
        return 0
      }),
      images: day.images?.sort((a: any, b: any) => a.order_index - b.order_index),
    }))

    return NextResponse.json({ days: sortedDays || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// POST /api/trips/[id]/itinerary - Create new itinerary day
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: tripId } = await context.params
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validationResult = createItineraryDaySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'ข้อมูลไม่ถูกต้อง',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const dayData = validationResult.data

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    // Create itinerary day
    const { data: day, error } = await supabase
      .from('trip_itinerary_days')
      .insert({
        ...dayData,
        trip_id: tripId,
        created_by: user?.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating itinerary day:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้างวันเดินทาง' },
        { status: 500 }
      )
    }

    return NextResponse.json({ day }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
