import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAF6F0",
          100: "#F5EFE6",
          200: "#EAE3DA",
        },
        sand: {
          surface: "#F3ECE3",
          border: "#EAE3DA",
          muted: "#DDD3C6",
        },
        terracotta: {
          DEFAULT: "#C1785A",
          hover: "#A86347",
          light: "#E8D8CE",
          dark: "#8C462C",
          subtle: "#F5EDE7",
        },
        peach: {
          50: "#FDF8F5",
          100: "#FCEEE8",
          200: "#F5E6DF",
          300: "#E8D8CE",
        },
        brown: {
          900: "#2C2725",
          800: "#3D3532",
          700: "#4A423D",
          600: "#6E6663",
          500: "#8F8178",
          400: "#DDD3C6",
        },
        amberWarm: {
          DEFAULT: "#C98A2C",
          light: "#FDF2E2",
          border: "#F2DEBF",
          dark: "#946114",
        }
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        'warm': "0 10px 30px -5px rgba(193, 120, 90, 0.15)",
        'warm-lg': "0 20px 40px -10px rgba(193, 120, 90, 0.25)",
        'card': "0 8px 24px -4px rgba(44, 39, 37, 0.06)",
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.92', transform: 'scale(1.015)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
