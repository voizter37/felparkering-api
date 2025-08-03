/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        park: {
          lighter: "#CAD2C5",
          light: "#84A98C",
          default: "#52796F",
          dark: "#354F52",
          darker: "#2F3E46",
          background: "#F7FAFC",
          icon: "#979797",
        }
      },
    },
  },
  plugins: [],
}

