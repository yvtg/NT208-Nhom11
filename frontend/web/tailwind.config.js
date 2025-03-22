/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}" 
  ],
  theme: {
    extend: {
      colors: {
        darkPrimary: "#303F9F",
        accentColor: "#9E9E9E",
        secondaryText: "#757575",
        divideColor: "#BDBDBD",
        lightPrimary: "#C5CAE9",
        Primary: "#3F51B5",
        PrimaryText: "#212121",
      },
    },
  },
  plugins: [],
}

