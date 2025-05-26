/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#03045e',
          800: '#023e8a', 
          600: '#0077b6',
          400: '#00b4d8',
          200: '#90e0ef',
          100: '#caf0f8',
        },
        customBlue: '#3B6F96', // ✅ Add this outside "primary"
      },
      fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui'],
  display: ['Montserrat', 'sans-serif'],
  anton: ['Anton', 'sans-serif'],
  bebas: ['Bebas Neue', 'sans-serif'],
},
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
