/** @type {import('tailwindcss').Config} */

const {nextui} = require("@nextui-org/react");
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './@/components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
  theme: {
    extend: {
      maxWidth:{
        "4/5":'80%',
        '1/2':"50%",
        '1/3':"33%",
        '1/5':'20%'
      },boxShadow:{
        '3xl':'7px 3px 22px 14px rgba(0, 0, 0, 0.19); ',
        '4xl':' 0px 22px 70px 4px rgba(0, 0, 0, 0.56);'
      },
      backgroundColor:{
        "slash-hover":'rgba(55, 53, 47, 0.25);'
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      minWidth:{
        '1/5':'20%'
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}