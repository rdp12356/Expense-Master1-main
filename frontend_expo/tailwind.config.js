/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#10b981", // Emerald 500
        background: "#0f172a", // Slate 900
        card: "#1e293b", // Slate 800
        textPrimary: "#f8fafc", // Slate 50
        textSecondary: "#94a3b8", // Slate 400
        danger: "#ef4444", // Red 500
      }
    },
  },
  plugins: [],
}
