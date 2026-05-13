/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyber: {
          50: "#e0fbff",
          100: "#b0f4ff",
          200: "#7eedff",
          300: "#4ae6ff",
          400: "#00d4f5",
          500: "#00b8d9",
          600: "#0090a8",
          700: "#006878",
          800: "#004050",
          900: "#001a22",
        },
        neural: {
          900: "#040d1a",
          800: "#071528",
          700: "#0a1f3a",
          600: "#0e2a4d",
          500: "#133060",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["'DM Sans'", "sans-serif"],
      },
      backgroundImage: {
        "neural-grid": "radial-gradient(circle at 1px 1px, rgba(0,212,245,0.08) 1px, transparent 0)",
        "cyber-glow": "radial-gradient(ellipse at center, rgba(0,212,245,0.15) 0%, transparent 70%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      boxShadow: {
        cyan: "0 0 30px rgba(0,212,245,0.3)",
        "cyan-sm": "0 0 10px rgba(0,212,245,0.2)",
        "cyan-lg": "0 0 60px rgba(0,212,245,0.4)",
        glass: "0 8px 32px rgba(0,0,0,0.4)",
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(0,212,245,0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(0,212,245,0.7)" },
        },
      },
    },
  },
  plugins: [],
};
