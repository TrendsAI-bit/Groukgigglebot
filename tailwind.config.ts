import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        capy: "#C6F8A5",
        sky: "#BBDDFF",
        blush: "#FFBFD4"
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
