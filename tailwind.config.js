const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: ['./src/**/*.{ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#007cb8'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
