/** @type {import('tailwindcss').Config} */
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'satoshi': ['Satoshi', 'sans-serif'],
        'piepie': ['"piepie"', 'sans-serif'],
      },
      colors: {
        'hive': {
          'yellow': '#FFAF02',
          'orange': '#FF6B35',
          'purple': '#9B5DE5',
          'pink': '#FF449F',
          'beige': '#FFFDE3',
          'black': '#111111'
        }
      },
      borderWidth: {
        '6': '6px',
        '8': '8px',
        '10': '10px'
      }
    },
  },
  plugins: [scrollbarHide],
}

