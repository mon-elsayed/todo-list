
// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#f3f4f6',
        foreground: '#1f2937',
        primary: '#3b82f6',
        'primary-dark': '#2563eb',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};