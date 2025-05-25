/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', // Scan index.html in Frontend
    './src/**/*.{js,jsx,ts,tsx}', // Scan all JS/JSX files in src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}