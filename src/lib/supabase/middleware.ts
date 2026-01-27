import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get the pathname, stripping locale prefix if present
  const pathname = request.nextUrl.pathname
  // Remove locale prefix (en, tr, ar) for route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(en|tr|ar)/, '') || '/'

  // Protected routes - redirect to login if not authenticated
  const protectedPaths = ['/dashboard', '/inbox', '/agents', '/settings', '/call-logs', '/contacts', '/data', '/documents', '/voice-agents', '/workflows', '/voice-settings', '/phone-numbers', '/templates', '/upload', '/processing', '/processing-queue', '/extracted-data']
  const isProtectedPath = protectedPaths.some(path => pathnameWithoutLocale.startsWith(path))

  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone()
    // Keep the locale prefix if present
    const localeMatch = pathname.match(/^\/(en|tr|ar)/)
    const localePrefix = localeMatch ? localeMatch[0] : ''
    url.pathname = `${localePrefix}/login`
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login
  if (user && pathnameWithoutLocale === '/login') {
    const url = request.nextUrl.clone()
    // Keep the locale prefix if present
    const localeMatch = pathname.match(/^\/(en|tr|ar)/)
    const localePrefix = localeMatch ? localeMatch[0] : ''
    url.pathname = `${localePrefix}/dashboard`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
