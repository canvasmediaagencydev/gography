import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for updating a country
const updateCountrySchema = z.object({
  code: z.string().min(2).max(10).optional(),
  name_th: z.string().min(2).max(255).optional(),
  name_en: z.string().min(2).max(255).optional(),
  flag_emoji: z.string().optional(),
  is_active: z.boolean().optional(),
})

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/countries/[id] - Get single country
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    const { data: country, error } = await supabase
      .from('countries')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !country) {
      return NextResponse.json({ error: 'ไม่พบประเทศนี้' }, { status: 404 })
    }

    return NextResponse.json({ country })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// PUT /api/countries/[id] - Update country
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validationResult = updateCountrySchema.safeParse(body)
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

    // Update country
    const { data: country, error } = await supabase
      .from('countries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error || !country) {
      console.error('Error updating country:', error)
      // Check for unique constraint violation
      if (error?.code === '23505') {
        return NextResponse.json(
          { error: 'รหัสประเทศนี้มีอยู่แล้วในระบบ' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัพเดตประเทศ' },
        { status: 500 }
      )
    }

    return NextResponse.json({ country })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// DELETE /api/countries/[id] - Delete country
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    // Check if country is used by any trips
    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('id')
      .eq('country_id', id)
      .limit(1)

    if (tripsError) {
      console.error('Error checking trips:', tripsError)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล' },
        { status: 500 }
      )
    }

    if (trips && trips.length > 0) {
      return NextResponse.json(
        { error: 'ไม่สามารถลบประเทศที่มีการใช้งานในทริปได้' },
        { status: 400 }
      )
    }

    // Delete country
    const { error } = await supabase.from('countries').delete().eq('id', id)

    if (error) {
      console.error('Error deleting country:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบประเทศ' },
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
