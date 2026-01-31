import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'ch-primary': '#9945FF',
        'ch-primary-light': '#B06EFF',
        'ch-secondary': '#14F195',
        'ch-accent': '#00D4FF',
        'ch-dark': '#0A0A1B',
        'ch-dark-light': '#12122B',
        'ch-dark-card': '#1A1A3E',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'slideUp': 'slideUp 0.6s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(153, 69, 255, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(153, 69, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        chainhire: {
          "primary": "#9945FF",
          "secondary": "#14F195",
          "accent": "#00D4FF",
          "neutral": "#1A1A3E",
          "base-100": "#0A0A1B",
          "base-200": "#12122B",
          "base-300": "#1A1A3E",
          "info": "#00D4FF",
          "success": "#14F195",
          "warning": "#FBBF24",
          "error": "#EF4444",
        },
      },
    ],
    darkTheme: "chainhire",
  },
};
export default config;
