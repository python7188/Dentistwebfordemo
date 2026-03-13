# ToothCare — Figma Reconstruction Guide

## Overview

This guide provides instructions for recreating the ToothCare prototype in Figma using the exported HTML/CSS as the reference design. A binary `.fig` file cannot be generated programmatically. Use this guide alongside the exported prototype.

## Setup

1. Create a new Figma file named **ToothCare-Prototype**
2. Set up three frames: **Desktop** (1440×900), **Tablet** (768×1024), **Mobile** (375×812)

## Design Tokens (create as Figma Styles)

### Colour Styles
| Name | Hex |
|---|---|
| `color/primary` | `#16a39d` |
| `color/accent` | `#ff6b61` |
| `color/bg` | `#f7faf9` |
| `color/text` | `#0b2b3b` |
| `color/muted` | `#6b7785` |

### Typography Styles
| Name | Font | Weight | Size |
|---|---|---|---|
| `type/h1` | Poppins | Bold (700) | 56px desktop / 32px tablet / 24px mobile |
| `type/h2` | Poppins | Bold (700) | 40px desktop |
| `type/h3` | Poppins | Bold (700) | 24px desktop |
| `type/body` | Inter | Regular (400) | 16px, line-height 1.6 |
| `type/small` | Inter | Regular (400) | 14px |
| `type/label` | Inter | SemiBold (600) | 12px, uppercase, 2px tracking |

### Effect Styles
| Name | Value |
|---|---|
| `shadow/default` | `0 8px 24px rgba(11,43,59,0.08)` |
| `shadow/hover` | `0 16px 40px rgba(11,43,59,0.14)` |

## Component Naming Convention

Name all components using the BEM-inspired class names from the CSS:

| Component | Figma Layer Name |
|---|---|
| Header | `.site-header` |
| Hero section | `.hero` |
| Hero image placeholder | `{{HERO_IMAGE}}` |
| Why section | `.why` |
| Why image placeholder | `{{WHY_IMAGE}}` |
| Service card | `.service-card` |
| Service thumbnail | `{{SERVICE_THUMB_[N]}}` |
| Doctor card | `.doctor-card` |
| Doctor photo | `{{DOCTOR_PHOTO_[N]}}` |
| Booking modal | `.booking-modal` |
| Before/after | `.before-after` |
| Testimonial carousel | `.testimonial-carousel` |
| Button primary | `.btn .btn--primary` |
| Button ghost | `.btn .btn--ghost` |

## Image Placeholder Layers

For each image slot, create a **rectangle** filled with `#e0f5f4`, add a text label in the centre with the exact token name (e.g., `{{HERO_IMAGE}}`), and set the rectangle's constraints/size to match the specifications in `docs/README.md`.

## Grid System

- Desktop: 12 columns, 24px gutter, max-width 1400px
- Tablet: 8 columns, 24px gutter
- Mobile: single column, 24px padding

## Components to Create

1. **Header** — Logo + Nav + CTA button + Hamburger (mobile variant)
2. **Hero** — Split layout: left text, right image
3. **Service Card** — Image + title + description + CTA link
4. **Doctor Card** — Square photo + name + specialty + book button
5. **Before/After** — Overlapping images with slider handle
6. **Testimonial Card** — Photo + stars + quote + name + location
7. **Blog Card** — Image + tag + title + excerpt + meta
8. **Booking Modal** — Dialog with 5 step panels
9. **Button** — Primary, ghost, outline variants (3 sizes)
10. **Contact Card** — Icon + text + link

## Export Settings

- Icons: SVG
- Images: WebP / PNG @2x
- Fonts: Poppins (Google Fonts), Inter (Google Fonts)
