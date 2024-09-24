import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-custom': 'spin 1.1s linear infinite', // Adjust '2s' to make it slower or faster
      },
      colors: {
        'app-blue': '#57BDE9',
        'app-dark-blue': '#233861',
        'app-green': '#74E957',
        'app-red' : '#FC3939',
        'app-orange': '#FC8F2B',
        'app-pink': '#FFC48E',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
