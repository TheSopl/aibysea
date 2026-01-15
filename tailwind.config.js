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
        // Brand Color System - AI By Sea
        primary: {
          DEFAULT: '#003EF3', // Primary Blue
          50: '#E6EEFE',
          100: '#CCDCFD',
          200: '#99BAFB',
          300: '#6697F9',
          400: '#3375F6',
          500: '#003EF3',
          600: '#0032C2',
          700: '#002592',
          800: '#001961',
          900: '#000C31',
        },
        accent: {
          DEFAULT: '#4EB6C9', // Aqua Cyan
          50: '#EBF7F9',
          100: '#D7EFF4',
          200: '#AFDFE8',
          300: '#87CFDD',
          400: '#5FBFD1',
          500: '#4EB6C9',
          600: '#3E92A1',
          700: '#2E6E79',
          800: '#1F4A51',
          900: '#0F2528',
        },
        'light-bg': '#F5F6FA', // Cool Light Gray
        dark: '#1a1a1a', // Text/elements

        // Legacy colors kept for backward compatibility
        navy: '#1a1a1a',
        'dark-surface': '#242424',
        'accent-surface': '#2d2d2d',
        teal: '#4EB6C9', // Mapped to accent color
        purple: '#A855F7',
        pink: '#EC4899',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444',
        'text-primary': '#1a1a1a', // Changed to dark for light theme
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
        'neutral-gray': '#6B7280',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontWeight: {
        'extralight': 100,
        'light': 300,
        'normal': 400,
        'medium': 500,
        'semibold': 600,
        'bold': 700,
        'extrabold': 800,
        'black': 900,
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'teal-glow': '0 0 24px rgba(78, 182, 201, 0.4), 0 0 12px rgba(78, 182, 201, 0.2)',
        'purple-glow': '0 0 24px rgba(168, 85, 247, 0.3)',
        'red-glow': '0 0 24px rgba(239, 68, 68, 0.3)',
        'primary-glow': '0 0 24px rgba(0, 62, 243, 0.3)',
      },
      borderRadius: {
        'design': '8px',
        'design-lg': '12px',
        'design-xl': '16px',
      },
      backdropBlur: {
        'design': '8px',
      },
    },
  },
  plugins: [],
}
