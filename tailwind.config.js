/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'text-cyan-400', 'text-lime-400', 'text-amber-400', 'text-orange-400',
    'text-rose-400', 'text-sky-400', 'text-purple-400', 'text-yellow-300',
  ],
  theme: {
    extend: {
      colors: {
        'nex-dark': '#020817',
        'nex-darker': '#030B1A',
        'nex-navy': '#071225',
        'nex-cyan': '#18D5FF',
        'nex-blue': '#1DA1FF',
        'nex-text': '#F8FAFC',
        'nex-grey': '#94A3B8',
      },
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(24, 213, 255, 0.3)',
        'glow-cyan-lg': '0 0 40px rgba(24, 213, 255, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(24, 213, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(24, 213, 255, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};
