/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        mainColor: "#00838f",
        secColor: "#a0aec0",
        textBlue: "#00468b",
      },
    },
  },
  plugins: [],
};
