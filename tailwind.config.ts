import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'kalam': ['Kalam', 'cursive'],
        'caveat': ['Caveat', 'cursive'],
      },
      colors: {
        ink: "#0a0a0a",
        space: {
          dark: "#0D1117",
          darker: "#010409",
          blue: "#1f6feb",
          purple: "#8b5cf6",
          cyan: "#39d353",
          orange: "#f85149"
        },
        cosmic: {
          primary: "#6366f1",
          secondary: "#8b5cf6", 
          accent: "#06b6d4",
          glow: "#10b981"
        }
      },
      boxShadow: {
        doodle: "2px 2px 0 0 #0a0a0a",
      },
      borderRadius: {
        blob: "2rem"
      }
    },
  },
  plugins: [],
};
export default config;
