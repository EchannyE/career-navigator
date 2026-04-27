/** @type {import('tailwindcss').Config} */
export default {
  // Enable class-based dark mode so useDarkMode hook controls it
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        display: ["'Bricolage Grotesque'", "sans-serif"],
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },

      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },

      screens: {
        xs: "480px",
      },

      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.25rem",
          md: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
          "2xl": "3rem",
        },
      },

      animation: {
        "fade-up": "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fadeIn 0.35s ease both",
        "spin-slow": "spin 1.1s linear infinite",
        "pulse-dot": "pulseDot 1.4s ease-in-out infinite",
        "bar-grow": "barGrow 1.2s cubic-bezier(0.22,1,0.36,1) both",
      },

      keyframes: {
        fadeUp: {
          from: {
            opacity: "0",
            transform: "translateY(16px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        fadeIn: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },

        pulseDot: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.4",
            transform: "scale(0.75)",
          },
        },

        barGrow: {
          from: {
            width: "0%",
          },
        },
      },

      backdropBlur: {
        xs: "4px",
      },

      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.07)",
        "card-dark": "0 4px 24px rgba(0,0,0,0.35)",
        glow: "0 4px 20px rgba(37,99,235,0.28)",
      },

      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },

      maxWidth: {
        "8xl": "1440px",
      },
    },
  },

  plugins: [],
};
