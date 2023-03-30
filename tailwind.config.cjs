/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        baseColour: 'rgb(32,32,32)',
        highlight: '#00ff90',
        txt: 'white',
        stateGood: '#00ff90',
        stateBad: '#fe1b30',
        stateNeutral: '#949494',
      },
      fontFamily: {
        heading: ['HelveticaNeue93', 'sans-serif']
      },
    },
  },
  plugins: [],
}