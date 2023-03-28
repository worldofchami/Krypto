/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: 'rgb(32,32,32)',
        highlight: 'rgb(116, 251, 155)',
        txt: 'white',
        stateBad: 'rgb(233, 59, 60)',
        stateNeutral: 'rgb(148, 148, 148)',
      }
    },
  },
  plugins: [],
}