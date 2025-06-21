/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#B34136",
        },
        dark: {
          100: "#F1EEE3",
          200: "#202020",
          300: "#252525",
          400: "#191919",
        },
        light: {
          500: "#26212A",
          600: "#E4DEE4",
          700: "#FFFFFF",
          800: "#F4F3F3",
        },
        "accent-blue": "#1DA1F2",
        "book-detail": "#B34136",
        "book-background": "#F1EEE3",
        "custom-red": "#B34136",
      },
      fontFamily: {
        mthin: ["Montserrat-Thin", "sans-serif"],
        mextralight: ["Montserrat-ExtraLight", "sans-serif"],
        mlight: ["Montserrat-Light", "sans-serif"],
        mregular: ["Montserrat-Regular", "sans-serif"],
        mmedium: ["Montserrat-Medium", "sans-serif"],
        msemibold: ["Montserrat-SemiBold", "sans-serif"],
        mbold: ["Montserrat-Bold", "sans-serif"],
        mextrabold: ["Montserrat-ExtraBold", "sans-serif"],
        mblack: ["Montserrat-Black", "sans-serif"],
        jsemibold: ["JosefinSans-SemiBold", "sans-serif"],
      },
      // boxShadow: {
      //   "light-100":
      //     "0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px rgba(184, 184, 184, 0.02), 0px 2px 4px 0px rgba(184, 184, 184, 0.03)",
      //   "light-200": "10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
      //   "light-300": "-10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
      //   "dark-100": "0px 2px 10px 0px rgba(46, 52, 56, 0.10)",
      //   "dark-200": "2px 0px 20px 0px rgba(39, 36, 36, 0.04)",
      // },
      // backgroundImage: {
      //   "auth-dark": "url('/assets/images/auth-dark.png')",
      //   "auth-light": "url('/assets/images/auth-light.png')",
      // },
      // screens: {
      //   xs: "420px",
      // },
      // keyframes: {
      //   "accordion-down": {
      //     from: { height: 0 },
      //     to: { height: "var(--radix-accordion-content-height)" },
      //   },
      //   "accordion-up": {
      //     from: { height: "var(--radix-accordion-content-height)" },
      //     to: { height: 0 },
      //   },
      // },
      // animation: {
      //   "accordion-down": "accordion-down 0.2s ease-out",
      //   "accordion-up": "accordion-up 0.2s ease-out",
      // },
    },
  },
  plugins: [],
};
