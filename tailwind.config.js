/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          gray: "#111827",
          red: "#A6264C"
        }
      },
      fontSize: {
        xs2: ["10px", "12px"],
      },
      fontFamily: {
        "qatar-2022-arabic": ["qatar-2022-arabic"],
      },
    },
  },
  plugins: [],
}
