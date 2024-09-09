import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: "var(--font-merriwether)",
        secondary: "var(--font-raleway)",
      },
      colors: {
        background: "var(--background-primary)",
        secondary: "var(--background-secondary)",
        tertiary: "var(--background-tertiary)",
        foreground: "var(--foreground-primary)",
        accent: "var(--foreground-secondary)",
        white: "var(--foreground-tertiary)",
      },
    },
  },
  plugins: [],
};
export default config;
