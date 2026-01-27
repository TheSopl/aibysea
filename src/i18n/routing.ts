import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'tr', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' // Only prefix non-default locales
});

export type Locale = (typeof routing.locales)[number];
