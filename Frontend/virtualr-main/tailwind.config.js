/** @type {import('tailwindcss').Config} */
export default {
   important: true,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
  warm: {
    bg: "#FEFEFE",
    primary: "#6b2b48ff",
    accent: "#F8DCA7",
    soft: "#9D7866",
    grayish: "#ACB9CA",
    cardbg: "#FCFAF6",          // ← NEW: soft card background
    border: "#D1D8C5",      // new: soft olive border
    button: "#5F6F4D",     // optional: olive green button
    buttonText: "#FAF9F5", // optional: light text on button
  },
},
      fontFamily: {
        sans: ["Poppins", "sans-serif"],       // body text
        serif: ["Playfair Display", "serif"],  // headings
      },
    },
  },
  plugins: [],
};
