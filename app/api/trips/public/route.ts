import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  formatThaiDateRange,
  formatDurationThai,
  formatSlotsDisplay,
  calculateDuration,
  formatPrice,
} from '@/lib/migration-helpers'
import type { PublicTripDisplay } from '@/types/database.types'

type TripTypeValue = 'group' | 'private'

interface ScheduleSummary {
  id: string
  is_active: boolean
  departure_date: string
  return_date: string
  available_seats?: number | null
  total_seats?: number | null
}

interface CountrySummary {
  name_th?: string | null
  flag_emoji?: string | null
}

interface TripRecord {
  id: string
  title: string
  cover_image_url?: string | null
  trip_type: TripTypeValue
  price_per_person: number | null
  country?: CountrySummary | null
  trip_schedules?: ScheduleSummary[]
}

// GET /api/trips/public - Public endpoint for displaying trips on the website
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    // Filters
    const country = searchParams.get('country')
    const trip_type = searchParams.get('trip_type')
    const month = searchParams.get('month') // Format: YYYY-MM

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const offset = (page - 1) * pageSize

    // Build base query for counting and fetching
    const buildQuery = () => {
      let query = supabase
        .from('trips')
        .select(
          `
          *,
          country:countries!inner(*),
          trip_schedules!inner(*)
        `,
          { count: 'exact' }
        )
        .eq('is_active', true)
        .eq('trip_schedules.is_active', true)
        .gte('trip_schedules.departure_date', new Date().toISOString().split('T')[0])

      // Apply filters
      if (country && country !== 'ทั่วหมด') {
        query = query.eq('country.name_th', country)
      }
      if (trip_type && trip_type !== 'ประเภททริปทั้งหมด') {
        const typeValue = trip_type === 'กรุ๊ปทัวร์' ? 'group' : 'private'
        query = query.eq('trip_type', typeValue)
      }
      // Month filter - filter by departure date within the specified month
      if (month && month !== 'ทุกเดือน') {
        const [year, monthNum] = month.split('-')
        const startDate = `${year}-${monthNum}-01`
        const endDate = new Date(parseInt(year), parseInt(monthNum), 0).toISOString().split('T')[0]
        query = query.gte('trip_schedules.departure_date', startDate)
          .lte('trip_schedules.departure_date', endDate)
      }

      return query
    }

    // First, get total count of unique trips (without pagination)
    let countQuery = supabase
      .from('trips')
      .select('id', { count: 'exact', head: false })
      .eq('is_active', true)

    // Apply same filters to count query
    if (country && country !== 'ทั่วหมด') {
      // Need to join with countries for filtering
      countQuery = supabase
        .from('trips')
        .select('id, country:countries!inner(name_th)', { count: 'exact', head: false })
        .eq('is_active', true)
        .eq('country.name_th', country)
    }

    const { count: totalCount } = await countQuery

    // Execute main query with pagination
    const { data: trips, error } = await buildQuery()
      .order('departure_date', {
        foreignTable: 'trip_schedules',
        ascending: true,
      })
      .range(offset, offset + pageSize - 1)
      .returns<TripRecord[]>()

    if (error) {
      console.error('Error fetching public trips:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลทริป' },
        { status: 500 }
      )
    }

    // Transform data for display
    const displayTrips: PublicTripDisplay[] = []
    const tripMap = new Map<string, TripRecord & { schedules: ScheduleSummary[] }>()

    trips?.forEach((trip) => {
      if (!tripMap.has(trip.id)) {
        tripMap.set(trip.id, {
          ...trip,
          trip_schedules: trip.trip_schedules || [],
          schedules: [],
        })
      }
      const tripData = tripMap.get(trip.id)
      if (!tripData) return

      trip.trip_schedules?.forEach((schedule) => {
        tripData.schedules.push(schedule)
      })
    })

    // Create display format
    tripMap.forEach((trip) => {
      if (trip.schedules.length === 0) return

      // Sort schedules by departure date
      const sortedSchedules = trip.schedules.sort(
        (a, b) =>
          new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime()
      )

      // Get the next upcoming schedule for main display
      const nextSchedule = sortedSchedules[0]

      const duration = calculateDuration(nextSchedule.departure_date, nextSchedule.return_date)
      const dates = formatThaiDateRange(nextSchedule.departure_date, nextSchedule.return_date)
      const durationText = formatDurationThai(duration.days, duration.nights)
      const slots = formatSlotsDisplay(nextSchedule.available_seats, nextSchedule.total_seats)

      // Format all schedules for selection
      const schedulesDisplay = sortedSchedules.map((schedule) => {
        const schedDuration = calculateDuration(schedule.departure_date, schedule.return_date)
        return {
          id: schedule.id,
          departure_date: schedule.departure_date,
          return_date: schedule.return_date,
          dates: formatThaiDateRange(schedule.departure_date, schedule.return_date),
          duration: formatDurationThai(schedDuration.days, schedDuration.nights),
          available_seats: schedule.available_seats || 0,
          total_seats: schedule.total_seats || 0,
          slots: formatSlotsDisplay(schedule.available_seats, schedule.total_seats),
          is_active: schedule.is_active,
        }
      })

      // Add prefix for private trips
      const title = trip.trip_type === 'private' ? `[ Private ] ${trip.title}` : trip.title

      displayTrips.push({
        id: trip.id,
        title,
        image: trip.cover_image_url || 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=80',
        dates,
        duration: durationText,
        country: trip.country?.name_th || '',
        flag: trip.country?.flag_emoji || '',
        price: formatPrice(trip.price_per_person),
        slots,
        trip_type: trip.trip_type,
        schedules: schedulesDisplay,
      })
    })

    // Calculate pagination metadata
    const totalTrips = totalCount || 0
    const totalPages = Math.ceil(totalTrips / pageSize)

    return NextResponse.json({
      trips: displayTrips,
      pagination: {
        page,
        pageSize,
        total: totalTrips,
        totalPages,
        hasMore: page < totalPages,
        hasPrevious: page > 1,
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
