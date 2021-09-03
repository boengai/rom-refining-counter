const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: ['./src/**/*.{ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        danger: '#ff4444',
        primary: '#0f4c81',
        warning: '#ffbb33'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
