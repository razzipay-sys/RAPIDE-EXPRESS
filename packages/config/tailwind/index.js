const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        rapide: {
          orange: '#FF6B00',
          'orange-light': '#FF8C3A',
          'orange-dark': '#E55A00',
          'orange-muted': 'rgba(255, 107, 0, 0.12)',
        },
        dark: {
          DEFAULT: '#0A0A0F',
          surface: '#12121A',
          'surface-2': '#1A1A26',
          'surface-3': '#22223A',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-strong': 'rgba(255, 255, 255, 0.16)',
        },
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        display: ['Plus Jakarta Sans', ...fontFamily.sans],
      },
      backgroundImage: {
        'rapide-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FF8C3A 100%)',
        'rapide-gradient-subtle': 'linear-gradient(135deg, rgba(255,107,0,0.15) 0%, rgba(255,140,58,0.05) 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0F 0%, #12121A 100%)',
        'glass': 'rgba(255, 255, 255, 0.03)',
      },
      boxShadow: {
        'rapide': '0 0 40px rgba(255, 107, 0, 0.15)',
        'rapide-lg': '0 0 80px rgba(255, 107, 0, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.7' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
