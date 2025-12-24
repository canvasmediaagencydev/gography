import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateFaqSchema = z.object({
  question: z.string().min(10).max(500).optional(),
  answer: z.string().min(10).optional(),
  order_index: z.number().optional(),
  is_active: z.boolean().optional(),
})

type RouteContext = {
  params: Promise<{ id: string; faqId: string }>
}

// GET /api/trips/[id]/faqs/[faqId] - Get single FAQ
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { faqId } = await context.params
    const supabase = await createClient()

    const { data: faq, error } = await supabase
      .from('trip_faqs')
      .select(`
        *,
        images:trip_faq_images(*)
      `)
      .eq('id', faqId)
      .single()

    if (error || !faq) {
      return NextResponse.json(
        { error: 'ไม่พบ FAQ นี้' },
        { status: 404 }
      )
    }

    return NextResponse.json({ faq })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// PUT /api/trips/[id]/faqs/[faqId] - Update FAQ
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { faqId } = await context.params
    const supabase = await createClient()
    const body = await request.json()

    const validationResult = updateFaqSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { data: faq, error } = await supabase
      .from('trip_faqs')
      .update(validationResult.data)
      .eq('id', faqId)
      .select()
      .single()

    if (error || !faq) {
      console.error('Error updating FAQ:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัพเดต FAQ' },
        { status: 500 }
      )
    }

    return NextResponse.json({ faq })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

// DELETE /api/trips/[id]/faqs/[faqId] - Delete FAQ
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { faqId } = await context.params
    const supabase = await createClient()

    const { error } = await supabase
      .from('trip_faqs')
      .delete()
      .eq('id', faqId)

    if (error) {
      console.error('Error deleting FAQ:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบ FAQ' },
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
