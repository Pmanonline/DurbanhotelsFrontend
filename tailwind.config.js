module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",

        // ── GOLD / AMBER ─────────────────────────────────────────────
        // The orange-yellow used for buttons, headings & accents
        gold: {
          50: "#FFF8E7",
          100: "#FEEFC4",
          200: "#FDDC85",
          300: "#FCC846",
          400: "#F5A623", // main brand gold (light-mode default)
          500: "#E08B00",
          600: "#B86E00",
          700: "#8A5100",
          800: "#5C3600",
          900: "#2E1A00",
          DEFAULT: "#F5A623",
          dark: "#FCC846", // slightly brighter for dark-mode contrast
        },

        // ── NAVY / DARK BLUE ─────────────────────────────────────────
        // The deep navy used for backgrounds, footer & dark surfaces
        navy: {
          50: "#E8ECF4",
          100: "#C6D0E5",
          200: "#8EA1CB",
          300: "#5572B1",
          400: "#2B4490",
          500: "#152A5E", // mid navy
          600: "#0F1D3A", // main dark background (light-mode surfaces)
          700: "#0A1428",
          800: "#060C18",
          900: "#020408",
          950: "#020408",
          DEFAULT: "#0F1D3A",
          light: "#152A5E", // card / section backgrounds
          darkMode: "#060C18", // deepest shade for dark-mode body
        },

        // ── WHITE / BASE ─────────────────────────────────────────────
        white: "#FFFFFF",

        // ── SEMANTIC SHORTCUTS ───────────────────────────────────────
        brand: {
          accent: "#F5A623", // gold — buttons, highlights
          bg: "#0F1D3A", // navy — main dark background
          bgLight: "#152A5E", // navy light — cards on dark bg
          accentDark: "#FCC846", // gold bright — dark-mode accents
        },
      },

      // ── BACKGROUND GRADIENTS ────────────────────────────────────────
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to bottom, rgba(15,29,58,0.25), rgba(15,29,58,0.85))",
        "hero-gradient-dark":
          "linear-gradient(to bottom, rgba(6,12,24,0.45), rgba(6,12,24,0.95))",
        "gold-shine":
          "linear-gradient(135deg, #F5A623 0%, #FCC846 50%, #F5A623 100%)",
      },

      // ── SHADOWS ─────────────────────────────────────────────────────
      boxShadow: {
        "gold-glow": "0 0 20px rgba(245,166,35,0.45)",
        "gold-glow-lg": "0 0 40px rgba(245,166,35,0.55)",
        "navy-card": "0 4px 24px rgba(15,29,58,0.35)",
      },

      // ── FONTS ───────────────────────────────────────────────────────
      fontFamily: {
        heading: ["'Cormorant Garamond'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        accent: ["'Cinzel'", "serif"],
        montserrat: ["'Cormorant Garamond'", "serif"],
        inter: ["'DM Sans'", "sans-serif"],
      },

      // ── ANIMATIONS ──────────────────────────────────────────────────
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "gold-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245,166,35,0.3)" },
          "50%": { boxShadow: "0 0 35px rgba(245,166,35,0.65)" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "gold-pulse": "gold-pulse 2s ease-in-out infinite",
      },

      // ── BREAKPOINTS (kept from original) ────────────────────────────
      screens: {
        xs: "400px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        mod: { max: "639px" },
        expcard: { max: "1066px" },
        minilg: { min: "899px" },
        maxlg: { max: "900px" },
        mid: { max: "767px" },
        Nlg: { max: "1023px" },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
