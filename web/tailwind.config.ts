import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B97A1A',
          50: '#FDF6E8',
          100: '#FAE9C4',
          200: '#F5D48E',
          300: '#EDB94A',
          400: '#D99520',
          500: '#B97A1A',
          600: '#965F12',
          700: '#72460C',
          800: '#4E2F07',
          900: '#301C03',
        },
        spice: {
          DEFAULT: '#C4593A',
          100: '#FAE8E3',
          300: '#E5967E',
          500: '#C4593A',
          700: '#8F3A22',
        },
        dark: {
          bg: '#160F08',
          surface: '#231710',
          card: '#2E1D11',
          border: '#3E2A18',
          text: '#F5EDE0',
          muted: '#9E7E58',
        },
        light: {
          bg: '#FBF7F0',
          surface: '#FFFFFF',
          card: '#FFFDF8',
          border: '#E8DDD0',
          text: '#1C120A',
          muted: '#8B7355',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        card: '0 2px 16px rgba(28,18,10,0.07)',
        'card-hover': '0 16px 48px rgba(28,18,10,0.15)',
        'card-dark': '0 2px 16px rgba(0,0,0,0.32)',
        'card-dark-hover': '0 16px 48px rgba(0,0,0,0.5)',
        warm: '0 4px 20px rgba(185,122,26,0.25)',
        'warm-lg': '0 8px 40px rgba(185,122,26,0.3)',
        'inner-warm': 'inset 0 1px 0 rgba(255,255,255,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-soft': 'bounceSoft 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.93)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #FBF7F0 0%, #F5EDE0 100%)',
        'amber-gradient': 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)',
        'hero-pattern': "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(185,122,26,0.12) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
}

export default config
