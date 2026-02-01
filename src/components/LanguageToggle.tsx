'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const localeLabels: Record<string, string> = {
  en: 'EN',
  ar: 'AR',
};

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-0.5">
      {routing.locales.map((loc) => {
        const isActive = loc === locale;
        return (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`
              px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200
              ${isActive
                ? 'bg-[#4052a8] text-white shadow-sm scale-105'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }
            `}
            aria-label={`Switch to ${localeLabels[loc]}`}
          >
            {localeLabels[loc]}
          </button>
        );
      })}
    </div>
  );
}
