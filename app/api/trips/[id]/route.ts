import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for updating a trip
const updateTripSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
  country_id: z.string().uuid().optional(),
  price_per_person: z.number().positive().optional(),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  file_link: z.string().url().optional().or(z.literal('')),
  trip_type: z.enum(['group', 'private']).optional(),
  is_active: z.boolean().optional(),
})

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/trips/[id] - Get single trip
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    const { data: trip, error } = await supabase
      .from('trips')
      .select(
        `
        *,
        country:countries(*),
        trip_schedules(*)
      `
      )
      .eq('id', id)
      .single()

    if (error || !trip) {
      return NextResponse.json({ error: 'ไม่พบทริปนี้' }, { status: 404 })
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// PUT /api/trips/[id] - Update trip
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validationResult = updateTripSchema.safeParse(body)
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

    // Update trip
    const { data: trip, error } = await supabase
      .from('trips')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        country:countries(*)
      `
      )
      .single()

    if (error || !trip) {
      console.error('Error updating trip:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัพเดตทริป' },
        { status: 500 }
      )
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// DELETE /api/trips/[id] - Delete trip
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    const { error } = await supabase.from('trips').delete().eq('id', id)

    if (error) {
      console.error('Error deleting trip:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบทริป' },
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
