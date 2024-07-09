/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["monospace"],
      },
      gridTemplateColumns: {
        16: "repeat(17, minmax(0, 1fr))",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
