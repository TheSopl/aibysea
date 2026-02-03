export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  console.debug('[analytics]', name, properties)
}
