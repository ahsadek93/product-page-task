/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        clash: ['"Clash Grotesk"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
