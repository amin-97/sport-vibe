/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // This tells Tailwind to look for classes in these files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a365d', // dark blue
        secondary: '#2d3748', // slate gray
        accent: '#ed8936', // orange
      },
    },
  },
  plugins: [],
}
