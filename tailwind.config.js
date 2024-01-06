/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#22C55E',
      },
    },
  },
  corePlugins: {

  },
  plugins: [
    require('@tailwindcss/forms'),],

}
