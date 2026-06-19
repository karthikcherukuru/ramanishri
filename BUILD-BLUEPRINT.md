# Ramanishri Foundation — Technical Build Blueprint

> **Status:** Draft for approval · **Stage:** Pre-implementation engineering plan
> **Stack:** HTML5 · CSS3 · Vanilla JavaScript (no framework, no build step required)
> **Pairs with:** `CONTENT-ARCHITECTURE.md` (approved)
> **Authored as:** Frontend Architecture / UI-UX / Accessibility / SEO / Performance deliverable
> **Constraint:** No code in this document — engineering blueprint only.

---

## 0. Architectural Decisions (read first)

| Decision | Choice | Rationale |
|---|---|---|
| **Site type** | Multi-page static (MPA), 8 HTML files | Matches stack; best SEO (one URL per page); no framework overhead |
| **Build tooling** | None required to ship; optional Node devtools for minify/optimize | Keeps it pure HTML/CSS/JS, host-anywhere |
| **Shared markup (navbar/footer)** | JS partial injection (`fetch` of `/partials/*.html`) **with a static fallback** | DRY across 8 pages; if JS fails, see note ⚠️ below |
| **CSS strategy** | Single shared `base/` + per-page CSS file, BEM naming, design tokens via CSS custom properties | Cacheable core, small per-page payloads |
| **JS strategy** | ES modules, one `main.js` orchestrator + feature modules, lazy-init by DOM presence | Only runs what a page needs |
| **Existing code** | Current `index.html` / `css/style.css` / `js/main.js` become the **reference**; refactor into the structure below | Reuse the working token system & components already built |

> ⚠️ **Partial-injection caveat:** `fetch()` of local partials fails under `file://` (CORS) and harms SEO if nav/footer aren't in the DOM at crawl time. **Recommended approach:** keep navbar + footer markup **inline in each HTML file** (source of truth = `/partials/` reference snippets that we copy in), OR use a tiny Node "include" build step. We will **inline shared markup in each page** for SEO + reliability, and keep partials as canonical reference. This is flagged for final approval in §13.

---

# 1. FOLDER STRUCTURE

```
ramanishri-2026/
│
├── index.html                  # Home
├── about.html
├── donate.html
├── volunteer.html
├── support-prayers.html
├── celebrate.html
├── gallery.html
├── contact.html
├── 404.html
│
├── css/
│   ├── base/
│   │   ├── _tokens.css         # design tokens (variables)
│   │   ├── _reset.css          # modern reset
│   │   ├── _typography.css
│   │   ├── _utilities.css      # layout/spacing/text utilities
│   │   └── _animations.css     # keyframes + animation utility classes
│   ├── components/
│   │   ├── navbar.css
│   │   ├── footer.css
│   │   ├── buttons.css
│   │   ├── cards.css           # mission/work/team/cta/donation cards
│   │   ├── hero.css
│   │   ├── forms.css           # inputs, newsletter, contact form
│   │   ├── counter.css
│   │   ├── gallery.css
│   │   ├── lightbox.css
│   │   ├── modal.css
│   │   ├── accordion.css       # FAQ
│   │   ├── timeline.css        # About journey
│   │   └── tabs.css            # donate one-time/monthly/corporate
│   ├── pages/
│   │   ├── home.css
│   │   ├── about.css
│   │   ├── donate.css
│   │   ├── volunteer.css
│   │   ├── support.css
│   │   ├── celebrate.css
│   │   ├── gallery.css
│   │   └── contact.css
│   └── main.css                # @imports base + components (shared bundle)
│
├── js/
│   ├── main.js                 # orchestrator: import + init by DOM presence
│   ├── modules/
│   │   ├── nav.js              # mobile toggle, sticky header, scroll-spy
│   │   ├── hero-slider.js
│   │   ├── reveal.js           # IntersectionObserver scroll reveal
│   │   ├── counters.js
│   │   ├── lightbox.js
│   │   ├── gallery-filter.js
│   │   ├── forms.js            # validation (newsletter, contact, volunteer)
│   │   ├── donation.js         # amount chips, one-time/monthly tabs
│   │   ├── faq-accordion.js
│   │   ├── back-to-top.js
│   │   ├── share.js            # social share (Celebrate/Support)
│   │   └── utils.js            # debounce, prefers-reduced-motion, $ helpers
│   └── partials.js             # (optional) include loader — reference only
│
├── partials/                   # canonical shared markup (copied into pages)
│   ├── navbar.html
│   ├── footer.html
│   └── head-meta.html          # meta/OG template reference
│
├── assets/
│   ├── logos/
│   │   ├── logo-primary.svg            # Main Colour
│   │   ├── logo-primary.png
│   │   ├── logo-white.svg              # Monocolor White (footer/dark)
│   │   ├── logo-white.png
│   │   ├── logo-alt.svg                # Alternate Colour
│   │   ├── logo-mark.svg               # Circle main (icon only)
│   │   └── og-default.png              # 1200×630 social share
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── favicon.svg                 # Circle Main Colour (For Favicons)
│   │   ├── favicon-32.png
│   │   ├── apple-touch-icon.png        # 180×180 (Circle)
│   │   └── ui/                         # inline-or-file SVG UI icons
│   ├── images/
│   │   ├── hero/
│   │   ├── home/
│   │   ├── about/
│   │   ├── donate/
│   │   ├── volunteer/
│   │   ├── support/
│   │   ├── celebrate/
│   │   ├── team/
│   │   └── gallery/
│   └── fonts/                          # optional self-hosted Poppins (perf)
│
├── docs/
│   ├── CONTENT-ARCHITECTURE.md
│   └── BUILD-BLUEPRINT.md
│
├── site.webmanifest
├── robots.txt
├── sitemap.xml
└── README.md
```

**Logo source mapping** (from `Ramanishri Foundation - Final Logo Files`):
- `assets/logos/logo-primary.*` ← `3. SVG Files/1. Main Colour` + `2. PNG/1. Main Colour - Trans BG`
- `assets/logos/logo-white.*` ← `… Monocolor White - Trans BG` (for dark footer/hero)
- `assets/logos/logo-mark.svg` ← `… Circle Main Colour`
- `assets/icons/favicon.svg` ← `3. SVG Files/3. Circle Main Colour (For Favicons)`
- `assets/logos/og-default.png` ← built from `4. Square (1080x1080)` cropped to 1200×630

---

# 2. DESIGN SYSTEM

Brand palette derived from the official logo (teal + gold on cream). Values formalized from the existing working stylesheet.

## 2.1 Color System

### Primary (Brand Teal)
| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#033631` | Brand, headings, primary buttons, dark sections |
| `--color-primary-dark` | `#02201d` | Hover-dark, overlays, footer base |
| `--color-primary-light` | `#0a4f47` | Accents, subheadings, hover lift |

### Secondary / Accent (Brand Gold)
| Token | Hex | Use |
|---|---|---|
| `--color-secondary` / `--color-accent` | `#fac63b` | CTAs, highlights, counters, active states |
| `--color-secondary-dark` / `--color-accent-dark` | `#e0ad22` | CTA hover |

### Neutrals & Surfaces
| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#fbfceb` | Cream page background |
| `--color-bg-alt` | `#f1f3dc` | Alternating sections |
| `--color-bg-dark` | `#033631` | Footer / dark bands |
| `--color-surface` | `#ffffff` | Cards |
| `--color-border` | `#e2e4cf` | Dividers, card borders |

### Text
| Token | Hex |
|---|---|
| `--color-text` | `#1c2b29` |
| `--color-text-muted` | `#5a6b68` |
| `--color-text-inverse` | `#fbfceb` |
| `--color-heading` | `#033631` |

### Semantic (forms/status)
| Token | Hex | Use |
|---|---|---|
| `--color-success` | `#2e7d5b` | Valid / success messages |
| `--color-error` | `#c0392b` (text on light) / `#ff8585` (on dark) | Validation errors |
| `--color-info` | `#0a4f47` | Notices |

> **Contrast note:** Gold `#fac63b` is a light color → **never** use gold text on cream/white. Gold is for fills with **dark teal text on top** (passes AA). See §8.4.

## 2.2 Typography System
- **Family:** Poppins (300/400/500/600/700/800) with system fallback stack. Self-host for performance (optional, see §10).
- **Scale (rem, fluid via `clamp()` recommended at build):**

| Token | Size | Role |
|---|---|---|
| `--fs-xs` | 0.75rem | labels, captions |
| `--fs-sm` | 0.875rem | meta, fine print |
| `--fs-base` | 1rem | body |
| `--fs-md` | 1.125rem | lead paragraphs |
| `--fs-lg` | 1.375rem | h4 / card titles |
| `--fs-xl` | 1.75rem | h3 |
| `--fs-2xl` | 2.25rem | h2 |
| `--fs-3xl` | 3rem | h1 / stats |
| `--fs-4xl` | 3.75rem | hero h1 (desktop) |

- **Weights:** light 300 · regular 400 · medium 500 · semibold 600 · bold 700 · extrabold 800.
- **Line-height:** tight 1.15 (headings) · snug 1.35 · base 1.65 (body).
- **Measure:** body `max-width: 65ch`.

## 2.3 Spacing System (8px-ish scale)
| Token | Value |
|---|---|
| `--space-xs` | 0.5rem |
| `--space-sm` | 1rem |
| `--space-md` | 1.5rem |
| `--space-lg` | 2.5rem |
| `--space-xl` | 4rem |
| `--space-2xl` | 6rem |

- **Section vertical rhythm:** `--space-xl` mobile → `--space-2xl` desktop.
- **Container:** `max-width 1200px`, side padding `1.25rem` mobile / `2rem` tablet+.

## 2.4 Radius, Shadows, Borders
| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 6px | inputs, small chips |
| `--radius-md` | 12px | cards |
| `--radius-lg` | 20px | feature cards, CTA tiles |
| `--radius-pill` | 999px | buttons, dots |
| `--shadow-sm` | `0 1px 3px rgba(3,54,49,.08)` | resting cards |
| `--shadow-md` | `0 6px 18px rgba(3,54,49,.12)` | hover |
| `--shadow-lg` | `0 16px 40px rgba(3,54,49,.16)` | elevated/hover-strong |

## 2.5 Buttons
| Variant | Style | Use |
|---|---|---|
| `.btn--primary` | teal fill, cream text | main actions on light bg |
| `.btn--accent` | gold fill, teal text | **Donate / convert** (highest emphasis) |
| `.btn--outline` | transparent, teal border | secondary actions |
| `.btn--ghost` (new) | transparent, no border, underline on hover | tertiary/inline |
| `.btn--lg` | larger padding | hero CTAs |
| `.btn--block` | full-width | mobile, forms |

Shared: pill radius, 600 weight, hover lift `translateY(-2px)` + shadow, transitions, `:focus-visible` ring (gold), disabled state.

## 2.6 Cards (catalog)
- **Mission card** — circular icon + title + text; hover fill teal.
- **Work/stat card** — number/counter or image-overlay; masonry.
- **Team card** — photo (zoom) + social reveal + name/role/bio.
- **CTA card** — bg image + overlay + title/desc/button; hover zoom.
- **Donation impact card** — amount badge + outcome + select.
- **Occasion card** (Celebrate) — image + occasion + CTA.
- **Testimonial card** — quote + avatar + name/role.
- **FAQ item** — accordion row.
- **Base `.card`** — surface, border, radius-md, shadow-sm, hover lift.

## 2.7 Forms & Inputs
- Inputs: pill or `radius-sm`, 1px border, focus = gold ring + bg tint, `.is-invalid` = error border + tint.
- Field group, label (visible or `.sr-only`), helper text, inline error text, `aria-live` status region.
- Validation styles for: newsletter, contact, volunteer-inquiry, donation-amount.

## 2.8 Section spacing & layout primitives
- `.section` (rhythm), `.section--alt` (alt bg), `.container`, `.section__head/__eyebrow/__title/__subtitle`.
- Grid utilities: `.grid-2/3/4`, `.grid-auto` (auto-fit minmax), responsive `*-md-*` variants.

---

# 3. CSS ARCHITECTURE

## 3.1 Layering (load order)
1. `base/_tokens` → 2. `base/_reset` → 3. `base/_typography` → 4. `base/_utilities` → 5. `base/_animations` → 6. `components/*` → 7. `pages/<page>` (per-page only).

- `main.css` bundles base + components (cached across all pages).
- Each page links `main.css` **and** its single `pages/<page>.css`.

## 3.2 Methodology
- **BEM** naming (`block__element--modifier`) — already in use.
- **Tokens-first:** no hard-coded colors/spacing in components; reference variables.
- **Utility + component hybrid:** utilities for layout/spacing; components for UI blocks.
- **Mobile-first:** base styles = mobile; `min-width` media queries scale up.

## 3.3 Breakpoints
| Name | Min-width | Targets |
|---|---|---|
| (base) | 0 | mobile |
| `sm` | 480px | large phones |
| `md` | 768px | tablet |
| `lg` | 992px | desktop / full nav |
| `xl` | 1200px | large desktop |

## 3.4 Animation classes (in `_animations.css`)
- Keyframes: `fadeIn`, `fadeInUp/Down/Left/Right`, `zoomIn`, `pulse`, `float`.
- Utilities: `.reveal` (+`.is-visible`), `.animate-*`, stagger `.delay-1..5`.
- `prefers-reduced-motion` global override.

## 3.5 Conventions
- One component = one file; page-specific overrides live in `pages/`.
- Z-index scale tokens: `--z-header 1000`, `--z-overlay 1100`, `--z-top 1200`, lightbox/modal `1300`.
- Comment headers + table of contents per file (matches current style).

---

# 4. COMPONENT LIBRARY

> Format: **Purpose · Content/Props · Responsive behavior · Pages used**

### Global
1. **Navbar** — Purpose: primary nav + persistent Donate. Content: logo, links, Donate button, mobile toggle. Responsive: horizontal ≥992px; off-canvas drawer + hamburger below; sticky w/ scroll shadow. *All pages.*
2. **Footer** — Purpose: nav, contact, newsletter, trust, legal. Content: 4 columns, social icons, newsletter form, copyright. Responsive: 1→2→3-4 cols. *All pages.*
3. **Back-to-Top** — Purpose: quick return. Content: icon button. Responsive: fixed bottom-right; appears after 400px scroll. *All pages.*
4. **Skip Link** — a11y jump to main. *All pages.*
5. **Mobile sticky action bar** (new) — Donate + Volunteer one-tap. Mobile only. *All pages.*

### Hero
6. **Hero Slider** — Purpose: homepage emotional entry. Content: 3 slides (bg img), shared headline/sub/CTAs, dots. Responsive: 65/75/100vh; fade + parallax; autoplay 5s, pause on hover/hidden. *Home.*
7. **Page Hero (inner)** — Purpose: per-page banner. Content: eyebrow, H1, sub, 1–2 CTAs, bg image + overlay. Responsive: 45–60vh; single image. *About/Donate/Volunteer/Support/Celebrate/Gallery/Contact.*

### Content blocks
8. **Impact Counter** — animated number on scroll (`data-count-to`), label. Grid 2→4. *Home, About.*
9. **Mission Card** — icon circle, title, text, hover fill. Grid 1→2→4. *Home.*
10. **Pillar/What-We-Do Card** — icon, title, line. *Home.*
11. **Work/Stat Masonry Card** — stat or image-overlay, columns 1→2→3. *Home (What We Do).*
12. **Feature Split** — image (organic mask) + content, reversible. Stacked→2-col. *About (story), Home (about preview).*
13. **Timeline** — vertical milestones; year, title, text. Stacked w/ left rail → centered alternating on desktop. *About (Journey).*
14. **Mission/Vision Cards** — paired statement cards. 1→2 col. *Home, About.*
15. **Value Card** — icon + title + text. 1→2→4. *About.*

### Conversion
16. **CTA Banner** — full-width band, headline + sub + buttons, optional bg. *All pages (final CTA).*
17. **CTA Card (Get Involved)** — bg image, overlay, title, desc, button; hover zoom. 1→3. *Home, others.*
18. **Donation Impact Card** — amount, outcome, "select" → prefsets amount. 1→2→3. *Donate, Home.*
19. **Donation Widget** — tabs (One-time/Monthly/Corporate), amount chips + custom, frequency, donate button. Full-width mobile; 2-col (form + summary) desktop. *Donate.*
20. **Donation Tabs** — segmented control. *Donate.*
21. **Volunteer Opportunity Card** — icon/image, role, desc, apply. 1→2→3. *Volunteer.*
22. **Steps/Journey** — numbered horizontal steps → stacked. *Volunteer, Celebrate.*
23. **Occasion Card** (Celebrate) — image, occasion, blurb, start-CTA. 1→2→3. *Celebrate.*
24. **Fundraising Package Card** — tier name, amount, inclusions, CTA. 1→3. *Celebrate.*

### Social proof / media
25. **Team Card** — photo (hover zoom), social reveal, name/role/bio. 1→2→3. *Home preview, About.*
26. **Testimonial Card / Slider** — quote, avatar, name/role. 1→2/3; optional swipe slider. *Support, Home (optional).*
27. **Partner Logo Strip** — grayscale→color logos. Wrap grid. *About.*
28. **Gallery Card** — thumb, hover overlay+zoom, opens lightbox. Masonry 2→3→4. *Gallery, Home preview.*
29. **Gallery Filter** (optional) — category chips. *Gallery.*

### Interactive / utility
30. **Lightbox** — full-image overlay, prev/next, keyboard, backdrop/ESC close, focus trap. *Gallery.*
31. **Modal** — generic dialog (e.g., "Start Campaign" / quick-donate). Focus trap, ESC, backdrop. *Celebrate, Donate (optional).*
32. **FAQ Accordion** — expand/collapse, single or multi-open, `aria-expanded`. *Donate, Volunteer, Contact.*
33. **Newsletter Form** — email input + subscribe, validation, status. *Footer (all).*
34. **Contact Form** — name/email/phone/type/message/consent, validation, routing. *Contact.*
35. **Volunteer Inquiry Form** — interest, availability, skills. *Volunteer/Contact.*
36. **Share Buttons** — WhatsApp/FB/X/IG/copy-link; pre-filled text. *Support, Celebrate.*
37. **Breadcrumbs** — inner-page path + schema. *All inner pages.*
38. **Toast/Inline Notice** — form success/error feedback. *Forms.*

---

# 5. RESPONSIVE STRATEGY

**Approach:** mobile-first, fluid type via `clamp()`, CSS Grid/Flex, container max 1200px.

## 5.1 Global behavior
| Region | Mobile (<768) | Tablet (768–991) | Desktop (≥992) |
|---|---|---|---|
| Navbar | hamburger drawer + sticky Donate | hamburger or condensed | full horizontal + sticky Donate |
| Mobile action bar | visible (Donate/Volunteer) | hidden | hidden |
| Containers | 1-col, 1.25rem pad | 2rem pad | centered 1200px |
| Section rhythm | `--space-xl` | between | `--space-2xl` |
| Footer | 1 col | 2 cols | 3–4 cols |

## 5.2 Key section grids
| Section | Mobile | Tablet | Desktop |
|---|---|---|---|
| Hero slider | 65vh, centered text | 75vh | 100vh, left-aligned |
| Impact stats | 2-col | 4-col | 4-col |
| Mission cards | 1 | 2 | 4 |
| What We Do (masonry) | 1 | 2 | 3 |
| Feature split | stacked (img top) | stacked or 2 | image-left / content-right |
| CTA cards | 1 | 3 | 3 |
| Donation impact | 1 | 2 | 3 |
| Donation widget | stacked | stacked | form + sticky summary (2-col) |
| Team | 1 | 2 | 3 |
| Gallery | 2 | 3 | 4 |
| Timeline | left-rail stack | left-rail | centered alternating |
| FAQ | full-width | full-width | full-width (max 800px centered) |
| Forms | full-width fields | full-width | 2-col where sensible |

## 5.3 Touch & ergonomics
- Min tap target 44×44px. Bottom-anchored primary CTAs on mobile. No hover-only critical actions (provide tap/focus equivalents). Avoid heavy parallax on mobile (see §6.5).

---

# 6. ANIMATION STRATEGY

## 6.1 Scroll animations
- `IntersectionObserver` adds `.is-visible` to `.reveal` elements (fade/translate), unobserve after first reveal. Threshold ~0.15, `rootMargin` bottom offset. Stagger via `.delay-*`.

## 6.2 Hero animations
- Cross-fade slides (opacity, ~1200ms), autoplay 5s, manual dots restart timer, pause on hover/focus/tab-hidden, subtle parallax on bg (scroll-linked via rAF). Entrance fade-up on headline/sub/CTA (staggered).

## 6.3 Hover effects
- Buttons: lift + shadow. Cards: lift + shadow (+ color fill for mission). Images: `scale(1.05–1.1)` within `overflow:hidden`. Social/gallery overlays: opacity/translate reveal. All via `transform`/`opacity` (GPU-friendly), 150–400ms.

## 6.4 Counters
- Count 0→target with easeOutCubic on first in-view (rAF), once. Respect reduced-motion (snap to final).

## 6.5 Mobile performance considerations
- Disable/soften parallax under ~768px and on low-power. Use `transform`/`opacity` only (no layout-thrash props). `will-change` sparingly. rAF for scroll handlers; passive listeners. Honor `prefers-reduced-motion` globally (near-zero durations, no autoplay motion). Avoid animating large blur/box-shadow on scroll.

---

# 7. SEO PLAN

## 7.1 Per-page meta (titles/descriptions from CONTENT-ARCHITECTURE.md)
Each page ships unique: `<title>` (≤60), `<meta name="description">` (≤160), `<link rel="canonical">`, `meta robots index,follow`, `theme-color`, viewport, charset, lang.

## 7.2 Open Graph + Twitter
- OG: `og:type` (website; `article` for future blog), `og:site_name`, `og:title`, `og:description`, `og:image` (1200×630), `og:url`, `og:locale en_IN`.
- Twitter: `summary_large_image`, title, description, image.
- **Celebrate & Support pages get share-optimized OG** (campaign virality).

## 7.3 Structured data (JSON-LD)
| Schema | Pages |
|---|---|
| `NGO`/`NonProfit` org (name, logo, url, sameAs, address, contact) | All (site-wide) |
| `WebSite` + `SearchAction` (if search added) | Home |
| `BreadcrumbList` | All inner pages |
| `DonateAction` / `Offer` | Donate, Home |
| `FAQPage` | Donate, Volunteer, Contact |
| `ImageGallery` | Gallery |
| `Event` (optional) | Celebrate campaigns / events |
| `Person` | Team (About) |

## 7.4 Technical SEO
- Clean URLs (`/about`, `/donate`, …) — configure host rewrites or keep `.html`.
- `sitemap.xml` (all 8 pages), `robots.txt`, canonical tags.
- Semantic HTML5 landmarks, one `H1`/page, logical heading order.
- Descriptive `alt` on all images; internal links to Donate from every page.
- Fast + mobile-friendly + accessible (ranking factors — see §8, §10).

---

# 8. ACCESSIBILITY PLAN  (Target: WCAG 2.1 AA)

## 8.1 Structure & ARIA
- Landmarks: `header`, `nav` (labeled), `main`, `footer`, `section` with `aria-labelledby`.
- Skip-to-content link.
- Navbar toggle: `aria-expanded`, `aria-controls`. Active link `aria-current="page"`.
- Hero carousel: `aria-roledescription="carousel"`, slides as labeled groups, dots as `role="tab"`/`aria-selected`, pause control, **respect reduced-motion (no autoplay if set)**.
- Counters: `aria-live="polite"` optional; final value always in DOM.
- Accordion: button `aria-expanded` + `aria-controls`; panel `role="region"`.
- Lightbox/Modal: `role="dialog"`, `aria-modal="true"`, labelled, **focus trap**, return focus on close, ESC to close.
- Forms: `<label>` for every field (or `aria-label`), `aria-describedby` for help/errors, `aria-invalid` on error, `role="status"`/`aria-live` for submit feedback, `required`.
- Decorative images/icons: `alt=""` / `aria-hidden="true"`; meaningful images: descriptive alt.

## 8.2 Keyboard navigation
- All interactive elements focusable & operable (Enter/Space). Logical tab order (DOM order). Drawer & dialogs trap focus while open; ESC closes. Carousel & gallery navigable by keyboard (arrows where applicable). No keyboard traps. Skip link first in tab order.

## 8.3 Focus states
- Visible `:focus-visible` ring (gold `#fac63b`, 3px, 2px offset) on **all** interactive elements; never `outline:none` without replacement. Ensure focus visible on dark backgrounds (use light ring there).

## 8.4 Color contrast (must verify)
| Pair | Status |
|---|---|
| Teal `#033631` text on cream `#fbfceb` | ✅ AA (high) |
| Cream text on teal | ✅ AA |
| **Gold `#fac63b` text on cream/white** | ❌ fails — **do not use** |
| Teal text on gold (button) | ✅ AA — use this pattern for gold buttons |
| Muted `#5a6b68` on cream | ⚠️ verify ≥4.5:1 for body; darken if needed |
| Error text on dark footer | use `#ffb4b4`/light, verify |

- Don't rely on color alone (errors get icon/text; active states get shape change too).
- Respect `prefers-reduced-motion` and `prefers-color-scheme` (optional dark mode out of scope v1).

---

# 9. IMAGE OPTIMIZATION PLAN

## 9.1 Dimensions (per CONTENT-ARCHITECTURE §11 — summary)
- Home hero slides 1920×1080; inner heroes 1920×900; feature split 900–1100; CTA cards 800×600; team 500×600; gallery 600–800w (thumbs) + ~1400w (lightbox); donation/value icons SVG; OG 1200×630.

## 9.2 Formats
- **Photos:** WebP primary, JPEG fallback via `<picture>`; consider AVIF for hero. **Icons/logos/illustrations:** SVG (inline for UI icons that need `currentColor`). **Favicons:** SVG + PNG fallbacks + ICO.

## 9.3 Compression & responsive
- Compress to quality ~70–80; strip metadata. Provide responsive `srcset`/`sizes` for heroes, gallery, feature images. Serve appropriately sized images per breakpoint (no oversized downloads on mobile).

## 9.4 Lazy loading
- `loading="lazy"` + `decoding="async"` on below-the-fold images. **Hero/LCP image:** `loading="eager"` + `fetchpriority="high"` + preload. Always set `width`/`height` (or aspect-ratio) to prevent CLS. Gallery thumbs lazy; lightbox full-size loaded on demand.

---

# 10. PERFORMANCE PLAN  (Target: Lighthouse 90+ all categories)

## 10.1 Asset loading
- Preconnect to font origin; **self-host Poppins** (woff2, `font-display: swap`, subset latin) to cut third-party RTT.
- Preload LCP hero image + critical font.
- Defer all JS (`type="module"` is deferred by default); no render-blocking scripts.
- Cache headers / long-lived hashing for static assets (host config).

## 10.2 CSS optimization
- Shared `main.css` (base+components) cached site-wide; small per-page CSS.
- Critical-CSS inline for above-the-fold (optional build step); rest async.
- Minify CSS for production; purge unused (manual or tooling).
- Avoid `@import` chains in production (bundle/concat); avoid expensive selectors.

## 10.3 JS optimization
- ES modules, **init-by-presence** (a module runs only if its target exists on the page) → minimal work per page.
- Debounce/throttle scroll & resize; passive listeners; rAF for animation/scroll.
- IntersectionObserver instead of scroll math where possible.
- No jQuery / no heavy libs. Minify for production. Keep total JS small (<~30KB gz target).

## 10.4 Image optimization
- See §9: WebP/AVIF, srcset, lazy, dimensions set, hero preloaded.

## 10.5 Core Web Vitals guardrails
- **LCP:** optimize hero (preload, compressed, eager) — target <2.5s.
- **CLS:** reserve image/embeds dimensions, no layout-shifting fonts/ads — target <0.1.
- **INP:** lightweight handlers, no long tasks — target <200ms.
- Test on mid-tier mobile + throttled network.

---

# 11. PAGE-BY-PAGE WIREFRAME STRUCTURE

> Format: **section order → component mapping**. Every page = Navbar (top) + Footer + Back-to-top + Skip link + mobile action bar (implicit on all).

## 11.1 Home (`index.html`)
1. Hero Slider (#6)
2. Impact Statistics → Impact Counter (#8) grid
3. About Preview → Feature Split (#12) + CTA (#16-link)
4. Mission & Vision → Mission/Vision Cards (#14)
5. What We Do → Pillar Cards (#10) / Work Masonry (#11)
6. Why Support → Value/Trust Cards (#15-style)
7. Get Involved → 3× CTA Card (#17)
8. Team Preview → Team Card (#25) ×3 + CTA
9. Gallery Preview → Gallery Card (#28) grid + CTA
10. Final Donation CTA → CTA Banner (#16)
11. Footer (#2)

## 11.2 About (`about.html`)
1. Page Hero (#7)
2. Our Story → Feature Split (#12)
3. Journey Since 2022 → Timeline (#13)
4. Mission → Mission/Vision Card (#14)
5. Vision → Mission/Vision Card (#14)
6. Core Values → Value Cards (#15) 4-up
7. Impact Achieved → Impact Counters (#8) + supporting copy
8. Partnerships → Partner Logo Strip (#27)
9. Future Goals → list/icon grid
10. CTA Banner (#16) · Footer

## 11.3 Donate (`donate.html`)
1. Page Hero (#7) + trust strip
2. Why Donations Matter → text block
3. How Donations Help → Pillar Cards (#10)
4. Donation Impact Cards (#18) grid
5. Donation Widget (#19) with Tabs (#20): One-time / Monthly / Corporate
6. Tax Benefits → notice block (80G)
7. FAQ → Accordion (#32)
8. CTA Banner (#16) · Footer

## 11.4 Volunteer (`volunteer.html`)
1. Page Hero (#7)
2. Why Volunteer → text/feature
3. Volunteer Opportunities → Opportunity Cards (#21) grid
4. Volunteer Benefits → icon grid
5. Volunteer Journey → Steps (#22)
6. FAQ → Accordion (#32)
7. Contact CTA → Volunteer Inquiry Form (#35) or CTA Banner (#16) · Footer

## 11.5 Support & Prayers (`support-prayers.html`)
1. Page Hero (#7)
2. Your Support, Our Strength → Feature Split (#12)
3. Ways to Support → icon/card grid
4. Prayer Community → Feature Split + CTA (#16)
5. Share Awareness → Share Buttons (#36)
6. Testimonials → Testimonial Cards/Slider (#26) [placeholder]
7. CTA Banner (#16) · Footer

## 11.6 Celebrate With Ramanishri (`celebrate.html`)
1. Page Hero (#7)
2. Celebrate With Purpose → Feature Split (#12)
3. How It Works → Steps (#22)
4. Occasion Cards (#23): Birthday, Anniversary, Memorial, Festival, Corporate
5. Fundraising Packages → Package Cards (#24)
6. Social Sharing Strategy → Share Buttons (#36) + info
7. Create Campaign CTA → CTA Banner (#16) + Modal (#31, optional)
8. Footer

## 11.7 Gallery (`gallery.html`)
1. Page Hero (#7)
2. (Optional) Gallery Filter (#29) chips
3. Gallery Grid → Gallery Cards (#28) masonry + Lightbox (#30)
4. Load-more / View-all
5. CTA Banner (#16) · Footer

## 11.8 Contact (`contact.html`)
1. Page Hero (#7)
2. Contact Information → info cards + map
3. Contact Form (#34) [with inquiry-type routing]
4. Volunteer Inquiry + Donation Inquiry → CTA cards (#17)
5. FAQ → Accordion (#32)
6. CTA Banner (#16) · Footer

## 11.9 404 (`404.html`)
- Hero-lite message + links back to Home/Donate + search.

---

# 12. DEVELOPMENT SEQUENCE

**Phase 0 — Setup**
- Step 1: Create folder structure (§1); move docs to `/docs`.
- Step 2: Import & rename logo/favicon assets from source kit (§1 mapping); generate favicons + OG image; add `site.webmanifest`.

**Phase 1 — Foundation (CSS)**
- Step 3: `base/_tokens.css` (design system §2).
- Step 4: `base/_reset.css` + `_typography.css`.
- Step 5: `base/_utilities.css` + `_animations.css`.
- Step 6: `components/buttons.css`, `forms.css`, `cards.css` (shared primitives).

**Phase 2 — Global shell**
- Step 7: Navbar (markup + `navbar.css` + `nav.js`).
- Step 8: Footer (markup + `footer.css`) + Newsletter form.
- Step 9: Back-to-top + skip link + mobile action bar + reduced-motion baseline.
- Step 10: `main.css` import bundle + `main.js` orchestrator + `utils.js`.
- Step 11: Decide & implement shared-markup approach (inline + partial reference) per §0 ⚠️.

**Phase 3 — Components**
- Step 12: Hero slider (`hero.css` + `hero-slider.js`).
- Step 13: Reveal-on-scroll (`reveal.js`) + counters (`counter.css` + `counters.js`).
- Step 14: Cards variants (mission/work/team/cta/impact/occasion/package).
- Step 15: Gallery + Lightbox (`gallery.css`, `lightbox.css`, `lightbox.js`).
- Step 16: FAQ accordion, Timeline, Tabs, Modal.
- Step 17: Forms validation (`forms.js`) + Donation widget (`donation.js`) + Share (`share.js`).

**Phase 4 — Pages (content from CONTENT-ARCHITECTURE.md)**
- Step 18: Home (assemble §11.1) — refactor existing index.html into new structure.
- Step 19: About.
- Step 20: Donate (priority — conversion).
- Step 21: Volunteer.
- Step 22: Support & Prayers.
- Step 23: Celebrate With Ramanishri.
- Step 24: Gallery.
- Step 25: Contact.
- Step 26: 404.

**Phase 5 — SEO & Meta**
- Step 27: Per-page meta + OG/Twitter; JSON-LD schemas; `sitemap.xml`, `robots.txt`, canonicals.

**Phase 6 — Media & Optimization**
- Step 28: Replace stock/Unsplash with real, consented photography; convert to WebP/AVIF; add srcset; set dimensions; preload LCP.
- Step 29: Self-host fonts; minify CSS/JS; critical-CSS (optional).

**Phase 7 — QA & Launch**
- Step 30: Accessibility audit (keyboard, screen reader, contrast, axe).
- Step 31: Performance pass (Lighthouse ≥90 mobile + desktop, CWV).
- Step 32: Cross-browser/device testing; form submission/routing test.
- Step 33: Final content/legal review; deploy; post-deploy smoke test + sitemap submit.

---

# 13. TECHNICAL REVIEW CHECKLIST (sign-off before build)

## Architecture
- [ ] Folder structure approved (§1)
- [ ] **Shared-markup approach approved** — inline-per-page vs. JS partials vs. build-include (§0 ⚠️)
- [ ] Clean-URL strategy decided (host rewrites vs. `.html`)
- [ ] Multi-page (MPA) confirmed over single-page

## Design system
- [ ] Color tokens approved (incl. gold-contrast rule §8.4)
- [ ] Type scale, spacing, radius, shadows approved
- [ ] Button/card/form variants approved
- [ ] Logo/favicon variants selected from source kit

## CSS/JS
- [ ] BEM + tokens-first + mobile-first confirmed
- [ ] Breakpoints (480/768/992/1200) confirmed
- [ ] Module list + init-by-presence approach confirmed

## Components
- [ ] Component library (38 items) approved / trimmed
- [ ] Donation widget behavior (tabs, chips, monthly default) confirmed
- [ ] Celebrate campaign flow (modal vs. page) confirmed

## SEO
- [ ] Titles/descriptions (from content doc) confirmed
- [ ] Schema set per page approved
- [ ] sitemap/robots/canonical plan approved

## Accessibility
- [ ] WCAG 2.1 AA target confirmed
- [ ] Focus-ring style approved (visible on light + dark)
- [ ] Contrast pairs verified (esp. muted text, gold usage)

## Performance
- [ ] Lighthouse 90+ target confirmed
- [ ] Font self-hosting approved
- [ ] Image format/lazy/preload plan approved
- [ ] CWV guardrails (LCP/CLS/INP) accepted

## Integrations (need decisions)
- [ ] **Payment/donation gateway** chosen (one-time + recurring) — affects Donate widget
- [ ] **Form backend** chosen (contact/volunteer/newsletter: e.g., service endpoint, email, or third-party) — static site needs an endpoint
- [ ] **Celebrate fundraising**: in-house vs. third-party P2P platform
- [ ] Analytics (privacy-respecting) + consent banner if needed
- [ ] Map provider for Contact

## Sign-off
- [ ] Engineering approval
- [ ] Stakeholder approval
- [ ] **Approval to begin implementation (Phase 0)**

---

*Blueprint only — no HTML/CSS/JS produced. Awaiting approval before implementation begins.*
