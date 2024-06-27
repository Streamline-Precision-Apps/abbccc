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
    extend: { 
      colors: {
      'app-blue': '#57BDE9',
      'app-dark-blue': '#233861',
      'app-green': '#74E957',
      'app-red' : '#FC3939',
      'app-orange': '#FC8F2B',
    },
  },
  },
  plugins: [],
}