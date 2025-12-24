import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for creating a FAQ
const createFaqSchema = z.object({
  question: z.string()
    .min(10, 'คำถามต้องมีอย่างน้อย 10 ตัวอักษร')
    .max(500, 'คำถามต้องไม่เกิน 500 ตัวอักษร'),
  answer: z.string()
    .min(10, 'คำตอบต้องมีอย่างน้อย 10 ตัวอักษร'),
  order_index: z.number().default(0),
  is_active: z.boolean().default(true),
})

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/trips/[id]/faqs - Get all FAQs for a trip
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: tripId } = await context.params
    const supabase = await createClient()

    const { data: faqs, error } = await supabase
      .from('trip_faqs')
      .select(`
        *,
        images:trip_faq_images(
          *
        )
      `)
      .eq('trip_id', tripId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching FAQs:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล FAQ' },
        { status: 500 }
      )
    }

    // Sort images within each FAQ
    const sortedFaqs = faqs?.map(faq => ({
      ...faq,
      images: faq.images?.sort((a: any, b: any) => a.order_index - b.order_index) || [],
    }))

    return NextResponse.json({ faqs: sortedFaqs || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// POST /api/trips/[id]/faqs - Create new FAQ
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: tripId } = await context.params
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validationResult = createFaqSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'ข้อมูลไม่ถูกต้อง',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const faqData = validationResult.data

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    // Create FAQ
    const { data: faq, error } = await supabase
      .from('trip_faqs')
      .insert({
        ...faqData,
        trip_id: tripId,
        created_by: user?.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating FAQ:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้าง FAQ' },
        { status: 500 }
      )
    }

    return NextResponse.json({ faq }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
