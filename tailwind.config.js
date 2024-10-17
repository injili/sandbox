/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        first: '#D2C7FF',
        second: '#0D0D55',
        third: '#F9FAF2',
        forth: '#FD98DA',
      },
      fontFamily: {
        bowldy: ['Bowlby One SC', 'sans-serif'],
        alata: ['Alata', 'sans-serif']
      }
    },
  },
  plugins: [],
}