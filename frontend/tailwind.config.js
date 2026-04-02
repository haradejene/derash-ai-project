//@import "tailwindcss";


module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        'primary': '#003527',
        'primary-container': '#064e3b',
        'on-primary': '#ffffff',
        'on-primary-container': '#80bea6',
        'primary-fixed': '#b0f0d6',
        'primary-fixed-dim': '#95d3ba',
        
        // Secondary colors
        'secondary': '#735c00',
        'secondary-container': '#fed65b',
        'secondary-fixed': '#ffe088',
        'secondary-fixed-dim': '#e9c349',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#745c00',
        'on-secondary-fixed': '#241a00',
        'on-secondary-fixed-variant': '#574500',
        
        // Surface colors
        'surface': '#fbfbe2',
        'surface-dim': '#dbdcc3',
        'surface-bright': '#fbfbe2',
        'surface-container': '#efefd7',
        'surface-container-low': '#f5f5dc',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#eaead1',
        'surface-container-highest': '#e4e4cc',
        'on-surface': '#1b1d0e',
        'on-surface-variant': '#404944',
        
        // Tertiary colors
        'tertiary': '#4f2100',
        'tertiary-container': '#713200',
        'tertiary-fixed': '#ffdbc9',
        'tertiary-fixed-dim': '#ffb68c',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#f79b63',
        'on-tertiary-fixed': '#321200',
        'on-tertiary-fixed-variant': '#753401',
        
        // Error colors
        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        
        // Outline colors
        'outline': '#707974',
        'outline-variant': '#bfc9c3',
        
        // Inverse colors
        'inverse-surface': '#303221',
        'inverse-on-surface': '#f2f2d9',
        'inverse-primary': '#95d3ba',
        
        // Background
        'background': '#fbfbe2',
        'on-background': '#1b1d0e',
        'surface-tint': '#2b6954',
      },
      fontFamily: {
        'headline': ['Plus Jakarta Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'label': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '1rem',
        'lg': '2rem',
        'xl': '3rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}