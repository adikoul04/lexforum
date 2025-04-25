/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        'lex-navy': '#00173d',
        'lex-gold': '#b8a267',
        'lex-white': '#fefefe',
        'lex-navy-light': '#002855',
        'lex-gold-light': '#c4b47d',
        'lex-sky': '#66b3ff',
        'lex-gray': '#f3f4f6',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 23, 61, 0.1)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};