/** @type {import('tailwindcss').Config} */
import { COLOR } from './src/store/ThemeColor';

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        pop: {
          '0%': { transform: 'scale(1)' },
          '20%': { transform: 'scale(1.4)' },
          '40%': { transform: 'scale(1.3)' },
          '60%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1)' },
        },
        'pulse-scale': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        pop: 'pop 0.4s ease-in-out',
        'pulse-scale': 'pulse-scale 3s ease-in-out infinite',
      },
      colors: {
        themeColor: COLOR.themeColor,
        hoverLightGray: COLOR.hoverLightGray,
        hovercustomBlack: COLOR.hovercustomBlack,
        customLightBlack: COLOR.customLightBlack,
        customRealWhite: COLOR.customRealWhite,
        customBlack: COLOR.customBlack,
        customWhite: COLOR.customWhite,
        customGray: COLOR.customGray,
        customborderLightGray: COLOR.customborderLightGray,
        customborderDarkGray: COLOR.customborderDarkGray,
        customRed: COLOR.customRed,
        customBlue: COLOR.customBlue,
      },
      backgroundColor: {
        themeColor: COLOR.themeColor,
        hoverLightGray: COLOR.hoverLightGray,
        hovercustomBlack: COLOR.hovercustomBlack,
        customBlack: COLOR.customBlack,
        customWhite: COLOR.customWhite,
        customGray: COLOR.customGray,
        customLightGray: COLOR.customLightGray,
        customRed: COLOR.customRed,
        customBlue: COLOR.customBlue,
      },
      top: {
        2.5: '0.6rem',
      },
      width: {
        54: '12rem',
        59: '14.5rem',
        100: '28rem',
        104: '32rem',
        108: '36rem',
        112: '40rem',
        116: '44rem',
        120: '48rem',
        124: '52rem',
        150: '80rem',
      },
      height: {
        59: '14.9rem',
        90: '26.3rem',
        100: '28rem',
        104: '32rem',
        108: '36rem',
        112: '40rem',
        116: '44rem',
        120: '48rem',
        124: '52rem',
        150: '80rem',
        overHeight: '120vh',
      },
      maxHeight: {
        124: '52rem',
      },
      right: {
        200: '36rem',
      },
      left: {
        111: '1.65rem',
      },
      zIndex: {
        0.1: '952',
        0.2: '953',
        0.3: '954',
        0.4: '955',
        0.5: '956',
        0.6: '957',
        0.7: '958',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
};
