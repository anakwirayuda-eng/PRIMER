/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        // Fluid responsive sizes — replace text-[10px] everywhere
        'tag': ['clamp(0.75rem, 0.7rem + 0.15vw, 0.875rem)', { lineHeight: '1.4' }],   // 12→14px (pills, badges)
        'caption': ['clamp(0.6875rem, 0.65rem + 0.15vw, 0.8125rem)', { lineHeight: '1.4' }], // 11→13px (micro labels)
        'body-sm': ['clamp(0.8125rem, 0.75rem + 0.2vw, 0.9375rem)', { lineHeight: '1.5' }],  // 13→15px (small body)
        'body-fluid': ['clamp(0.9375rem, 0.875rem + 0.2vw, 1.125rem)', { lineHeight: '1.6' }], // 15→18px (body)
      },
      fontFamily: {
        display: ["'Audiowide'", "'Orbitron'", "sans-serif"],
        data: ["'Orbitron'", "monospace"],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'particle-float': {
          '0%': { transform: 'translateY(0px) scale(1)', opacity: '0.5' },
          '100%': { transform: 'translateY(-25px) scale(1.4)', opacity: '0.15' },
        },
        sway: {
          '0%, 100%': { transform: 'translateX(-50%) rotate(-2deg)' },
          '50%': { transform: 'translateX(-50%) rotate(2deg)' },
        },
        fly: {
          from: { left: '-100px', transform: 'scale(1)' },
          to: { left: '120%', transform: 'scale(1.2)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideRight: 'slideRight 0.3s ease-out',
        slideUp: 'slideUp 0.4s ease-out forwards',
        'particle-float': 'particle-float 10s ease-in-out infinite alternate',
        sway: 'sway 3s ease-in-out infinite',
        fly: 'fly var(--speed) linear forwards',
      },
      zIndex: {
        hud: '60',
        modal: '100',
        'modal-close': '101',
        critical: '200',
        tooltip: '1000',
      },
    },
  },
  plugins: [],
}
