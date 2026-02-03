import * as Sentry from '@sentry/nextjs'

export function captureError(error: unknown, context?: Record<string, unknown>) {
  Sentry.captureException(error, { extra: context })
}

export function setUser(user: { id: string; email?: string }) {
  Sentry.setUser(user)
}
