# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **brand & design-system reference** for uniworks GmbH (Germany's fastest-growing student staffing service, Munich). It exists to design and prototype Instagram posts, marketing pages, decks, and app/B2B web surfaces that feel native to the brand. There is **no application** here — no build, no bundler, no tests, no `package.json`. Everything is hand-authored static HTML + CSS plus image assets.

Visual fidelity beyond the logo and brand green is an *informed reconstruction* from public sources (no Figma/brand book was provided). Treat synthesized tokens (radii, shadow, motion, secondary colors) as a starting point that internal guidelines may override.

## Running / previewing

Open any `.html` file directly in a browser — there is no dev server. The Playwright MCP server is available for rendering/screenshotting pages; the `.playwright-mcp/` dir holds its scratch output.

**Path coupling (important):**
- `ui_kits/**/*.html` link the shared tokens via `<link rel="stylesheet" href="../../colors_and_type.css">` — that relative depth must hold, so these files only render correctly from their existing location.
- Image references use `UniworksImages/...` paths resolved **relative to the repo root**. A `ui_kits/` page that references images expects to be opened in a context where that root-relative path resolves; moving files breaks asset loading.
- Fonts and icons load from CDNs (Google Fonts IBM Plex, Tabler/Lucide). Pages are **not offline-clean**; flag any CDN dependency you add.

## Source of truth for tokens — read this before any design work

Canonical values (reconciled across all files): **brand green `#2ab54a`**, **IBM Plex Sans / IBM Plex Mono**. Hover/strong green is `#21993d` (`--green-600`). Never reintroduce the old `#3AB44A` / `#2EA03E` greens or DM Sans.

There are **two parallel token systems**. They now agree on values but differ structurally — know which applies:

| File | Tokens | Used by |
|---|---|---|
| `colors_and_type.css` | Full semantic CSS custom properties (`--brand`, `--fg`, `--t-h1`, `--radius-*`, `--space-*`, motion) | **All `ui_kits/` pages** (canonical) |
| `index.html` (root) | Self-contained inline `:root` vars (`--g`, `--black`, …) | The root marketing landing demo only |

Note: IBM Plex Sans' max weight is 700, so display headlines cap at 700 (not 900). `fonts/` is empty — if licensed brand fonts arrive, drop the `.woff2` files there and swap `--font-sans` / `--font-display`.

**For new `ui_kits/` work, import `colors_and_type.css` and use its semantic tokens** — do not hardcode hex values or re-inline a `:root` block. The root `index.html` is the exception (it predates / stands apart from the shared token file); if you touch it, keep its inline vars in sync with the canonical values above.

## Layout

```
colors_and_type.css   ← canonical design tokens (import this in ui_kits work)
DESIGN.md             ← long-form brand spec (landing-page lineage)
README.md             ← brand voice, visual foundations, content/copy rules
index.html            ← standalone marketing landing demo (inline tokens)
UniworksImages/       ← all real brand photography & logos, referenced root-relative
  branding/  logos/  work/  visuals/
ui_kits/
  insta_posts/        ← 1080² Instagram post/carousel templates (primary deliverable)
  marketing_web/      ← uniworks.gmbh recreation (B2B + B2C)
templates/promo/      ← promo-page generator: JSON config → pages/<slug>.html
                        (create-promo.py also patches vercel.json + sitemap.xml;
                        see templates/promo/README.md — use this for event promos)
```

In `ui_kits/insta_posts/`, `index.html` is one carousel; the other named `.html` files (`service-im-schloss.html`, `sap-projekt-duisburg.html`, `sap-print.html`, etc.) are individual post templates, with `*.png` being their rendered exports and `_export.html` a print/export wrapper.

## Non-negotiable brand rules (from README.md / DESIGN.md)

- **One hero color.** Brand green carries everything; there is no secondary brand color. Accents (`--sun`, `--beer`, `--plum`, `--berry`) are for stickers/alerts only and must never compete with green. Never green-on-green.
- **German first, informal "du" for students, "Sie"/"wir" for companies.** Sentence-case headlines (capitalize first word + nouns only); no all-caps body. German number formatting: `15.000+`, `16 €` (thin space before €/%). Inclusive colon forms: *Bewerber:innen*.
- **Single hero element per screen** (one big number, one CTA, or one full-bleed photo). Generous radii, light shadows (no inner shadows/bevels), no SaaS gradients, no repeating textures — photography supplies texture.
- **Photography:** warm, high-saturation, people-in-action (pouring, serving, loading-in). No stock office shots, no B&W, no tilt-shift. Use the real assets in `UniworksImages/work|visuals|branding`.
- **Icons:** flat single-color SVGs in an occupational register; substitute **Lucide** when a custom icon is missing and flag the substitution. Emoji only on social, sparingly, hospitality-themed.

When you make a substitution or assumption the brand can't yet confirm (font, missing icon, reconstructed token), **flag it in the code/output** rather than presenting it as canonical.
