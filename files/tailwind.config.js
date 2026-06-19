/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:           '#FBFAF8',
        text:         '#101214',
        muted:        '#6B6B6B',
        'accent-gold':  '#B58A3E',
        'accent-warm':  '#E7DAC6',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1:      ['56px', { fontWeight: '700', letterSpacing: '0.12em' }],
        h2:      ['40px', { fontWeight: '700' }],
        body:    ['16px', { lineHeight: '1.6' }],
        caption: ['14px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        card: '20px',
      },
      boxShadow: {
        lg: '0 12px 30px rgba(16,18,20,0.08)',
      },
      backdropBlur: {
        card: '8px',
      },
    },
  },
  plugins: [],
};
