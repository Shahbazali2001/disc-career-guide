/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#090D16',
        disc: {
          D: '#F43F5E',
          I: '#F59E0B',
          S: '#10B981',
          C: '#6366F1',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 20px 50px -20px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        'glass-light':
          '0 18px 40px -24px rgba(15, 23, 42, 0.16), 0 4px 12px -4px rgba(15, 23, 42, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.85)',
        'glow-D': '0 0 35px -8px rgba(244, 63, 94, 0.5)',
        'glow-I': '0 0 35px -8px rgba(245, 158, 11, 0.5)',
        'glow-S': '0 0 35px -8px rgba(16, 185, 129, 0.5)',
        'glow-C': '0 0 35px -8px rgba(99, 102, 241, 0.5)',
      },
    },
  },
  plugins: [],
};
