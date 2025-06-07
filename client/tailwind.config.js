/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefff0',
          100: '#fdfde0',
          200: '#fbfac2',
          300: '#f8f594',
          400: '#f4ee5e',
          500: '#f0ff65', // Main primary color
          600: '#d4e234',
          700: '#a8b827',
          800: '#869023',
          900: '#717722',
        },
        dark: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae2',
          300: '#b1bcc9',
          400: '#8797ab',
          500: '#677991',
          600: '#526178',
          700: '#434f62',
          800: '#3a4353',
          900: '#36391a', // Main dark color for gradients
        }
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(to bottom, #36391a, transparent)',
      }
    },
  },
  plugins: [],
}