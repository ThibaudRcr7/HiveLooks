/** @type {import('tailwindcss').Config} */
import scrollbarHide from 'tailwind-scrollbar-hide';
import { spacing, typography, breakpoints, containers, borderRadius, shadows } from './src/styles/design-tokens';
import { colors } from './src/styles/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: breakpoints,
    container: {
      center: true,
      padding: spacing.md,
      screens: containers,
    },
    extend: {
      fontFamily: {
        'satoshi': ['Satoshi', 'sans-serif'],
        'piepie': ['"piepie"', 'sans-serif'],
      },
      colors: colors,
      spacing: spacing,
      fontSize: typography.size,
      lineHeight: typography.leading,
      fontWeight: typography.weight,
      borderRadius: borderRadius,
      boxShadow: shadows,
      borderWidth: {
        '6': '6px',
        '8': '8px',
        '10': '10px'
      }
    },
  },
  plugins: [
    scrollbarHide,
    function({ addBase, theme }) {
      addBase({
        'h1': {
          fontSize: theme('fontSize.4xl'),
          fontWeight: theme('fontWeight.bold'),
          lineHeight: theme('lineHeight.tight'),
          marginBottom: theme('spacing.lg'),
        },
        'h2': {
          fontSize: theme('fontSize.2xl'),
          fontWeight: theme('fontWeight.semibold'),
          lineHeight: theme('lineHeight.snug'),
          marginBottom: theme('spacing.md'),
        },
        'h3': {
          fontSize: theme('fontSize.xl'),
          fontWeight: theme('fontWeight.medium'),
          lineHeight: theme('lineHeight.normal'),
          marginBottom: theme('spacing.sm'),
        },
        'p': {
          fontSize: theme('fontSize.base'),
          lineHeight: theme('lineHeight.relaxed'),
          marginBottom: theme('spacing.md'),
        },
        'small': {
          fontSize: theme('fontSize.sm'),
          lineHeight: theme('lineHeight.normal'),
        }
      });
    }
  ],
}

