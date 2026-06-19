# DOCTORS — The Specialists
### Premium Dental Clinic Landing Page

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.x
- npm ≥ 9.x

### Install & Run

```bash
# Clone or copy the project folder
cd doctors-dental

# Install dependencies
npm install

# Start dev server (Vite)
npm run dev
# → Opens at http://localhost:5173

# Production build
npm run build
# → Output in /dist

# Preview production build
npm run preview
```

### Vite Config (vite.config.js)
```js
import { defineConfig } from 'vite';
export default defineConfig({
  root: '.',
  build: {
    target: 'es2018',
    rollupOptions: {
      output: { manualChunks: { animations: ['./scripts/animations.js'] } }
    }
  }
});
```

### package.json
```json
{
  "name": "doctors-dental",
  "version": "1.0.0",
  "scripts": {
    "dev":     "vite",
    "build":   "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

---

## 🎨 How to Edit Colors & Fonts

All design tokens live in **`styles/main.css`** inside `:root {}`:

```css
:root {
  --bg:          #FBFAF8;   /* Page background */
  --text:        #101214;   /* Body text */
  --muted:       #6B6B6B;   /* Secondary text */
  --accent-gold: #B58A3E;   /* Primary accent — borders, tags, CTAs */
  --accent-warm: #E7DAC6;   /* Warm secondary accent */
}
```

### Change fonts
1. Update the Google Fonts `<link>` in `index.html`
2. Update `font-family` in `.brand-title` (Playfair Display → your choice)
3. Update `font-family: 'Inter'` in `body` rule

---

## 📁 File Structure

```
doctors-dental/
├── index.html                  ← Main markup (semantic HTML5)
├── styles/
│   ├── main.css                ← All CSS + CSS variables
│   └── tailwind.config.js      ← Sample Tailwind config
├── scripts/
│   └── animations.js           ← All animations (deferred)
├── assets/
│   ├── img-placeholder.svg     ← Card image placeholder
│   ├── img-placeholder-lg.svg  ← Hero card placeholder
│   ├── img-1.webp  …img-7.webp ← (add your images here)
│   └── img-1.avif  …img-7.avif ← (AVIF versions)
└── README.md
```

---

## ♿ Accessibility Checklist

- [x] **Semantic HTML**: `<header>`, `<main>`, `<aside>`, `<article>`, `<figure>`, `<figcaption>`, `<footer>`, `<nav>`
- [x] **Heading hierarchy**: Single `<h1>` (brand title), `<h2>` per card
- [x] **ARIA labels**: All interactive elements have descriptive `aria-label`
- [x] **Alt text**: All `<img>` tags have descriptive `alt` attributes
- [x] **Keyboard navigation**: All cards and buttons are `tabindex="0"` and fully focusable
- [x] **Focus styles**: Visible gold `outline: 2px solid var(--accent-gold)` on all `:focus-visible`
- [x] **Color contrast**: `#101214` on `#FBFAF8` = ~16:1 (WCAG AAA) ✓; `#6B6B6B` on `#FBFAF8` = ~5.7:1 (WCAG AA) ✓
- [x] **Touch targets**: All buttons minimum 44×44px
- [x] **prefers-reduced-motion**: All non-essential transforms and animations disabled
- [x] **Screen reader**: Preloader has `role="status"` and `aria-label`; decorative SVGs have `aria-hidden="true"`
- [x] **Skip link**: Add `<a href="#main-content" class="skip-link">Skip to content</a>` for full compliance

---

## 🧪 QA Visual Verification Steps

1. **Preloader sequence**: On first load, confirm the gold circle logo fades in (scale 0.92→1), the shimmer bar fills left-to-right over ~1.2s, then the page crossfades in smoothly.

2. **Card stagger entrance**: Confirm cards animate in with bottom-up stagger (~0.12s apart). Each card should be invisible on load and animate to full opacity + position.

3. **3D tilt on hover**: Hover slowly over each card — confirm perspective tilt up to ±6° based on cursor position. Inner image should parallax slightly. Leave card → confirm smooth reset.

4. **Gold border draw**: On card hover, confirm the gold SVG border strokes around the card perimeter (stroke-dashoffset animation, ~0.9s).

5. **Image blur reveal**: Swap placeholder SVGs for real images — confirm images load blurred (12px) and sharpen over 450ms.

6. **Left rail shimmer**: Confirm the vertical gold bar pulses upward continuously on the left rail.

7. **Vertical heading**: Confirm "DOCTORS" appears rotated vertically on the top-right, with italic tagline alongside.

8. **TEETH doodle**: Scroll to the bottom and confirm the dashed tooth SVG illustration appears with a fade-up animation.

9. **Responsive — Mobile (<768px)**: Resize to 375px — confirm cards become a horizontal swipeable carousel with drag + inertia. Heading should be horizontal. Rail should be a top bar.

10. **Reduced motion**: In OS settings, enable "Reduce motion" — confirm all transforms are instantly complete, preloader is hidden, cards are immediately visible.

---

## 🔄 React / Framer Motion Migration

See `scripts/animations.js` bottom section for complete migration notes.
Key packages: `framer-motion`, `lottie-react`, `gsap`, `@gsap/react`

---

## 🌐 Deploy

**Vercel (recommended)**:
```bash
npm run build
vercel --prod
```

**Netlify**:
```bash
npm run build
# Drag /dist folder to netlify.com/drop
```

**GitHub Pages**:
```bash
npm run build
# Set GitHub Pages source to /dist branch
```
