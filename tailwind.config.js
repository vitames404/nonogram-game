/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Include all subfolders and relevant file types
  ],
  theme: {
    extend: {
      fontFamily: {
        openSans: ['"Open Sans"', 'sans-serif'],
        silkscreen: ['"Silkscreen"', 'cursive'],
      },
    },
  },
  plugins: [],
}
