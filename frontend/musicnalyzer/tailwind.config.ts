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
      screens: {
        'xxs': '320px',  // Extra small devices (phones, less than 640px)
        'xs': '375px',  // Extra small devices (phones, 480px and up)
        'sm': '425px',  // Small devices (phones, 640px and up)
        'md': '768px',  // Medium devices (tablets, 768px and up)
        'lg': '1024px', // Large devices (desktops, 1024px and up)
        'xl': '1440px', // Extra large devices (larger desktops, 1280px and up)
        '2xl': '1536px', // 2x extra large devices (larger screens, 1536px and up)
      },
    },
  },
  plugins: [],
};
export default config;
