/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
 
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  colors: {
    'customBlue': '#57BDE9',
    'customDarkBlue': '#233861',
    'customGreen': '#74E957',
    'customRed': '#FC3939',
    'customOrange': '#FC8F2B',
  },
  plugins: [],
}