/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "360px", // Extra small screen breakpoint
      },
      spacing: {
        0.5: "0.125rem", // Extra small spacing
      },
      fontSize: {
        "2xs": "0.65rem", // Extra small font size
      },
    },
  },
  plugins: [],
};
