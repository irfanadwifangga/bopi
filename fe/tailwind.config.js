/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f0',
          500: '#ff6b35',
          600: '#e55a2b',
          700: '#cc4f25',
        },
        secondary: {
          500: '#f7931e',
        }
      }
    },
  },
  plugins: [],
}