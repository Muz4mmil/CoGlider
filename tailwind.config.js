/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'encode': ['EncodeSansSC_700Bold', 'sans-serif'],
        'pregular': ['Poppins_400Regular', 'sans-serif'],
        'pmedium': ['Poppins_500Medium', 'sans-serif'],
        'psemibold': ['Poppins_600SemiBold', 'sans-serif'],
        'pbold': ['Poppins_700Bold', 'sans-serif'],
      }
    },
  },
  plugins: [],
}