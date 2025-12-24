import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for creating a country
const createCountrySchema = z.object({
  code: z.string().min(2, 'รหัสประเทศต้องมีอย่างน้อย 2 ตัวอักษร').max(10),
  name_th: z.string().min(2, 'ชื่อภาษาไทยต้องมีอย่างน้อย 2 ตัวอักษร').max(255),
  name_en: z.string().min(2, 'ชื่อภาษาอังกฤษต้องมีอย่างน้อย 2 ตัวอักษร').max(255),
  flag_emoji: z.string().optional(),
  is_active: z.boolean().default(true),
})

// GET /api/countries - List all countries (admin view)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active_only') === 'true'

    let query = supabase
      .from('countries')
      .select('*')
      .order('name_th')

    // Filter by active status if requested
    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data: countries, error } = await query

    if (error) {
      console.error('Error fetching countries:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเทศ' },
        { status: 500 }
      )
    }

    return NextResponse.json({ countries })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// POST /api/countries - Create new country
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validationResult = createCountrySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'ข้อมูลไม่ถูกต้อง',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const countryData = validationResult.data

    // Create country
    const { data: country, error } = await supabase
      .from('countries')
      .insert(countryData)
      .select()
      .single()

    if (error) {
      console.error('Error creating country:', error)
      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'รหัสประเทศนี้มีอยู่แล้วในระบบ' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้างประเทศ' },
        { status: 500 }
      )
    }

    return NextResponse.json({ country }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
