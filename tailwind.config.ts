import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        'purple-main': '#9B5CF6',
        'pink-hot': '#E91E8C',
        'blue-accent': '#5B8FF9',
        'navy-dark': '#1E0D3B',
      },
    },
  },
  plugins: [],
};

export default config;
