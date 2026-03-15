/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  important: '#root',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f5ddb0',
          300: '#edc57e',
          400: '#e4a84a',
          500: '#d98d28',
          600: '#c4721e',
          700: '#a3581b',
          800: '#84451d',
          900: '#6c391a',
          950: '#3d1c0b',
        },
        coffee: {
          light: '#c8a97e',
          DEFAULT: '#6f4e37',
          dark: '#3d2b1f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Avoid conflicts with Ant Design reset
  },
};
