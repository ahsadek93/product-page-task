/** @type {import('tailwindcss').Config} */
module.exports = {
  // Hover styles only on devices that can hover, so taps on touch screens don't leave them stuck.
  future: { hoverOnlyWhenSupported: true },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        clash: ['"Clash Grotesk"', 'Arial', 'sans-serif'],
        raleway: ['Raleway', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
