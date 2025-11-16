/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A5F",
        accent: "#D4AF37",
        success: "#10B981",
        warning: "#F59E0B",
        info: "#3B82F6",
        error: "#EF4444",
      },
    },
  },
  plugins: [],
};

