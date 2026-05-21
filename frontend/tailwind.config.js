/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        abyss: {
          DEFAULT: '#0A0A0F',
          50: '#12121A',
          100: '#1A1A25',
          200: '#222233',
          300: '#2A2A40',
        },
        purple: {
          neon: '#B44CFF',
          deep: '#7B2FFF',
          royal: '#5B1AE6',
          dark: '#2D0080',
        },
        pink: {
          neon: '#FF3D8E',
          hot: '#FF69B4',
          soft: '#FF8FAB',
        },
        lilac: {
          light: '#D4A5FF',
          DEFAULT: '#C38BFF',
          dark: '#9B6BFF',
        },
        night: {
          DEFAULT: '#0A0A0F',
          card: '#12121A',
          border: '#1E1E2E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-purple': 'glowPurple 2s ease-in-out infinite alternate',
        'glow-pink': 'glowPink 2.5s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-lilac': 'pulseLilac 2s ease-in-out infinite',
      },
      keyframes: {
        glowPurple: {
          '0%': { 
            boxShadow: '0 0 15px rgba(180, 76, 255, 0.3), 0 0 40px rgba(123, 47, 255, 0.15)' 
          },
          '100%': { 
            boxShadow: '0 0 30px rgba(180, 76, 255, 0.6), 0 0 80px rgba(123, 47, 255, 0.3), 0 0 120px rgba(180, 76, 255, 0.1)' 
          },
        },
        glowPink: {
          '0%': { 
            boxShadow: '0 0 15px rgba(255, 61, 142, 0.3), 0 0 40px rgba(255, 105, 180, 0.15)' 
          },
          '100%': { 
            boxShadow: '0 0 30px rgba(255, 61, 142, 0.6), 0 0 80px rgba(255, 105, 180, 0.3)' 
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-300% 0' },
          '100%': { backgroundPosition: '300% 0' },
        },
        pulseLilac: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
      },
    },
  },
  plugins: [],
}
