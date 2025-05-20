const path = require('path');

module.exports = {
  content: [
    path.resolve(__dirname, './src/**/*.{js,scss}'),
    path.resolve(__dirname, './sections/**/*.liquid'),
    path.resolve(__dirname, './snippets/**/*.liquid'),
  ],
  theme: {
    extend: {
      fontFamily: {
        "franklin-gothic-sans": ["Franklin Gothic ATF", "sans-serif"],
      },
      colors: {
        'regal-red': '#FF0000',
        'gray': "#111",
        'primary-blue': "#0A4874",
        'gray-blue': "#0A4874",
        'light-gray': "#E8E8E8"
      },
      fontSize: {
      }
    },
  },
  plugins: [],
}
