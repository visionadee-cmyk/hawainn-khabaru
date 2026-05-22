export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        dhivehi: ['Dhivehi', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 45px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'hero-glass': 'radial-gradient(circle at top right, rgba(125, 211, 252, 0.25), transparent 40%), linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.6))',
      },
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        }
      }
    },
  },
  plugins: [],
};
