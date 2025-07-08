import type { Config } from "tailwindcss";
import customUtilities from "./tailwind/customUtilities";

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        outfit: ["var(--font-outfit)", "sans-serif"],
        sourGummy: ["var(--font-sour-gummy)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#61E4A3", // Greenish primary color
          light: "#D4FCE1", // Lighter shade
        },
        secondary: {
          DEFAULT: "#012E3F", // Rose
          light: "#FDE4E8", // Lighter shade
        },
        warning: {
          DEFAULT: "#F59E0B", // Yellow
          light: "#FEF3C7", // Lighter shade
        },
        info: {
          DEFAULT: "#3B82F6", // Blue
          light: "#DBEAFE", // Lighter shade
        },
        danger: {
          DEFAULT: "#DC2626", // Red
          light: "#FECACA", // Lighter shade
        },
        success: {
          DEFAULT: "#10B981", // Green
          light: "#D1FAE5", // Lighter shade
        },
      },
    },
  },
  plugins: [],
} satisfies Config);
