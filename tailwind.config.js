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
          gray: "#505b73"
        }
      },
      fontSize: {
        xs2: ["10px", "12px"],
      },
    },
  },
  plugins: [],
}
