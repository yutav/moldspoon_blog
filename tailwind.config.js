/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideInTop: {
          "0%": { transform: "translateY(-1000px)", opacity: "0" },
          "20%": { transform: "translateY(0)", opacity: "1" },
          "80%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-1000px)", opacity: "0" }
        },
        slideInFwdCenter: {
          "0%": { transform: "translateZ(-1400px)", opacity: 0 },
          "100%": { transform: "translateZ(0)", opacity: 1 },
        },
        flashFade: {
          "0%": { transform: "translateX(180px)", opacity: 0 },
          "20%": { transform: "translateX(0)", opacity: 1 },
          "80%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(180px)", opacity: 0 },
        },
        textFocusIn: {
          "0%": {
            filter: "blur(12px)",
            opacity: "0"
          },
          "100%": {
            filter: "blur(0)",
            opacity: "1"
          }
        },
        fadeIn: {
          "0%": {
            opacity: "0"
          },
          "100%": {
            opacity: "1"
          }
        },
        slideInFwdLeft: {
          "0%": {
            transform: "translateZ(-20px) translateX(-20px)",
            opacity: "0"
          },
          "100%": {
            transform: "translateZ(0) translateX(0)",
            opacity: "1"
          }
        }
      },
      animation: {
        slideInTop: "slideInTop 3.0s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        slideInFwdCenter: "slideInFwdCenter 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
        slideInFwdLeft: "slideInFwdLeft 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
        flashShort: "flashFade 1.0s forwards",
        fadeIn: "fadeIn 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000)   both",
        textFocusIn: "textFocusIn 1.0s cubic-bezier(0.550, 0.085, 0.680, 0.530)   both"
      },
    },
  },
  plugins: [],
}
