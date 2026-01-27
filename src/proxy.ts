import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { updateSession } from '@/lib/supabase/middleware'

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing)

// Check if pathname has a locale prefix
function hasLocalePrefix(pathname: string): boolean {
  return routing.locales.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip i18n for API routes, auth callback, and static files
  const shouldSkipIntl =
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')

  if (shouldSkipIntl) {
    // For non-i18n routes, just handle Supabase session
    return await updateSession(request)
  }

  // For app routes with or without locale prefix, handle auth first
  if (hasLocalePrefix(pathname) || pathname === '/') {
    const authResponse = await updateSession(request)

    // If auth is redirecting (e.g., to login), return that redirect
    if (authResponse.status === 307 || authResponse.status === 308) {
      return authResponse
    }
  }

  // Handle i18n routing for all other cases
  return intlMiddleware(request)
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

