/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your primary color (already implicitly available as #ffaa00 if used directly)
        // Adding a custom name for clarity
        'primary-orange': '#ffaa00', 
        // NEW: Define your new secondary color
        'secondary-dark': '#42423E', 
      },
    },
  },
  plugins: [],
}