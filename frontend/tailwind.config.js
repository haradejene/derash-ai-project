/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003527',
        secondary: '#735c00',
        surface: '#fbfbe2',
        'surface-container': '#efefd7',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#eaead1',
        'surface-container-highest': '#e4e4cc',
        'on-surface': '#1b1d0e',
        'on-surface-variant': '#404944',
        outline: '#707974',
        'outline-variant': '#bfc9c3',
        error: '#ba1a1a',
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        bounce: 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
};