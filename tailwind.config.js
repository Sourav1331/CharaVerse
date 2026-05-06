/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f5f0ff',
          100: '#ede0ff',
          200: '#d4b3ff',
          300: '#b980ff',
          400: '#9d4dff',
          500: '#8520ff',
          600: '#6f0fe0',
          700: '#5a0ab8',
          800: '#450890',
          900: '#300568',
        },
        void: '#070510',
        surface: '#0e0b1e',
        card: '#15112a',
        border: '#251f45',
        muted: '#6b5f9e',
        bright: '#c084fc',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(132, 32, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(132, 32, 255, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
