/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        base: 'rgb(var(--color-base) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        offset: 'rgb(var(--color-offset) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        primary: {
          DEFAULT: '#3D1560',
          dark: '#2A0F45',
          light: '#5A2A85',
        },
        accent: {
          DEFAULT: '#F05537',
          dark: '#D8431F',
          light: '#F5794E',
        },
        success: '#0F8A3D',
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(30,19,48,0.05), 0 6px 20px -10px rgba(30,19,48,0.18)',
        lift: '0 16px 36px -14px rgba(30,19,48,0.28)',
      },
    },
  },
  plugins: [],
}
