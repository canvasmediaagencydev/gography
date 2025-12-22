import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }

    // Check if user is an admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', data.user.id)
      .eq('is_active', true)
      .single()

    if (!adminUser) {
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: 'คุณไม่มีสิทธิ์เข้าถึงระบบ' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      user: data.user,
      admin: adminUser,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
