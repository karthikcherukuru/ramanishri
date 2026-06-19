# Ramani Shri Foundation — Website

Official landing page for the **Ramani Shri Foundation**, a non-profit organization
dedicated to education, healthcare, and community development.

Built with **HTML5**, **CSS3**, and **vanilla JavaScript** — no frameworks, no build step.

---

## ✨ Features

- **Mobile-first & fully responsive** layout (breakpoints at 768px, 992px, 1200px)
- **Semantic HTML5** structure (`header`, `nav`, `main`, `section`, `footer`)
- **Accessibility friendly** — skip link, ARIA attributes, focus styles, scroll-spy, reduced-motion support
- **SEO friendly** — meta tags, Open Graph, Twitter cards, canonical URL, JSON-LD (NGO schema)
- **Brand design tokens** via CSS variables (colors, typography, spacing, shadows)
- **Poppins** typography (Google Fonts)
- **Smooth scrolling** with sticky-header offset
- **Sticky navigation** with animated hamburger menu and scroll shadow
- **Reusable utility classes** (layout, spacing, text, color)
- **Animation utility classes** + scroll-reveal via `IntersectionObserver`
- **Back-to-top** button

---

## 📁 Project Structure

```
/
├── index.html          # Page markup (section content = placeholders for now)
├── css/
│   └── style.css       # Design tokens, reset, utilities, components, responsive
├── js/
│   └── main.js         # Nav toggle, sticky header, scroll reveal, scroll spy, back-to-top
├── assets/
│   ├── logo/           # Brand logos copied from official source files
│   ├── images/         # General site imagery (placeholders)
│   └── gallery/        # Gallery / event photos (placeholders)
└── README.md
```

---

## 🎨 Brand Palette

Derived from the official logo files.

| Token              | Value     | Use                          |
| ------------------ | --------- | ---------------------------- |
| `--color-primary`  | `#033631` | Deep teal-green (brand)      |
| `--color-secondary`| `#fac63b` | Golden yellow                |
| `--color-accent`   | `#fac63b` | Accent / call-to-action      |
| `--color-text`     | `#1c2b29` | Body text                    |
| `--color-bg`       | `#fbfceb` | Cream page background        |

All tokens live in `:root` at the top of `css/style.css`.

---

## 🖼️ Logo Assets

The following files were copied into `assets/logo/` from the official source set:

- `logo-primary.png` / `logo-primary.svg` — primary logo (colour)
- `logo-secondary.png` — secondary lockup
- `logo-icon.png` / `logo-icon.svg` — icon mark
- `logo-white.png` / `logo-icon-white.png` — white versions for dark backgrounds
- `favicon-source.png` — circular icon used as the favicon

---

## 🧩 Utility Classes (quick reference)

- **Layout:** `.container`, `.flex`, `.grid`, `.grid-auto`, `.items-center`, `.justify-between`, `.gap-md`
- **Spacing:** `.mt-md`, `.mb-lg`, `.p-lg`, `.my-lg`
- **Text/Color:** `.text-center`, `.text-primary`, `.text-muted`, `.bg-dark`, `.lead`
- **Buttons:** `.btn`, `.btn--primary`, `.btn--accent`, `.btn--outline`, `.btn--lg`, `.btn--block`
- **Components:** `.card`, `.section`, `.section--alt`, `.section__title`
- **Animation:** `.reveal` (scroll-triggered) · `.animate-fade-up`, `.animate-zoom-in`, `.animate-float`, `.animate-pulse` · stagger with `.delay-1` … `.delay-5`

---

## 🚀 Getting Started

No build tools required. Either:

1. Open `index.html` directly in a browser, **or**
2. Serve locally for clean relative paths:

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

---

## 📝 Status

This commit contains the **project foundation only** — the page sections in
`index.html` are intentionally left as placeholders (`<!-- TODO -->`). Content
and section layouts will be added in the next step.

---

© 2026 Ramani Shri Foundation. All rights reserved.
