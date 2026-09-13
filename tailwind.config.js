/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vapi: {
          50: '#f0fdfa',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        charcoal: {
          950: '#0b0f17',
          900: '#111722',
          800: '#182132',
          700: '#222f46',
          600: '#334460',
        },
        navy: {
          950: '#060b18',
          900: '#0a1228',
          800: '#0f1d40',
          700: '#182c60',
          600: '#244084',
        },
        neon: {
          cyan: '#00f2fe',
          emerald: '#10b981',
          lime: '#10e760',
          glow: 'rgba(0, 242, 254, 0.4)',
        }
      },
      boxShadow: {
        'neon': '0 0 20px -3px rgba(0, 242, 254, 0.35)',
        'neon-strong': '0 0 30px 2px rgba(0, 242, 254, 0.5)',
        'neon-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
