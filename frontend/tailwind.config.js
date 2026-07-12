/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#14171A',
        paper: '#FAFAF7',
        surface: '#FFFFFF',
        line: '#E4E4E0',
        brand: {
          50: '#EAF3F0',
          100: '#CFE4DC',
          200: '#9FC9B8',
          300: '#6FAD95',
          400: '#3F9271',
          500: '#0F6A55', // primary deep emerald
          600: '#0C5745',
          700: '#094334',
          800: '#063024',
          900: '#031C15',
        },
        amber: {
          400: '#F0B85B',
          500: '#E8A33D',
          600: '#C9832A',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,23,26,0.06), 0 1px 1px rgba(20,23,26,0.04)',
        pop: '0 8px 24px rgba(20,23,26,0.12)',
      },
    },
  },
  plugins: [],
};
