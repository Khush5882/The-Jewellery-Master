/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#efd9b5", // Light Beige
        secondary: "#700123", // Deep Maroon
        accent: "#4f1120", // Darker Maroon
      },
    },
  },
  plugins: [],
}
