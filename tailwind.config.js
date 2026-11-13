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
      colors: {
        // Figma's greys, dark → light. The design's own values, not Tailwind's neutral scale.
        ink: {
          900: '#141414', // primary text, dark buttons and surfaces
          800: '#292929', // headings
          700: '#333333', // outlined-button text, selected borders
          600: '#525252', // secondary text
          500: '#666666', // body copy
          400: '#7a7a7a', // tertiary text
          300: '#8f8f8f', // labels
          200: '#b8b8b8', // control borders, disabled text
        },
        line: '#e6e6e6', // hairline borders and dividers
        surface: { DEFAULT: '#f2f2f2', selected: '#ebebeb' }, // placeholders, footer, icon buttons; selected or hovered fill
        review: { ink: '#0b0f0e', line: '#e4e9ee' }, // the reviews block has its own two tints in Figma
        success: '#12b76a',
        warning: '#f79009',
        danger: '#d92d20',
      },
    },
  },
  plugins: [],
};
