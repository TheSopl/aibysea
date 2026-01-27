import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { updateSession } from '@/lib/supabase/middleware'

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing)

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

  // First, handle i18n routing
  const intlResponse = intlMiddleware(request)

  // If intl middleware redirected, return that response
  if (intlResponse.status !== 200) {
    return intlResponse
  }

  // Then handle Supabase session (auth)
  return await updateSession(request)
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
