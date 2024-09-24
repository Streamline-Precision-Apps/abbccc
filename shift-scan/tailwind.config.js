/** @type {import('tailwindcss').Config} */
import fluid, { extract } from "fluid-tailwind";

module.exports = {
  content: {
    files : [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  extract: {
    wtf: (content) => {
      return content.match(/[^<>"'`\s]*/g)
    }
  }
  },
  theme: {
    extend: { 
      colors: {
      'app-blue': '#57BDE9',
      'app-dark-blue': '#233861',
      'app-green': '#74E957',
      'app-red' : '#FC3939',
      'app-orange': '#FC8F2B',
      'app-pink': '#FFC48E',
    },
  },
  },
  plugins: [
    fluid
  ],
}