/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1️⃣ Tell Tailwind where to look for class names
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  
  // 2️⃣ Theme customization
  theme: {
    extend: {
      colors: {
        kariyerBlue: '#CFE2F3',  // your custom color
        // Add more custom colors here
      },
      spacing: {
        // Add custom spacing if needed
      },
      fontFamily: {
        // Add custom fonts here
      }
    },
  },

  // 3️⃣ Plugins
  plugins: [
    // e.g., require('@tailwindcss/forms')
  ],
}
