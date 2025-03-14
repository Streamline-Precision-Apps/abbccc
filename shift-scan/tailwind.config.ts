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
        slideLeft: "slideLeft 0.3s ease-out forwards",
        slideRight: "slideRight 0.3s ease-out forwards",
        touchSlide: "slide 5s linear infinite",
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
        slideLeft: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        touchSlide: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      colors: {
        "app-blue": "#57BDE9",
        "app-dark-blue": "#233861",
        "app-green": "#4FCF62",
        "app-dark-green": "#09814a",
        "app-red": "#FC3939",
        "app-orange": "#FC8F2B",
        "app-yellow": "#FCE700",
        "app-gray": "#D1D5DB",
        "app-dark-gray": "#6B7280",
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
