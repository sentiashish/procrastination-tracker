/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        secondary: "#14B8A6",
        landingLight: "#F8FAFC",
        cardLight: "#FFFFFF",
        dashboardDark: "#0B1220",
        dashboardDarkAlt: "#111827",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        glass: "0 10px 30px rgba(2, 6, 23, 0.08)",
      },
    },
  },
  plugins: [],
};
