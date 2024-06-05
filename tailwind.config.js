/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["monospace"],
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
