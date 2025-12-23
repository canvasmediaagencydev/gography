import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/trips/filters - Get available filter options (countries and months)
export async function GET() {
  try {
    const supabase = await createClient()

    // Get all active countries that have active trips
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('name_th, flag_emoji')
      .eq('is_active', true)
      .order('name_th', { ascending: true })

    if (countriesError) {
      console.error('Error fetching countries:', countriesError)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเทศ' },
        { status: 500 }
      )
    }

    // Get all active schedules to determine available months
    const { data: schedules, error: schedulesError } = await supabase
      .from('trip_schedules')
      .select('departure_date')
      .eq('is_active', true)
      .gte('departure_date', new Date().toISOString().split('T')[0])
      .order('departure_date', { ascending: true })

    if (schedulesError) {
      console.error('Error fetching schedules:', schedulesError)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรอบเดินทาง' },
        { status: 500 }
      )
    }

    // Extract unique months from schedules
    const monthsSet = new Set<string>()
    const monthNames = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]

    schedules?.forEach((schedule) => {
      const date = new Date(schedule.departure_date)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      monthsSet.add(`${year}-${month}`)
    })

    // Convert to array and format
    const availableMonths = Array.from(monthsSet)
      .sort()
      .map((monthKey) => {
        const [year, month] = monthKey.split('-')
        const monthIndex = parseInt(month) - 1
        return {
          value: monthKey,
          label: `${monthNames[monthIndex]} ${year}`,
        }
      })

    // Format countries
    const availableCountries = countries?.map((country) => ({
      value: country.name_th || '',
      label: country.name_th || '',
      flag: country.flag_emoji || '',
    })) || []

    return NextResponse.json({
      countries: availableCountries,
      months: availableMonths,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
