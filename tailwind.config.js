/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        bg: '#0c0c0d',
        surface: '#161618',
        surface2: '#202023',
        line: '#2e2e32',
        ink: '#f2efe9',
        muted: '#a5a29b',
        gold: '#e0a431',
        goldStrong: '#f2b94a',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Arial Narrow"', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
}
