import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        photon: {
          obsidian: "#08090B",
          dark: "#0E0F12",
          card: "#141519",
          elevated: "#1A1B20",
          border: "#22242A",
          subtle: "#2C2E35",
          muted: "#7E808C",
          light: "#B2B4BE",
          ivory: "#F5F3ED",
          pure: "#ffffff",
        },
        warm: {
          50: "#faf9f6",
          100: "#f5f4ef",
          200: "#eceae2",
          300: "#dfdbce",
          400: "#c7c1ae",
          500: "#a9a18c",
          600: "#8b826e",
          700: "#6e6655",
          800: "#4f493d",
          900: "#322e26",
          950: "#1c1914",
        },
        // Muted photographic accents (warm titanium & gold champagne)
        accent: {
          gold: "#d4af37",
          amber: "#e5a93c",
          titanium: "#c8c8cc",
          crimson: "#e05353",
          emerald: "#34d399",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "Baskerville", "Cambria", "serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["SF Mono", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      letterSpacing: {
        widest: ".25em",
        cinema: ".18em",
      },
      boxShadow: {
        cinema: "0 20px 50px rgba(0, 0, 0, 0.7)",
        soft: "0 10px 30px rgba(0, 0, 0, 0.35)",
        inset: "inset 0 1px 1px rgba(255, 255, 255, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
