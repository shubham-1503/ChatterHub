/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
    theme: {
   
    extend: {
      colors:
      {
        'darkNavyBlue': '#152238',
        'gray': '#BEBDBF',
        'blue': '#3b82f6',
        'darkBlue' : '1d4ed8'
      },
      screens: {
        'xsm': {'min': '330px', 'max': '639px'},
      },
    },
  },
  plugins: [],
}
