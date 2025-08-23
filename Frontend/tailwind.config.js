/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define your primary and secondary colors
        // Primary color: Orange/Yellow from your existing theme
        // Secondary color: New darker grey
        'primary-orange': '#ffaa00', // Your main project color
        'secondary-dark-grey': '#42423E', // The new secondary color
      },
    },
  },
  plugins: [],
}