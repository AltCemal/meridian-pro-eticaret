import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF8",     // page background — warm editorial white
        ink: "#0B0B0C",       // primary text / near-black
        graphite: "#6B6B6E",  // secondary text
        hairline: "#DEDCD6",  // borders / rules
        surface: "#F1EFEA",   // subtle panel tint
        signal: "#B0213A",    // accent — lipstick red
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      letterSpacing: {
        wide2: "0.2em",
        wide3: "0.32em",
      },
    },
  },
  plugins: [],
};

export default config;
