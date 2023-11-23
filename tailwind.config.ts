import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'default': "linear-gradient(168deg, #FDE181 -2%, #FE8F00 30.77%, #FF4640 55.4%, #3E41CB 102.59%)"
      },
      backgroundSize: {
        '100%': '100% 100%',
      },
      screens: {
        'dthover': {'raw': '(hover: hover)'},
      }
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}

export default config
