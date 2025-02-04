import type { Config } from "tailwindcss";
const config: Config = {
  content: {
    files: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
  },
  theme: {
    extend: {
      backgroundColor: { "peer-checked": "#FCE700" },
      animation: {
        "spin-custom": "spin 1.1s linear infinite", // Adjust '2s' to make it slower or faster
        wave: "wave 1s linear",
      },
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
      },
      colors: {
        "app-blue": "#57BDE9",
        "app-dark-blue": "#233861",
        "app-green": "#74E957",
        "app-dark-green": "#4FCF62",
        "app-red": "#FC3939",
        "app-orange": "#FC8F2B",
        "app-yellow": "#FCE700",
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
