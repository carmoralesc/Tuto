/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'confirmation-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'confirmation-pop': {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'confirmation-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'confirmation-fade-in': 'confirmation-fade-in 180ms ease-out',
        'confirmation-pop': 'confirmation-pop 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        'confirmation-pulse': 'confirmation-pulse 1.4s ease-in-out infinite',
        fadeIn: 'fadeIn 300ms ease-out',
      },
    },
  },
  plugins: [],
}

