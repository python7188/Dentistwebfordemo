# ToothCare — README

## Overview

ToothCare is a cinematic, premium, responsive dental website prototype. All raster images use **placeholder tokens** (e.g., `{{HERO_IMAGE}}`). Replace tokens with real image paths before deployment.

## Deliverables

| Folder | Contents |
|---|---|
| `export/html/` | Responsive HTML/CSS/JS prototype (index + sub-pages) |
| `assets/svg/` | Brush-stroke SVGs (3 sizes) + icon set (6 icons) |
| `assets/css/` | `tokens.json` — design tokens |
| `assets/sample-css/` | Extracted component CSS |
| `assets/sample-js/` | Standalone JS modules (animations, booking modal, before-after) |
| `json-ld/` | JSON-LD templates (dentist + doctor) |
| `pages/` | 3 doctor profiles + 3 blog posts |
| `docs/` | README + ACCESSIBILITY.md |
| `figma/` | Figma reconstruction guide |

---

## Token → Path Mapping

Replace each token in HTML `src="{{TOKEN}}"` with the actual image path.

| Token | Recommended Path | Specs |
|---|---|---|
| `{{HERO_IMAGE}}` | `assets/images/hero-clinic.webp` | 16:9+, 3000×1690px master |
| `{{WHY_IMAGE}}` | `assets/images/why-patient.webp` | 4:5 portrait, 2000px long side |
| `{{SERVICE_THUMB_1}}` – `{{SERVICE_THUMB_8}}` | `assets/images/service-[n].webp` | 800×600px |
| `{{SERVICE_HERO}}` | `assets/images/service-hero.webp` | 16:9, 2000px+ |
| `{{SERVICE_GALLERY_1}}` – `{{SERVICE_GALLERY_N}}` | `assets/images/service-gallery-[n].webp` | 2000px long side |
| `{{EQUIPMENT_IMAGE_1}}`, `{{EQUIPMENT_IMAGE_2}}` | `assets/images/equipment-[n].webp` | 1600px wide min |
| `{{DOCTOR_PHOTO_1}}` – `{{DOCTOR_PHOTO_6}}` | `assets/images/doctor-[n].webp` | 1200×1200px square |
| `{{DOCTOR_PROFILE_HERO}}` | `assets/images/doctor-profile-hero.webp` | 2000×900px |
| `{{BEFORE_1}}`/`{{AFTER_1}}` – `{{BEFORE_3}}`/`{{AFTER_3}}` | `assets/images/ba-[n]-before.webp` / `ba-[n]-after.webp` | 2000px long side, consistent lighting |
| `{{TESTIMONIAL_PHOTO_1}}` – `{{TESTIMONIAL_PHOTO_6}}` | `assets/images/testimonial-[n].webp` | 600×600px circular crop |
| `{{BLOG_THUMB_1}}` – `{{BLOG_THUMB_3}}` | `assets/images/blog-[n].webp` | 600×338px (16:9) |
| `{{CLINIC_EXTERIOR}}` | `assets/images/clinic-exterior.webp` | 1600–3000px wide |
| `{{MAP_SNAPSHOT}}` | `assets/images/map.webp` | 1200×800px |
| `{{PHONE}}` | Your clinic phone number (E.164 format) | — |
| `{{CLINIC_NAME}}` | Your clinic name | — |
| `{{STREET}}`, `{{CITY}}`, `{{REGION}}`, `{{POSTAL}}`, `{{COUNTRY}}` | Address parts | — |
| `{{WEBHOOK_URL}}` | Your webhook endpoint URL | — |

---

## Image Format Recommendations

- **Master**: Capture at highest resolution for each slot.
- **Web delivery**: Export WebP + AVIF with `srcset` for responsive sizes.
- **LQIP (Low-Quality Image Placeholders)**: Generate 20px-wide blurred versions for progressive loading using:
  ```bash
  convert input.webp -resize 20x -blur 0x4 output-lqip.webp
  ```

---

## Build Instructions

```bash
# No build step required — static HTML/CSS/JS
# To serve locally:
npx serve export/html

# For production:
# 1. Replace all {{PLACEHOLDER}} tokens with real paths
# 2. Minify CSS/JS
# 3. Add LQIP data-URIs
# 4. Deploy via CDN / static host
```

---

## Injecting JSON-LD

Copy the contents of `json-ld/dentist.jsonld` into a `<script type="application/ld+json">` tag in your `<head>`. Replace all `{{PLACEHOLDER}}` tokens with real values.

```html
<script type="application/ld+json">
  <!-- paste dentist.jsonld contents here with real values -->
</script>
```

For each doctor page, inject the corresponding `doctor-template.jsonld` with the doctor's actual data.

---

## Accessibility Checks

```bash
# Using pa11y CLI:
npx pa11y export/html/index.html

# Using axe CLI:
npx @axe-core/cli export/html/index.html

# Using Lighthouse:
npx lighthouse export/html/index.html --only-categories=accessibility
```

---

## Testing Webhook

```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "clinic": "ToothCare",
    "service": "Preventive Care",
    "provider": "Dr. S. Kumar",
    "datetime": "2026-04-20T14:30:00+05:30",
    "timezone": "Asia/Kolkata",
    "patient": {
      "name": "Test User",
      "email": "test@example.com",
      "phone_e164": "+919876543210"
    },
    "source": "website",
    "utm": {"source": "test"}
  }'
```

---

## Replacing Placeholders

Use find-and-replace in your editor or a build script:

```bash
# Example using sed (Linux/macOS):
sed -i 's|{{HERO_IMAGE}}|assets/images/hero-clinic.webp|g' export/html/index.html

# PowerShell (Windows):
(Get-Content export/html/index.html) -replace '\{\{HERO_IMAGE\}\}', 'assets/images/hero-clinic.webp' | Set-Content export/html/index.html
```

---

## Disabling Animations

The prototype respects `prefers-reduced-motion` at the OS level. To force-disable animations:

```css
/* Add to your stylesheet */
* { animation: none !important; transition: none !important; }
```

---

## GA4 Event Tracking

The prototype fires these events (requires `gtag.js` to be loaded):

| Event | Trigger |
|---|---|
| `book_open` | Booking modal opens |
| `book_submit` | Booking form submitted |
| `call_click` | Phone number link clicked |
| `add_to_calendar` | Calendar button clicked |

---

## A/B Test Placeholders

Three A/B tests are recommended (configure in your analytics platform):

1. **Hero CTA copy** — "Book Your Appointment" vs. "Schedule a Visit"
2. **Hero image orientation** — landscape vs. portrait
3. **CTA colour** — teal (`#16a39d`) vs. coral (`#ff6b61`)
