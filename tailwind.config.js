/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#070708',
          surface: 'rgba(18, 18, 20, 0.95)',
          'surface-strong': 'rgba(12, 12, 14, 0.96)',
          'surface-soft': 'rgba(255, 255, 255, 0.06)',
          text: '#eef2ff',
          muted: 'rgba(238, 242, 255, 0.75)',
          border: 'rgba(255, 138, 0, 0.16)',
          accent: '#ff9d2b',
          'accent-soft': 'rgba(255, 156, 44, 0.16)',
        },
        light: {
          bg: '#f4e9dc',
          surface: 'rgba(255, 249, 239, 0.94)',
          'surface-strong': '#fff8ef',
          'surface-soft': 'rgba(245, 235, 216, 0.86)',
          text: '#1f1a14',
          muted: '#625543',
          border: 'rgba(112, 90, 68, 0.18)',
          accent: '#b77f2c',
          'accent-soft': 'rgba(183, 127, 44, 0.16)',
        },
      },
      boxShadow: {
        'dark': '0 24px 70px rgba(0, 0, 0, 0.33)',
        'light': '0 20px 50px rgba(92, 72, 50, 0.14)',
      },
    },
  },
  plugins: [],
}
