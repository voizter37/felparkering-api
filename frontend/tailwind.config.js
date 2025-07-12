/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mydarkgreen: "#52796F",
        mygreen: "#537c80",
      },
    },
  },
  plugins: [],
}

