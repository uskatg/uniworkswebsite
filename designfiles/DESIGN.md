# Uniworks — Design System & Brand Reference

> This document is the single source of truth for all design decisions across the Uniworks website redesign. Every component, page, and interaction must align with these specifications.

---

## 1. Brand Identity

**Company:** uniworks GmbH  
**Website:** https://www.uniworks.gmbh  
**Tagline:** Deutschlands schnellst wachsender Personaldienstleister  
**Industry:** Flexible staffing / temp work platform  
**Target Audiences:** University students (workers) + Companies (employers)  
**Tone:** Modern, trustworthy, energetic, approachable — startup energy with professional credibility

---

## 2. Color Palette

### Primary Colors

| Name            | Hex       | Usage                                              |
|-----------------|-----------|----------------------------------------------------|
| **Brand Green** | `#2ab54a` | Primary CTA buttons, active states, icons, accents |
| **Pure White**  | `#FFFFFF` | Backgrounds, card surfaces, text on green          |
| **Near Black**  | `#111111` | Primary headings, body text                        |

### Secondary / Supporting Colors

| Name              | Hex       | Usage                                          |
|-------------------|-----------|------------------------------------------------|
| **Soft Gray**     | `#6B7280` | Secondary text, metadata, disabled states      |
| **Light Gray BG** | `#F5F5F5` | Section backgrounds, card backgrounds          |
| **Border Gray**   | `#E5E7EB` | Dividers, card borders, input outlines         |
| **Green Hover**   | `#21993d` | Darker green for hover state on primary button |
| **Green Light**   | `#EBF9EE` | Subtle green tints, success states, highlights |

> **Note:** The exact brand green (`#2ab54a`) was extracted from the app icon (AppIcon.webp). Verify against brand assets if a Figma or style guide becomes available.

---

## 3. Typography

### Font Stack

**Primary Font:** `IBM Plex Sans`  
**Fallback Stack:** `"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif`  
**Source:** Google Fonts / IBM CDN

### Type Scale

| Role             | Size      | Weight | Line Height | Usage                          |
|------------------|-----------|--------|-------------|--------------------------------|
| **Display**      | 56–72px   | 800    | 1.1         | Hero section main headline     |
| **H1**           | 40–48px   | 700    | 1.15        | Page titles                    |
| **H2**           | 28–36px   | 700    | 1.2         | Section headings               |
| **H3**           | 20–24px   | 600    | 1.3         | Card titles, subsections       |
| **Body Large**   | 18px      | 400    | 1.6         | Lead paragraphs, intro text    |
| **Body**         | 16px      | 400    | 1.6         | Standard body copy             |
| **Small / Meta** | 14px      | 400    | 1.5         | Labels, dates, captions        |
| **Caption**      | 12px      | 400    | 1.4         | Legal text, footnotes          |

### Typography Rules
- Headings: near-black `#111111`, tight letter-spacing (`-0.02em` for large sizes)
- Body text: `#374151` (slightly softer than pure black for readability)
- All-caps labels: `letter-spacing: 0.08em`, size 12px, weight 600
- No decorative or serif fonts — strict sans-serif throughout

---

## 4. Logo & Icon

### App Icon
- White line-art icon (person + arrow) on **Brand Green** rounded square background
- Corner radius on app icon: ~22% of width (iOS standard)
- Icon is purely geometric and minimal — no gradients, no shadows

### Word Mark
- Lowercase: **"uniworks"**
- Always lowercase, never capitalized
- On light backgrounds: near-black
- On dark/green backgrounds: white

### Usage Rules
- Minimum clear space: equal to the height of the "u" in the wordmark on all sides
- Never stretch, rotate, or add effects to the logo
- Never place on busy photographic backgrounds without a solid background block

---

## 5. Spacing & Layout

### Grid
- **Max content width:** 1280px
- **Gutter:** 24px (mobile), 32px (tablet), 40px (desktop)
- **Columns:** 4 (mobile) / 8 (tablet) / 12 (desktop)

### Spacing Scale (8px base)
```
4px   — xs  (tight internal padding)
8px   — sm  (between inline elements)
16px  — md  (standard component padding)
24px  — lg  (card padding, form fields)
32px  — xl  (between components)
48px  — 2xl (section internal padding)
64px  — 3xl (between major sections)
96px  — 4xl (hero padding, major breaks)
128px — 5xl (large hero areas)
```

---

## 6. Component Styles

### Buttons

**Primary (Green)**
- Background: `#2ab54a`
- Text: `#FFFFFF`, 16px, weight 600
- Padding: `14px 28px`
- Border radius: `8px`
- Hover: background `#21993d`, slight shadow
- Active: scale `0.98`

**Secondary (Outlined)**
- Background: transparent
- Border: `2px solid #2ab54a`
- Text: `#2ab54a`, 16px, weight 600
- Padding: `12px 26px`
- Border radius: `8px`

**Ghost / Text Button**
- No border, no background
- Text: `#111111` or `#2ab54a`
- Underline on hover

**Full-Width CTA (Mobile/App style)**
- Width: 100%
- Background: `#2ab54a`
- Border radius: `12px`
- Height: `52px`
- Used in job booking flows and mobile layouts

### Cards
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Border radius: `12px`
- Box shadow: `0 2px 8px rgba(0,0,0,0.06)`
- Hover shadow: `0 8px 24px rgba(0,0,0,0.10)`
- Padding: `24px`

### Navigation
- Background: white, with bottom border or subtle shadow on scroll
- Logo left-aligned
- Nav links: 16px, weight 500, `#111111`
- Active/hover: `#2ab54a`
- CTA button in nav: Primary green button "App herunterladen" or "Jetzt starten"
- Mobile: hamburger menu → full-screen overlay

### Segment / Tab Selector (App pattern)
- Pill-shaped container: `background #F5F5F5`, `border-radius: 100px`
- Active tab: white pill with subtle shadow
- Text: 14px, weight 500

### Input Fields
- Height: 48px
- Border: `1px solid #E5E7EB`
- Border radius: `8px`
- Focus border: `#2ab54a`
- Placeholder: `#9CA3AF`
- Padding: `0 16px`

---

## 7. Imagery & Photography

### Style
- Real, candid photography of students at work
- Warm, natural lighting — avoid overly staged stock photos
- High contrast, vibrant — images should feel energetic
- Show diversity of job types: events, catering, retail, logistics, hospitality

### Available Image Categories (`/UniworksImages/`)

**Branding**
- `AppIcon.webp` — brand green app icon
- `UniworksIcon.webp` — black/white icon variant
- `UWTeam.webp` — founding team photo
- `iPhoneApp.webp`, `iPhoneApp2..webp`, `iPhoneApp3.webp`, `iPhoneApp4.webp` — app UI mockups

**Work / Jobs** (`/work/`)
- Ausschank (bar service), Bankettservice, Bühnenaufbau (stage setup)
- Catering, EventShuttle, FanBotschafter (fan ambassador)
- Frühstücksservice, Kassendienst (cashier), Kellnern (waitering)
- Messeaufbau (trade fair setup), ProduktPromotion, PromoterNY
- PromotionKaufland series, Runner, SchulCatering
- Service, Stagehands, Streckenposten
- SupermarktNeueröffnung, VIPCatering, WarenEinräumen

**Visuals / Events** (`/visuals/`)
- ACDC, AdeleMesse, Einkaufen, EM (European Championship), Logistik, OlympiaHalle

**Partner Logos** (`/logos/`)
- DEHOGA, DEHOGABayern, JYSK, LMUIEC, MBS, mTU, Raeder, TUM, WERK1
- AbsolventenKongress, Driver
- App store badges: AppStore.svg, PlayStore.svg

### Photography Rules
- Always show people in action, not posed standing
- Event imagery should feel large-scale and exciting
- Food/catering images should look premium
- Avoid low-resolution images — all visuals should be retina-ready

---

## 8. Key Content & Messaging

### Hero Headline Options
- "Deutschlands schnellst wachsender Personaldienstleister"
- "Willkommen bei uniworks"
- "Flexible Jobs für Studierende. Zuverlässiges Personal für Unternehmen."

### Social Proof / Stats
| Stat | Value |
|------|-------|
| Registered users | **16.000+** |
| Shifts filled | **10.000+** |
| Hours worked | **185.000+** |
| Students | **15.000+** |
| Skilled professionals | **650+** |

### For Students (Für Studierende)
- Headline: "Flexible Jobs während des Studiums finden"
- Key benefit: Mindestens **€16/Stunde** guaranteed
- CTA: "Jetzt bewerben" / "App herunterladen"

### For Companies (Für Unternehmen)
- Headline: "Deutschlandweit flexibel Personal buchen"
- Key benefit: No long-term obligations, fast booking
- CTA: "Jetzt anfragen" / "Mehr erfahren"

### Service Categories (Navigation Submenu)
1. Logistik (Logistics)
2. Event
3. Catering
4. Einzelhandel (Retail)
5. Gastronomie & Hotellerie (Gastronomy & Hospitality)
6. Promotion
7. Büro (Office/Corporate)

### Navigation Links
- Für Studierende
- Für Unternehmen
- Über Uns
- Blog
- FAQ

### Footer Links
- Startseite, Für Studierende, Für Unternehmen, Über Uns, Blog, News, FAQ
- Impressum, Datenschutz
- Instagram (social)

---

## 9. Motion & Interaction

- **Transitions:** `200–300ms ease-out` for most UI interactions
- **Hover lift:** cards translate `-2px` on hover with shadow increase
- **Button press:** scale `0.97–0.98` on active
- **Page sections:** fade-in + subtle upward translate on scroll into view
- **No heavy animations** — keep performance budget tight, especially on mobile

---

## 10. Brand Partnerships (Footer / Trust Section)

Display partner logos in a horizontal strip:
- DEHOGA Bayern
- WERK1 (Munich startup hub)
- Absolventenkongress
- LMU Innovation & Entrepreneurship Center
- TUM (Technical University of Munich)

---

## 11. App Store Presence

- Available on iOS (App Store) and Android (Google Play)
- App badges: use official `AppStore.svg` and `PlayStore.svg` from `/logos/`
- App UI screenshots available in `/branding/iPhoneApp*.webp`
- App name: **"Schichten finden"** (Find Shifts) — core student-facing value prop

---

## 12. Page Structure Overview

```
/                   → Landing page (hero, stats, dual CTA, services, partners)
/fur-studierende    → Student-focused landing (how it works, app download, job types)
/fur-unternehmen    → Company landing (services, booking flow, sectors)
  /logistik
  /event
  /catering
  /einzelhandel
  /gastronomie-hotellerie
  /promotion
  /buro
/uber-uns           → About / Team
/blog               → Blog listing
/faq                → FAQ
/impressum          → Legal
/datenschutz        → Privacy Policy
```

---

## 13. Design Principles

1. **Green-first:** The brand green `#2ab54a` is the single most recognizable element — use it consistently for all interactive and action elements.
2. **Clean & fast:** No visual clutter. White space is intentional. The design should feel as clean as the mobile app.
3. **Dual-audience clarity:** Every page must be immediately clear whether it is for students or companies. The split is fundamental to the brand.
4. **Mobile-first:** The primary product is a mobile app. The website must feel native on mobile.
5. **Trust through proof:** Stats, partner logos, and real photography build the credibility the brand needs as a growing player.
6. **German-language primary:** All copy is German. If bilingual support is added later, German always leads.
