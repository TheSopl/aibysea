/**
 * Testing Utilities
 *
 * Provides custom render functions and test helpers for component testing.
 * Wraps components with necessary providers (i18n, etc.) for realistic testing.
 */

import { render, RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { ReactElement } from 'react';

/**
 * Minimal test messages for i18n provider.
 * Add more keys as needed for specific tests.
 */
const testMessages = {
  Common: {
    appName: 'AI BY SEA',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    error: 'Error',
    success: 'Success',
  },
  Navigation: {
    dashboard: 'Dashboard',
    inbox: 'Inbox',
    agents: 'AI Agents',
    more: 'More',
  },
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: string;
  messages?: Record<string, any>;
}

/**
 * Custom render function that wraps components with NextIntlClientProvider.
 *
 * @example
 * ```tsx
 * import { renderWithProviders } from '@/lib/test-utils';
 * import MyComponent from './MyComponent';
 *
 * test('renders correctly', () => {
 *   const { getByText } = renderWithProviders(<MyComponent />);
 *   expect(getByText('Hello')).toBeInTheDocument();
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    locale = 'en',
    messages = testMessages,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
