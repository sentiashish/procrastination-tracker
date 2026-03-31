/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6",
        secondary: "#14B8A6",
        landingLight: "#F8FAFC",
        cardLight: "#FFFFFF",
        dashboardDark: "#020617",
        dashboardDarkAlt: "#0F172A",
        dashboardActive: "#1E293B",
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        body: ["Sora", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glass: "0 12px 30px rgba(2, 6, 23, 0.18)",
      },
    },
  },
  plugins: [],
};
