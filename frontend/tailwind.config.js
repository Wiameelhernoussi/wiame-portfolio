/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        majorelle: {
          DEFAULT: "#2B3FA3",
          light: "#E4E8F8",
          dark: "#7E92F2",
          darkSurface: "#1F2552",
        },
        saffron: {
          DEFAULT: "#E9A21F",
          light: "#FDF5E7",
          dark: "#F2B33D",
        },
        ink: {
          DEFAULT: "#16193A",
          dark: "#EEF0FB",
        },
        canvas: {
          light: "#F5F6FB",
          dark: "#0F1226",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#171B3A",
        },
        muted: {
          light: "#5B6085",
          dark: "#A3A9D1",
        },
        line: {
          light: "#DADDEB",
          dark: "#2A2F5C",
        }
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        prose: "75ch",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        }
      }
    },
  },
  plugins: [],
}
