/**
 * Vitest Global Setup
 *
 * This file runs before all tests to configure the testing environment.
 */

import '@testing-library/jest-dom/vitest';

// Mock window.matchMedia for testing components with prefers-reduced-motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // Deprecated
    removeListener: () => {}, // Deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});
