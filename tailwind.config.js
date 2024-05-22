/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        bgColor: '#0e0f1a',
        twhite: '#eee5ff',
        tgray: '#b1abc1',
        tpurple: '#0f0821',
        gradient: 'linear-gradient(90deg, #F87516 0%, #5E11FF 100%)',
      },
    },
  },
  plugins: [],
}

