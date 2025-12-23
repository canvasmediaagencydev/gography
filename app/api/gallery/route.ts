import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for creating a gallery image
const createGalleryImageSchema = z.object({
  storage_path: z.string().min(1, 'storage_path ต้องไม่ว่าง'),
  storage_url: z.string().url('storage_url ต้องเป็น URL ที่ถูกต้อง'),
  file_name: z.string().min(1, 'file_name ต้องไม่ว่าง'),
  file_size: z.number().optional().nullable(),
  mime_type: z.string().optional().nullable(),
  country_id: z.string().uuid('ประเทศไม่ถูกต้อง').optional().nullable(),
  trip_id: z.string().uuid('ทริปไม่ถูกต้อง').optional().nullable(),
  title: z.string().min(3, 'ชื่อต้องมีอย่างน้อย 3 ตัวอักษร').max(255),
  description: z.string().optional().nullable(),
  alt_text: z.string().optional().nullable(),
  is_highlight: z.boolean().default(false),
  order_index: z.number().default(0),
  is_active: z.boolean().default(true),
})

// GET /api/gallery - List all gallery images (with pagination and filters)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Filters
    const country_id = searchParams.get('country_id')
    const trip_id = searchParams.get('trip_id')
    const is_highlight = searchParams.get('is_highlight')
    const is_active = searchParams.get('is_active')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
      .from('gallery_images')
      .select(
        `
        *,
        country:countries(*),
        trip:trips(*)
      `,
        { count: 'exact' }
      )
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

    // Apply filters
    if (country_id) {
      query = query.eq('country_id', country_id)
    }
    if (trip_id) {
      // Handle special case: "null" means filter for images without trip
      if (trip_id === 'null') {
        query = query.is('trip_id', null)
      } else {
        query = query.eq('trip_id', trip_id)
      }
    }
    if (is_highlight !== null && is_highlight !== '') {
      query = query.eq('is_highlight', is_highlight === 'true')
    }
    if (is_active !== null && is_active !== undefined && is_active !== '') {
      query = query.eq('is_active', is_active === 'true')
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply pagination
    const { data: images, error, count } = await query.range(from, to)

    if (error) {
      console.error('Error fetching gallery images:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรูปภาพ' },
        { status: 500 }
      )
    }

    const totalPages = Math.ceil((count || 0) / pageSize)

    return NextResponse.json({
      images,
      totalCount: count || 0,
      currentPage: page,
      totalPages,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// POST /api/gallery - Create new gallery image record
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validationResult = createGalleryImageSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'ข้อมูลไม่ถูกต้อง',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const imageData = validationResult.data

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Create gallery image record
    const { data: image, error } = await supabase
      .from('gallery_images')
      .insert({
        ...imageData,
        created_by: user?.id,
      })
      .select(
        `
        *,
        country:countries(*),
        trip:trips(*)
      `
      )
      .single()

    if (error) {
      console.error('Error creating gallery image:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้างรูปภาพ' },
        { status: 500 }
      )
    }

    return NextResponse.json({ image }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
