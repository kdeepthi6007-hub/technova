/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          50: '#f2fbf4',
          100: '#e1f7e6',
          200: '#c5eed0',
          300: '#97deaa',
          400: '#62c67e',
          500: '#38aa57',
          600: '#298b44',
          700: '#236e38',
          800: '#1f5730',
          900: '#1c482a',
          950: '#0b2715',
        },
        earth: {
          50: '#fbf8f3',
          100: '#f5efe4',
          200: '#e9dcbf',
          300: '#dbc394',
          400: '#caa369',
          500: '#bc8949',
          600: '#a36e3b',
          700: '#815332',
          800: '#6a432e',
          900: '#583829',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f9f6ef',
          200: '#f3ece0',
          300: '#e7dcce',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

