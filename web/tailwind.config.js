/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Vizion Academy
        'bleu-nuit': '#1B263B',
        'bleu-intense': '#1E3A8A',
        'indigo-violet': '#4F46E5',
        'beige-elegant': '#D7C49E',
        'bleu-pastel': '#E0E3FF',
        'blanc-teinte': '#FAFAFA',
        // Alias pour faciliter l'utilisation
        primary: {
          DEFAULT: '#1E3A8A', // Bleu intense
          dark: '#1B263B',    // Bleu nuit
          light: '#E0E3FF',   // Bleu pastel
        },
        secondary: {
          DEFAULT: '#4F46E5', // Indigo violet
          light: '#E0E3FF',   // Bleu pastel
        },
        accent: {
          DEFAULT: '#D7C49E', // Beige élégant
          light: '#FAFAFA',   // Blanc teinté
        },
      },
      textColor: {
        'body-black': '#1B263B',
        'body-white': '#FAFAFA',
      },
      backgroundColor: {
        'page-bg': '#FAFAFA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
