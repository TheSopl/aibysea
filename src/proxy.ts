import { type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { updateSession } from '@/lib/supabase/middleware'

const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return await updateSession(request)
  }

  // Handle i18n first to get proper locale
  const intlResponse = intlMiddleware(request)

  // If i18n is redirecting (for locale handling), let it proceed
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse
  }

  // Then check authentication
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

