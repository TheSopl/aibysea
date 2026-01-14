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
        // Design System v1.1 Colors
        navy: '#12583e',
        'dark-surface': '#0e4530',
        'accent-surface': '#1a6b4d',
        teal: '#00D9FF',
        purple: '#A855F7',
        pink: '#EC4899',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444',
        'text-primary': '#FFFFFF',
        'text-secondary': '#D1D5DB',
        'text-tertiary': '#9CA3AF',
        'neutral-gray': '#6B7280',
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
