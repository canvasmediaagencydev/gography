import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
  params: Promise<{ tripId: string }>
}

// GET /api/schedules/trip/[tripId] - Get all schedules for a specific trip
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { tripId } = await context.params
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    const is_active = searchParams.get('is_active')

    // Build query
    let query = supabase
      .from('trip_schedules')
      .select('*')
      .eq('trip_id', tripId)
      .order('departure_date', { ascending: true })

    // Apply filter
    if (is_active !== null && is_active !== undefined && is_active !== '') {
      query = query.eq('is_active', is_active === 'true')
    }

    const { data: schedules, error } = await query

    if (error) {
      console.error('Error fetching schedules for trip:', error)
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
