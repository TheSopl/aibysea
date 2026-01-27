import { updateSession } from './lib/supabase/middleware';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First, handle authentication with Supabase
  const authResponse = await updateSession(request);

  // If auth middleware is redirecting, return that response
  if (authResponse.status === 307 || authResponse.status === 308) {
    return authResponse;
  }

  // Otherwise, handle i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
