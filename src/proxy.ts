import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Handle i18n routing
  const response = intlMiddleware(request)

  // Create Supabase client to check auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check auth status
  const { data: { user } } = await supabase.auth.getUser()

  // Get pathname without locale
  const pathnameWithoutLocale = pathname.replace(/^\/(en|tr|ar)/, '') || '/'
  const localeMatch = pathname.match(/^\/(en|tr|ar)/)
  const localePrefix = localeMatch ? localeMatch[0] : ''

  // Protected routes
  const protectedPaths = ['/dashboard', '/inbox', '/agents', '/settings', '/call-logs', '/contacts', '/data', '/documents', '/voice-agents', '/workflows', '/voice-settings', '/phone-numbers', '/templates', '/upload', '/processing', '/processing-queue', '/extracted-data']
  const isProtectedPath = protectedPaths.some(path => pathnameWithoutLocale.startsWith(path))

  // Redirect to login if not authenticated
  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone()
    url.pathname = `${localePrefix}/login`
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login
  if (user && pathnameWithoutLocale === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = `${localePrefix}/dashboard`
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (svg, png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

