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
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.bg-hollgregenn': {
          content: '" "',
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: '0',
          top: '0',
          backgroundImage: 'url(assets/images/hollgrehenn.png)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '30vh',
          backgroundAttachment: 'fixed',
          opacity: '0.3'
        }
      })
    })
  ],
}
