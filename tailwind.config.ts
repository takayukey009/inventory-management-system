import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7B8B6F',
          50: '#F4F6F2',
          100: '#E8ECE5',
          200: '#D4DCCD',
          300: '#B9C5AF',
          400: '#9DAD91',
          500: '#7B8B6F',
          600: '#626F58',
          700: '#4A5342',
          800: '#31372C',
          900: '#191C16',
          950: '#0C0E0B',
        },
        accent: {
          DEFAULT: '#E8B87D',
          50: '#FDF9F4',
          100: '#FAF2E8',
          200: '#F5E3D0',
          300: '#F0D4B8',
          400: '#EBC69A',
          500: '#E8B87D',
          600: '#D19654',
          700: '#A6743C',
          800: '#7A5225',
          900: '#4E340D',
          950: '#251A06',
        },
      },
      backgroundColor: {
        base: '#FAFAF8',
      },
    },
  },
  plugins: [],
};

export default config;
