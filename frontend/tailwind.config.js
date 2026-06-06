/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07111f",
          900: "#0b1628",
          800: "#13213a",
          700: "#1f3354"
        },
        sky: {
          50: "#eef7ff",
          100: "#d6ebff",
          500: "#3b82f6",
          600: "#2563eb"
        },
        mint: {
          400: "#34d399",
          500: "#10b981"
        },
        sun: {
          400: "#fbbf24",
          500: "#f59e0b"
        }
      },
      boxShadow: {
        glow: "0 20px 60px rgba(37, 99, 235, 0.18)"
      },
      backgroundImage: {
        dashboard:
          "radial-gradient(circle at top left, rgba(59,130,246,.25), transparent 32%), radial-gradient(circle at top right, rgba(16,185,129,.18), transparent 28%), linear-gradient(180deg, #06111f 0%, #0b1628 48%, #eef4ff 48%, #eef4ff 100%)"
      }
    }
  },
  plugins: []
};
