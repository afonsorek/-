/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "water-texture": "url('./assets/water-texture.png')",
        "card-bg": "url('./assets/card.png')",
      },
      scale: {
        25: "0.25",
        80: "0.8",
        85: "0.85",
      },
    },
  },
  plugins: [],
};

