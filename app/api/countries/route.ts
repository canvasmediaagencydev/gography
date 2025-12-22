import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: countries, error } = await supabase
      .from('countries')
      .select('*')
      .eq('is_active', true)
      .order('name_th')

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
