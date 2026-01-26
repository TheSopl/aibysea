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
    // Custom breakpoints (replaces defaults)
    screens: {
      'xs': '320px',     // Small phones (iPhone SE)
      'sm': '375px',     // Standard phones (iPhone 12/13/14)
      'md': '428px',     // Large phones (iPhone Pro Max)
      'tablet': '768px', // Tablets (iPad Mini)
      'lg': '1024px',    // Tablets landscape / Small laptops
      'xl': '1280px',    // Desktops
      '2xl': '1536px',   // Large desktops
    },
    extend: {
      colors: {
        // Service-specific colors
        'service-voice': {
          50: '#F0FDF4',
          500: '#10B981',
          600: '#059669',
        },
        'service-documents': {
          50: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
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
        'service-voice-glow': '0 0 24px rgba(16, 185, 129, 0.4), 0 0 12px rgba(16, 185, 129, 0.2)',
        'service-documents-glow': '0 0 24px rgba(245, 158, 11, 0.4), 0 0 12px rgba(245, 158, 11, 0.2)',
      },
      borderRadius: {
        'design': '8px',
        'design-lg': '12px',
        'design-xl': '16px',
      },
      backdropBlur: {
        'design': '8px',
      },
      backgroundImage: {
        'gradient-voice': 'linear-gradient(to right, #10B981, #06B6D4)',
        'gradient-documents': 'linear-gradient(to right, #F59E0B, #EF4444)',
      },
      // Responsive spacing tokens
      spacing: {
        'page': '1rem',        // Base page padding (mobile)
        'page-sm': '1.25rem',  // 20px
        'page-md': '1.5rem',   // 24px
        'page-lg': '2rem',     // 32px
        'section': '1rem',     // Base section gap
        'section-md': '1.5rem',
        'section-lg': '2rem',
        'card': '1rem',        // Card padding
        'card-md': '1.5rem',
        'card-lg': '2rem',
      },
      // Responsive typography scale
      fontSize: {
        'heading-1': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],        // 24px mobile
        'heading-1-sm': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }], // 30px
        'heading-1-md': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],   // 36px
        'heading-1-lg': ['3rem', { lineHeight: '3.5rem', fontWeight: '700' }],      // 48px
        'heading-2': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],     // 20px mobile
        'heading-2-sm': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'heading-2-md': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        'heading-3': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }],     // 18px mobile
        'heading-3-sm': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
        'body': ['1rem', { lineHeight: '1.5rem' }],           // 16px
        'caption': ['0.75rem', { lineHeight: '1rem' }],       // 12px
      },
    },
  },
  plugins: [],
}
