/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        serva: {
          teal: '#0F766E',
          'teal-dark': '#134E4A',
          'teal-deeper': '#0D3D38',
          'teal-light': '#E6F4F2',
          'teal-50': '#F0FAF9',
          lime: '#C7F36B',
          'lime-dark': '#A3D93A',
          'lime-light': '#E8FBBA',
          bg: '#F7F9F8',
          card: '#FFFFFF',
          text: '#17211F',
          muted: '#64716D',
          border: '#E3EAE7',
          'border-light': '#F0F4F2',
          success: '#15803D',
          'success-light': '#DCFCE7',
          warning: '#D97706',
          'warning-light': '#FEF3C7',
          error: '#DC2626',
          'error-light': '#FEE2E2',
          info: '#0284C7',
          'info-light': '#E0F2FE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'hero-sm': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        'page-title': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'section-title': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'premium': '0 20px 25px -5px rgba(15, 118, 110, 0.08), 0 10px 10px -5px rgba(15, 118, 110, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -3px rgba(0, 0, 0, 0.04)',
        'glow-teal': '0 0 20px rgba(15, 118, 110, 0.15)',
        'glow-lime': '0 0 20px rgba(199, 243, 107, 0.25)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      animation: {
        'subtle-float': 'subtle-float 5s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-medium': 'float-medium 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.4s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        'particle-float': 'particle-float 15s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'subtle-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-8px) translateX(4px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'particle-float': {
          '0%': { transform: 'translate(0, 0) rotate(0deg)', opacity: 0 },
          '10%': { opacity: 0.6 },
          '50%': { transform: 'translate(100px, -200px) rotate(180deg)', opacity: 0.3 },
          '90%': { opacity: 0.6 },
          '100%': { transform: 'translate(0, 0) rotate(360deg)', opacity: 0 },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(199, 243, 107, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(199, 243, 107, 0.25)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
