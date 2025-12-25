/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TrueBrew Birdie Design System Colors
        // Primary: Terracotta (warm, inviting)
        terracotta: {
          50: "#FEF5F1",
          100: "#FDEAE3",
          200: "#FBD5C7",
          300: "#F9C0AB",
          400: "#E8926D",
          500: "#C75B39",   // Primary brand color
          600: "#B34D2D",
          700: "#9A3819",
          800: "#7D2E14",
          900: "#5F2210",
          DEFAULT: "#C75B39",
        },
        // Secondary: Sage/Olive (Mediterranean greens)
        sage: {
          50: "#F7F8F4",
          100: "#EFF1E9",
          200: "#E3E7D9",
          300: "#C8D1B9",
          400: "#A4B592",
          500: "#7D8B6C",   // Secondary brand color
          600: "#6B7B5F",
          700: "#556349",
          800: "#3F4B35",
          900: "#2A3322",
          DEFAULT: "#7D8B6C",
        },
        // Background: Warm sand
        sand: {
          50: "#FFFEFA",
          100: "#FAF6F1",   // Primary background
          200: "#F0E4D0",
          300: "#E8D6B8",
          400: "#DFC8A0",
          DEFAULT: "#FAF6F1",
        },
        // Text: Warm ink (not pure black)
        ink: {
          DEFAULT: "#2D2A26",
          light: "#5A5550",
          muted: "#858078",
        },
        // Accent: Golden ochre
        ochre: {
          50: "#FEF9EC",
          100: "#FDF2D9",
          200: "#F8E5B3",
          300: "#E8D699",
          400: "#DFC578",
          500: "#D4A84B",   // Accent color
          600: "#C09439",
          700: "#A67F2E",
          800: "#8C6A24",
          900: "#72551C",
          DEFAULT: "#D4A84B",
        },
        // Surface colors
        parchment: {
          DEFAULT: "#FFFBF5",
          dark: "#F5F0E8",
        },
      },
      fontFamily: {
        // Display: Fraunces (warm editorial serif with personality)
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        // Body: Source Serif 4 (readable, editorial feel)
        body: ["var(--font-source-serif)", "Georgia", "serif"],
        // Accent: Caveat (handwritten for personal touches)
        accent: ["var(--font-caveat)", "cursive"],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'soft': '12px',
        'softer': '16px',
        'organic': '20px',
      },
      boxShadow: {
        'warm-sm': '0 2px 8px rgba(199, 91, 57, 0.08)',
        'warm': '0 4px 16px rgba(199, 91, 57, 0.12)',
        'warm-lg': '0 8px 24px rgba(199, 91, 57, 0.16)',
        'warm-xl': '0 12px 32px rgba(199, 91, 57, 0.2)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
