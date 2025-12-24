import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Redirect to login if not authenticated (except for login page itself)
    if (!user && request.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Redirect to dashboard if already logged in and trying to access login page
    if (user && request.nextUrl.pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // Verify admin status if user is authenticated and not on login page
    if (user && request.nextUrl.pathname !== '/admin/login') {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .eq('is_active', true)
        .single()

      if (!adminUser) {
        // User is not an admin or inactive, sign them out and redirect to login
        await supabase.auth.signOut()
        return NextResponse.redirect(
          new URL('/admin/login?error=unauthorized', request.url)
        )
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
