/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          bg: '#fdf7ff',
          surface: '#ffffff',
          surfaceLow: '#f8f1ff',
          surfaceContainer: '#f2eaff',
          surfaceHigh: '#ede4ff',
          surfaceHighest: '#e8ddff',
          primary: '#b50060',
          primaryHover: '#8e004a',
          primaryContainer: '#db2379',
          secondary: '#ae3115',
          secondaryContainer: '#fd6a49',
          tertiary: '#7d2dce',
          tertiaryContainer: '#974ce9',
          gold: '#b88e56',
          text: '#1e1831',
          textMuted: '#594047',
          outline: '#e1bec6'
        }
      },
      fontFamily: {
        headline: ['Syne', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}
