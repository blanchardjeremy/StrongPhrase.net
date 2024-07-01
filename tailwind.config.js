/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        'custom': ['"Courier Prime"', 'monospace'],
      },
    },
  },
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [require("daisyui")],
}