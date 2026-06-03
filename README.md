# Uniworks Design System

A working design system for **uniworks GmbH** — Germany's fastest-growing student staffing service, headquartered in Munich. Use it to design and prototype Instagram posts, marketing pages, decks, and the app/B2B web product in a way that feels native to the brand.

> Logo, brand green, and core typography are real. Photography (event/hospitality/student work) is referenced from the public uniworks site and Instagram. Many secondary tokens (radii, shadow, motion) are synthesized from the brand mark + landing page; treat them as a starting point and overwrite anything that conflicts with internal guidelines.

---

## What uniworks does

- A **student staffing pool** (>15,000 students, >7,000 active) that companies across Germany can book on-demand for shift work.
- Industries served: **Catering, Einzelhandel (retail), Events, Gastronomie, Hotellerie, Logistik, Promotion, Corporate**.
- Two audiences, two front doors:
  - **Studierende** — flexible jobs alongside university, min. **16 €/h**, accepted/cancelled inside the uniworks app.
  - **Unternehmen** — book vetted student labor by the shift, no long-term commitment.
- Munich roots (WERK1, LMU, TUM startup ecosystem), DEHOGA Bayern member.
- Big events on the CV: Adele Munich residency, AC/DC, EURO 2024, Oktoberfest service.

## Products / surfaces represented here

| Surface | Status | Location |
|---|---|---|
| Instagram post templates (this project's primary ask) | ✅ Built | `ui_kits/insta_posts/` |
| Marketing site (uniworks.gmbh) | ✅ Partial recreation | `ui_kits/marketing_web/` |
| Student app | ⏳ Stub — flagged for follow-up | `ui_kits/student_app/` |

## Source material

Everything here was synthesised from publicly available material — there was **no Figma file or codebase attached**, so visual fidelity beyond the logo and brand green is an informed reconstruction.

- **Logo (provided)** — `uploads/Screenshot 2026-05-20 at 17.44.12.png` → extracted into `assets/logo-*.png`
- **Marketing site** — https://www.uniworks.gmbh/ — referenced for category icon set, photography style, voice, page architecture
- **Instagram** — https://www.instagram.com/uniworks.gmbh/ — referenced for post layouts and tone (not deeply scraped — flag if you want me to model specific posts)
- **DEHOGA Bayern partner page** — used to confirm the partnership badge

If you have a Figma library, brand book, or webflow access, please re-attach and I'll re-tighten everything below.

---

## Content fundamentals — voice & copy

uniworks writes like a warm Munich friend who happens to also be a professional staffing partner. The tone shifts slightly per audience but the texture is consistent.

### Language
- **German first.** Almost all surfaces are German. English appears occasionally for international shifts (Adele crew, EURO 2024) but is not the default.
- **Studierende side: informal "du".** Always. "Jetzt entdecken", "In der uniworks App kannst du täglich aus verschiedenen Schichten wählen".
- **Unternehmen side: informal-professional "Sie" / collective "wir".** "uniworks bietet Unternehmen…" "Mehr erfahren".
- **Bavarian flavor on social.** "Servus", "Prost!", "Wiesn-Vibes" — sparingly, mostly on Instagram, never on a B2B sales page.
- **Inclusive forms.** Gendered nouns use the colon variant: *Bewerber:innen*, *Mitarbeiter:innen*.

### Casing
- **Sentence-case for headlines.** Capitalize only the first word and nouns ("Deutschlandweit flexibel Personal buchen.").
- **No ALL CAPS bodycopy.** All-caps is reserved for eyebrows and stat labels, tracked +0.12em.
- **Numbers with thousands-dot.** German convention: `15.000+`, `185.000 Stunden`, `16 €`. Always a thin non-breaking space before `€` and `%` ideally.

### Vocabulary cues
- Big numbers do a lot of work — *"Über 10.000 Schichten erfolgreich besetzt"*, *"Mehr als 185.000 Stunden erbrachte Arbeitsleistung"*.
- Concrete jobs, not abstractions — *Biergarten, Kassendienst, Stagehands, Bankettservice* — never "F&B vertical staffing solution".
- Action verbs in CTAs — *Buchen, Entdecken, Mehr erfahren, Jetzt bewerben*.
- Trust-builders — *zuverlässig, vetted, faire Bezahlung, kurzfristig verfügbar*.

### Emoji & decoration
- **Emoji: rare and seasonal.** Mostly on Instagram captions, not in product. When used: 🍻 (Oktoberfest), 🎤 (concerts), 💪, ✅, 📍 — always in the warm "events / hospitality" register. Never abstract corporate emoji (📊 📈).
- **Punctuation is conversational.** Em-dashes, exclamation marks where warranted ("Prost!"), winks (`;)`) on social only.
- **No business-jargon clichés.** Avoid "synergy", "leverage", "ecosystem-of-talent". Say what you mean.

### Examples to imitate

> **Hero (B2C, app-side).** *Flexible Jobs während des Studiums finden. In der uniworks App kannst du täglich aus verschiedenen Schichten wählen und die Jobs annehmen, die sich am besten mit deinem Hochschulalltag vereinbaren lassen. Dabei zahlen wir dir immer mindestens 16 € pro Stunde.*
>
> **Hero (B2B).** *Deutschlandweit flexibel Personal buchen. uniworks bietet Unternehmen aus allen Branchen unkomplizierte Personallösungen, um Belastungsspitzen abzufedern oder langfristig den Personalbedarf zu decken, ohne dabei Verpflichtungen eingehen zu müssen.*
>
> **Instagram job-post.** *Servus! Wir suchen 30 Service-Kräfte fürs Adele-Konzert am 24.08. 🎤 Schicht ab 14 Uhr, 18 €/h. Jetzt swipen und annehmen ➡️*

---

## Visual foundations

### Color
- **One hero color.** `--brand: #2ab54a` carries the brand. Used as solid backgrounds on Instagram tiles, as primary buttons, as the active state in nav. There is no secondary brand color — the green does the work.
- **Neutrals are slightly warm-charcoal,** not pure black. `--ink-950: #0d1410` has a faint green undertone so it sits next to the brand without clashing.
- **Accents** (`--sun`, `--beer`, `--plum`, `--berry`) exist for stickers, alerts, and the occasional "Wiesn" treatment — they are *not* part of the primary palette and should never compete with green for attention.
- **Pairings.** White-on-green, green-on-white, ink-on-white. Green-on-ink only for a "night mode" social variant; avoid green-on-green at all costs.

### Typography
- **IBM Plex Sans across the board** (Google Fonts). Friendly, German-language-safe (full umlaut coverage), wide weight range. The logo's rounded geometry maps cleanly onto it.
- **Heavy display weights.** Headlines are 700 (IBM Plex Sans' heaviest), set tight (`letter-spacing: -0.02em`, `line-height: 0.95–1.02`). The page wants to *shout* the number.
- **Body 16/24.** Comfortable for long German compounds.
- **IBM Plex Mono** appears only for shift codes, IDs, and timestamps. Never for body copy.
- **No second display face.** A single family in many weights gives the brand its consistency — resist adding a serif or script.

> ⚠️ **Font note for the user:** IBM Plex Sans is the chosen substitute because no licensed font files were attached — note its max weight is 700, so display headlines cap at 700 rather than the 900 a heavier display face would allow. If uniworks has a licensed brand font (e.g. a custom or a paid display family), please drop the `.woff2` files into `fonts/` and I'll swap `--font-sans` / `--font-display`.

### Spacing & layout
- 4-px base grid. Tokens `--space-1…9` (4, 8, 12, 16, 24, 32, 48, 64, 96).
- **Wide marketing pages, generous vertical air** (sections ≥ `--space-9`). Posts and app screens use tighter `--space-5`.
- **Single hero element per screen.** A big number, a single CTA, or one full-bleed photo. The site avoids cluttered grids of mixed importance.

### Backgrounds
- **Solid green** is the brand's signature Instagram background.
- **Full-bleed photography** for "feel" sections — warm event/hospitality images, lots of action (pouring, serving, loading-in), high color saturation but never neon.
- **Mosaic photo wall** on the homepage hero — a tiled 4–6 column grid of square job-context photos. This is a strong brand motif worth preserving in decks.
- **Off-white (`--ink-50`)** for B2B body sections; the green is too loud to live behind body copy.
- **No gradients** as a primary surface treatment. A subtle green-soft → white in a hero is fine; avoid the bluish-purple SaaS gradient cliché entirely.
- **No repeating patterns / textures** in the current brand. Photography supplies the texture.

### Corners, borders, shadows
- **Generous radii.** `--radius-lg: 22px` for cards, `--radius-xl: 32px` for hero/photo tiles, `--radius-pill` for buttons and status chips. The logo lockup itself is a rounded square, so rounded everywhere.
- **Borders are subtle.** `1px solid var(--border)` (`#e1e6e3`). On green surfaces, use `rgba(255,255,255,0.28)` for divider lines.
- **Shadow system is light.** `--shadow-xs/sm` for resting cards, `--shadow-md` on hover, `--shadow-brand` (green-tinted) only for primary CTAs to make them feel like they're glowing on white.
- **No inner shadows.** Depth comes from elevation, not bevels.

### Animation & state
- **Easing.** `cubic-bezier(0.2, 0.8, 0.2, 1)` for everything default — quick, optimistic. A spring (`0.34, 1.56, 0.64, 1`) is reserved for "you got the shift" success moments.
- **Durations.** Fast (140 ms) for taps, base (220 ms) for hover, slow (420 ms) for page-level moves.
- **Hover.** Buttons darken to `--brand-strong` and lift `translateY(-1px)` with `--shadow-brand` strengthening. Cards lift to `--shadow-md`. Links shift to `--green-700`.
- **Press.** Buttons compress to `scale(0.98)` and lose the lift. Color stays the same — the scale is the affordance.
- **Page transitions / scroll.** Fades and small upward translates (`translateY(8px) → 0`); no zooms, no flips, no parallax. The brand is energetic but grounded.

### Photography
- **Warm, high-saturation, human-centered.** Hands at work — pouring beer, scanning a register, plating banquet food, hauling cable on a stage build.
- **Color cast: warm gold + brand-green-when-possible.** Sunlit biergartens, stage lights, evening shift glow.
- **No stock-photo office shots.** No suited execs in glass boardrooms. The whole brand is "the people behind the shift".
- **No black-and-white.** No heavy grain. No tilt-shift.

### Transparency & blur
- Used very sparingly. A `backdrop-filter: blur(20px)` on a sticky nav over a photo, OK. Frosted glass overlays in product UI, not yet. Generally the brand is opaque and confident.

### Layout rules (fixed elements)
- **App + B2B web nav:** sticky top, white background, brand wordmark/logo on the left, primary CTA on the right. Height ≈ 64–72 px.
- **Instagram posts:** 1080×1080 square. Logo bug bottom-right at ~80 px with 48 px margin. Headline anchored top-left or center.
- **Slides:** 16:9 (1920×1080). Title slides full green; content slides white with a green accent block in one corner.

---

## Iconography

uniworks uses **flat, single-color SVG icons** with a clear "occupational" register — a beer mug, a hotel bell, a clipboard, a price tag — rather than abstract UI glyphs. They look like simplified pictograms, all on the same grid, all in `--brand` or `--ink-900`.

### What's on the site

The marketing site references these category icons (Webflow CDN, listed in `assets/SOURCE_URLS.md`):

`catering.svg · einzelhandel.svg · pass.svg (events) · gastro.svg · hotel.svg · logistik.svg · promo.svg · briefcase.svg (corporate) · personal.svg · job.svg · students.svg · pin.svg`

These appear to be a small custom set rather than a public icon font. I have **not** been able to download them (sandbox can't reach the CDN), so:
- **For previews in this design system**, cards reference them by URL — they load when the page is opened in a browser.
- **For production work**, please drop the originals into `assets/icons/` so prototypes work offline.
- **For UI work where a custom icon doesn't exist yet**, use **Lucide** (https://lucide.dev/) — the closest match in stroke weight and friendliness. The marketing site icons appear filled / chunky; Lucide's `filled` set or a 2 px stroke linework reads as native. Flag any Lucide substitution in code.

### Other usage
- **Emoji:** social media only, sparingly, hospitality-themed (see Content Fundamentals).
- **Unicode characters as icons:** only `→` and `↗` (in CTA text) and `·` as a separator. No box-drawing, no ★★★★★.
- **No icon font.** Standalone SVGs only.

---

## Index — what lives where

```
README.md                 ← you are here
SKILL.md                  ← Agent Skills metadata + invocation
colors_and_type.css       ← all design tokens (CSS custom properties)
fonts/                    ← drop licensed brand fonts here (currently empty)

assets/
  logo-square-green.png   ← primary brand mark on green tile (Instagram bug)
  logo-mark-white.png     ← knockout white mark on transparent — for use on green
  logo-mark-black.png     ← ink mark on transparent — for use on white
  SOURCE_URLS.md          ← external CDN refs (category icons, OG image)

preview/                  ← cards rendered into the Design System tab
  type-display.html  …    ← one specimen / token / state per file

ui_kits/
  insta_posts/            ← square 1080² Instagram post templates  ★ primary deliverable
  marketing_web/          ← uniworks.gmbh recreation (B2B + B2C landing)
  student_app/            ← stub for app screens (flagged — needs source material)
```
