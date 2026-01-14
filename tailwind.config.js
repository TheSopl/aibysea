/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System v1.1 Colors - Dark Mode (default)
        navy: '#0F1419',
        'dark-surface': '#1A1F2E',
        'accent-surface': '#252D3D',
        teal: '#00D9FF',
        purple: '#A855F7',
        pink: '#EC4899',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444',
        'text-primary': '#F5F7FA',
        'text-secondary': '#9CA3AF',
        'text-tertiary': '#6B7280',
        'neutral-gray': '#4B5563',

        // Light Mode Colors
        'light-bg': '#FFFFFF',
        'light-surface': '#F9FAFB',
        'light-surface-alt': '#F3F4F6',
        'light-border': '#E5E7EB',
        'light-text-primary': '#1F2937',
        'light-text-secondary': '#6B7280',
        'light-text-tertiary': '#9CA3AF',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'teal-glow': '0 0 24px rgba(0, 217, 255, 0.4), 0 0 12px rgba(0, 217, 255, 0.2)',
        'purple-glow': '0 0 24px rgba(168, 85, 247, 0.3)',
        'red-glow': '0 0 24px rgba(239, 68, 68, 0.3)',
      },
      borderRadius: {
        'design': '12px',
        'design-lg': '16px',
      },
      backdropBlur: {
        'design': '8px',
      },
    },
  },
  plugins: [],
}
