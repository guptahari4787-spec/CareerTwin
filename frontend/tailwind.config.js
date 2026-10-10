/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Master Structural & Canvas Tokens (Pigeon + Almond Blossom + Acid Lime)
        charcoal: "#E8D8D0", // Backward safety alias for Almond Blossom
        background: "#151922", // Deep Pigeon canvas
        foreground: "#E8D8D0", // Almond Blossom primary text
        surface: "#252B36", // Pigeon surface / cards / panels
        "surface-subtle": "#1D222C", // Secondary Pigeon bg / sidebar
        "surface-elevated": "#303743", // Pigeon elevated / hover / headers
        "surface-card": "#252B36", // Pigeon card surface
        border: "#3A4250", // Pigeon border / dividers
        "border-subtle": "#252B36",
        "border-strong": "#5B6472", // Pigeon base strong border

        // PRIMARY STRUCTURAL — PIGEON (60-70% visual volume)
        pigeon: {
          950: "#151922", // Deep Pigeon main bg
          900: "#1D222C", // Secondary bg / sidebar
          800: "#252B36", // Card / Panel base surface
          700: "#303743", // Elevated hover / header
          600: "#3A4250", // Distinct border
          500: "#5B6472", // Pigeon base
          400: "#7A8494", // Muted accent border
          300: "#9FA5AF", // Muted label
          200: "#C0C7D1",
          100: "#E1E5EB",
          DEFAULT: "#252B36",
        },

        // CONTENT & READABILITY — ALMOND BLOSSOM (20-25% visual volume)
        almond: {
          50: "#FAF6F3",
          100: "#F5ECE6", // Lightest warm tint
          200: "#E8D8D0", // Primary text & headings (no pure white)
          300: "#DFC8BE",
          400: "#C9B9B1", // Secondary text & labels
          500: "#B4A299",
          600: "#9FA5AF", // Muted captions & subtle text
          DEFAULT: "#E8D8D0",
          heading: "#E8D8D0",
          body: "#E8D8D0",
          secondary: "#C9B9B1",
          muted: "#9FA5AF",
        },

        // PRIMARY SIGNAL — ACID LIME (5-10% visual volume)
        acid: {
          950: "#182000",
          900: "#283300",
          800: "rgba(199, 240, 0, 0.12)", // Soft badge background
          700: "#849F00", // Darker lime / border accent
          600: "#A8CC00",
          500: "#C7F000", // Acid Lime primary signal (buttons, active states, key CTAs)
          400: "#D9F56A", // Hover / lighter accent
          300: "#E4FA8A",
          200: "#EFFCC0",
          100: "#F8FFE0",
          50: "#FAFFF0",
          DEFAULT: "#C7F000",
          primary: "#C7F000",
          dark: "#849F00",
          bright: "#D9F56A",
          soft: "rgba(199, 240, 0, 0.12)",
          text: "#151922", // Text on acid lime buttons
        },

        lime: {
          950: "#182000",
          900: "#283300",
          800: "rgba(199, 240, 0, 0.12)",
          700: "#849F00",
          600: "#A8CC00",
          500: "#C7F000",
          400: "#D9F56A",
          300: "#E4FA8A",
          200: "#EFFCC0",
          100: "#F8FFE0",
          50: "#FAFFF0",
          DEFAULT: "#C7F000",
        },

        // Backward compatibility mapping: soil -> Pigeon
        soil: {
          950: "#151922",
          900: "#1D222C",
          800: "#252B36",
          700: "#303743",
          600: "#3A4250",
          500: "#3A4250",
          400: "#5B6472",
          300: "#9FA5AF",
          200: "#C9B9B1",
          100: "#E8D8D0",
          50: "#F5ECE6",
          DEFAULT: "#252B36",
        },

        // Backward compatibility mapping: cream -> Almond Blossom
        cream: {
          50: "#FAF6F3",
          100: "#F5ECE6",
          200: "#E8D8D0",
          300: "#DFC8BE",
          400: "#C9B9B1",
          500: "#9FA5AF",
          600: "#8B929D",
          DEFAULT: "#E8D8D0",
          heading: "#E8D8D0",
          body: "#E8D8D0",
          secondary: "#C9B9B1",
          muted: "#9FA5AF",
        },

        // Backward compatibility mapping: basil -> Acid Lime
        basil: {
          950: "#182000",
          900: "#283300",
          800: "rgba(199, 240, 0, 0.12)",
          700: "#849F00",
          600: "#A8CC00",
          500: "#C7F000",
          400: "#D9F56A",
          300: "#E4FA8A",
          200: "#EFFCC0",
          100: "#F8FFE0",
          50: "#FAFFF0",
          DEFAULT: "#C7F000",
          primary: "#C7F000",
          dark: "#849F00",
          bright: "#D9F56A",
          soft: "rgba(199, 240, 0, 0.12)",
        },

        // ATTENTION / WARNING — CORAL
        tomato: {
          950: "#2A1110",
          900: "#3D1715",
          800: "rgba(224, 90, 71, 0.15)",
          700: "#8F2C22",
          600: "#B83A2E",
          500: "#E05A47",
          400: "#EB796A",
          300: "#F3A196",
          200: "#F9CBC5",
          100: "#FCE8E5",
          50: "#FDF5F4",
          DEFAULT: "#E05A47",
          primary: "#E05A47",
          dark: "#8F2C22",
          soft: "rgba(224, 90, 71, 0.15)",
        },

        // Backward compatibility mapping: paper -> Pigeon
        paper: {
          bg: "#151922",
          surface: "#252B36",
          subtle: "#1D222C",
          muted: "#303743",
          border: "#3A4250",
          borderDark: "#5B6472",
          DEFAULT: "#151922",
        },

        card: {
          DEFAULT: "#252B36",
          foreground: "#E8D8D0",
        },
        popover: {
          DEFAULT: "#252B36",
          foreground: "#E8D8D0",
        },
        muted: {
          DEFAULT: "#1D222C",
          foreground: "#9FA5AF",
        },
        secondary: {
          DEFAULT: "#303743",
          foreground: "#E8D8D0",
        },
        ring: "#C7F000",
        accent: {
          DEFAULT: "#C7F000",
          hover: "#D9F56A",
          light: "rgba(199, 240, 0, 0.12)",
          border: "#849F00",
        },
        status: {
          green: "#C7F000",
          "green-light": "rgba(199, 240, 0, 0.12)",
          amber: "#E5A93C",
          "amber-light": "rgba(229, 169, 60, 0.15)",
          rose: "#E05A47",
          "rose-light": "rgba(224, 90, 71, 0.15)",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.35)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.45), 0 2px 4px -2px rgba(0, 0, 0, 0.35)',
        'card': '0 8px 16px -2px rgba(0, 0, 0, 0.45)',
        'sheet': '0 16px 32px -4px rgba(0, 0, 0, 0.55)',
      }
    },
  },
  plugins: [],
}
