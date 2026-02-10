import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animations: {
        border: 'border 4s linear infinite',
      },
      keyframes: {
        border: {
          to: {
            "--border-angle": "360deg",
          }
        }
      },
    },
  },
  plugins: [
    daisyui
  ],
};