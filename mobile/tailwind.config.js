/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#059669', // Emerald-600
          dark: '#10B981',  // Emerald-500
        },
        bg: {
          light: '#ffffff',
          dark: '#000000',
        },
        el: {
          light: '#F0F0F3',
          dark: '#212225',
        },
        sel: {
          light: '#E0E1E6',
          dark: '#2E3135',
        },
        txt: {
          light: '#000000',
          dark: '#ffffff',
          sec: {
            light: '#60646C',
            dark: '#B0B4BA',
          }
        }
      },
    },
  },
  plugins: [],
};
