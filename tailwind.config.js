/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./components/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Delight', 'system-ui', 'sans-serif'],
        delight: ['Delight'],
        'delight-light': ['Delight-Light'],
        'delight-medium': ['Delight-Medium'],
        'delight-semibold': ['Delight-Semibold'],
        'delight-bold': ['Delight-Bold'],
        'delight-black': ['Delight-Black'],
      },
      colors: {
        primary: '#8E1616',
        secondary: '#1E1E1E',
      },
    },
  },
  plugins: [],
};
