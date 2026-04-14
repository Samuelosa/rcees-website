import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // UENR-inspired blue primary + bright yellow accent
        // Existing "maroon"/"forest" class names are kept as aliases so
        // every component updates automatically via the token swap.
        maroon: {
          DEFAULT: "#072E5C",
          50: "#EEF3FB",
          100: "#D5E0F1",
          200: "#9EB6DB",
          500: "#1A528F",
          600: "#0E3F75",
          700: "#072E5C",
          800: "#052142",
          900: "#031529",
          950: "#020E1A",
        },
        forest: {
          DEFAULT: "#072E5C",
          50: "#EEF3FB",
          100: "#D5E0F1",
          600: "#0E3F75",
          700: "#072E5C",
          800: "#052142",
          900: "#031529",
        },
        sun: {
          DEFAULT: "#EBE72D",
          400: "#F4F05A",
          500: "#EBE72D",
          600: "#D4D028",
          700: "#A8A51F",
        },
        gold: {
          DEFAULT: "#EBE72D",
          600: "#D4D028",
        },
        terracotta: "#C9513A",
        teal: { DEFAULT: "#3A1411", 600: "#2B0E0B" },
        ink: "#1F1D1D",
        paper: "#FAF8F1",
        cream: "#F4EFDC",
        mist: "#F2EDDC",
        rule: "#E4DED0",
        muted: "#6B6967",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 7vw + 1rem, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem, 5vw + 1rem, 5rem)", { lineHeight: "1", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(2rem, 3vw + 1rem, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      maxWidth: { prose: "68ch" },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out both",
        marquee: "marquee 45s linear infinite",
        spinSlow: "spinSlow 22s linear infinite",
        blink: "blink 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
