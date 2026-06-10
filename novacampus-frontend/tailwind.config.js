/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./projects/**/*.{html,ts}" // Keeping this to catch your monorepo files
  ],
  theme: {
    extend: {
      fontFamily: {
        // Sets 'Inter' as the default sans-serif font
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#2563EB',   // Main buttons, active links
          dark: '#1E3A8A',      // Navbar background, dark sections
          accent: '#F59E0B',    // Warnings, highlights
        },
        surface: '#F8FAFC',     // The main page background
        text: {
          main: '#1E293B',      // Standard text (headers, paragraphs)
          muted: '#64748B'      // Subtitles, secondary text
        },
        border: {
          light: '#E2E8F0'      // Dividers, card borders
        }
      }
    },
  },
  plugins: [],
}