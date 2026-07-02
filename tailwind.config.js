/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cherry: {
          50: '#fdf8f8',
          100: '#f9eded',
          200: '#f0d3d5',
          300: '#e3b1b5',
          400: '#ce838a',
          500: '#b45b64',
          600: '#96424b',
          700: '#7a333a',
          800: '#672d33',
          900: '#57292e',
          dark: '#3a181c',
          text: '#4a3f3f',
          gold: '#C5A059',
          goldLight: '#E8D5A5',
          maroon: '#800020',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(0,0,0,0.05)',
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wa-blink': 'waBlink 2s ease-in-out infinite',
        'wa-ring': 'waRing 2s ease-in-out infinite',
        fadeSlideIn: 'fadeSlideIn 0.5s ease-out forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
        waBlink: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.92)' },
        },
        waRing: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '70%': { transform: 'scale(1.8)', opacity: '0' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
