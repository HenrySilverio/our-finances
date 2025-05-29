/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'off-white': '#f5f2d0',
        'dark-blue': '#000080',
        'off-white-lighter': '#faf8e8',
        'off-white-darker': '#e8e5c3',
        'dark-blue-lighter': '#0000a6',
        'dark-blue-darker': '#00005c',
        'accent-success': '#2e7d32',
        'accent-danger': '#c62828',
        'accent-warning': '#f9a825',
        'accent-info': '#0277bd',
        'chart-color-1': '#4285f4',
        'chart-color-2': '#ea4335',
        'chart-color-3': '#fbbc05',
        'chart-color-4': '#34a853',
        'chart-color-5': '#8e24aa',
        'chart-color-6': '#16537e',
        'text-primary': '#212121',
        'text-secondary': '#424242',
        'text-tertiary': '#757575',
        'text-on-dark': '#ffffff',
      },
      backgroundColor: {
        'primary': '#f5f2d0',
        'secondary': '#e8e5c3',
        'tertiary': '#ffffff',
      },
      textColor: {
        'on-light': '#000080',
      },
      borderColor: {
        'light': '#e0e0e0',
        'medium': '#bdbdbd',
        'dark': '#000080',
      },
      boxShadow: {
        'light': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 8px rgba(0, 0, 0, 0.12)',
        'dark': '0 8px 16px rgba(0, 0, 0, 0.14)',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
