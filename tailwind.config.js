/** @type {import('tailwindcss').Config} */


import {COLOR} from './src/store/ThemeColor';


module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
    colors: {
      themeColor:COLOR.themeColor,
      hoverLightGray:COLOR.hoverLightGray,
      // hovercustomWhite:COLOR.hovercustomWhite,
      hovercustomBlack:COLOR.hovercustomBlack,
      customLightBlack:COLOR.customLightBlack,
      customRealWhite:COLOR.customRealWhite,
      customBlack:COLOR.customBlack,
      customWhite:COLOR.customWhite,
      customGray:COLOR.customGray,
      customborderLightGray:COLOR.customborderLightGray,
      customborderDarkGray:COLOR.customborderDarkGray,
      customRed:COLOR.customRed,
      customBlue:COLOR.customBlue
    },
    backgroundColor:{
      themeColor:COLOR.themeColor,
      hoverLightGray:COLOR.hoverLightGray,
      hovercustomBlack:COLOR.hovercustomBlack,
      customBlack:COLOR.customBlack,
      customWhite:COLOR.customWhite,
      customGray:COLOR.customGray,
      customLightGray:COLOR.customLightGray,
      customRed:COLOR.customRed,
      customBlue:COLOR.customBlue
    },
    top:{
      2.5:'0.6rem'
    },
      width:{
        54:'12rem',
        59:'14.5rem',
        100:'28rem',
        104:'32rem',
        108:'36rem',
        112:'40rem',
        116:'44rem',
        120:'48rem',
        124:'52rem',
        150:'80rem',
      },
      height:{
        59:'14.9rem',
        90:'26.3rem',
        100:'28rem',
        104:'32rem',
        108:'36rem',
        112:'40rem',
        116:'44rem',
        120:'48rem',
        124:'52rem',
        150:'80rem',
        overHeight:'120vh'
      },
      maxHeight:{
        124: '52rem'
      },
      right:{
        200:'36rem'
      },
      left:{
        111:'1.65rem'
      }
    },
  },
  plugins: [],
}

