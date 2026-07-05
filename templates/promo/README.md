# Promo-Seiten-Generator

Erzeugt aus einer kleinen JSON-Config eine komplette Promo-Seite im uniworks-Design
(Hero, Stats-Band, Job-Karten, Galerie, **interaktiver Schicht-Kalender**, Gehalt,
Bonus, FAQ, CTA) — identisch aufgebaut wie `/bts-allianz`.

```
templates/promo/
  template.html        ← Seiten-Template (nicht anfassen, außer Design-Änderungen für ALLE Promos)
  create-promo.py      ← Generator-Skript (Python 3, ist auf jedem Mac vorinstalliert)
  faq-standard.json    ← die 15 Standard-FAQ-Fragen (werden automatisch eingebaut)
  bts-allianz.json     ← vollständiges Beispiel (die BTS-Seite entsteht exakt daraus)
  README.md            ← diese Anleitung
```

## Neue Promo-Seite in 4 Schritten (mit Repo-Zugriff)

1. **Config anlegen:** `bts-allianz.json` kopieren, z. B. zu `oktoberfest-2026.json`,
   und die Felder ausfüllen (siehe Feld-Referenz unten).
2. **Bilder ablegen** unter `images/visuals/<EVENT>/` — immer als `.webp`
   (Umwandlung: `cwebp -q 82 foto.jpg -o foto.webp`, Querformat ca. 1200–1600 px breit).
3. **Generieren:**
   ```
   python3 templates/promo/create-promo.py templates/promo/oktoberfest-2026.json
   ```
   Das Skript schreibt `pages/<slug>.html` und trägt die Route automatisch in
   `vercel.json` und `sitemap.xml` ein. Mehrfach ausführen ist sicher (überschreibt
   die Seite, Routen werden nicht doppelt angelegt).
4. **Prüfen & deployen:**
   ```
   python3 -m http.server 8000   →   http://localhost:8000/pages/<slug>.html
   git add -A && git commit -m "feat: promo page /<slug>" && git push
   ```

## Für Teammitglieder MIT Claude, aber OHNE Repo-Zugriff

Du kannst die fertige Config von Claude erstellen lassen und schickst nur die
JSON-Datei + Bilder an eine Person mit Repo-Zugriff (die braucht dann ~1 Minute).

Kopiere diesen Prompt in Claude (claude.ai oder Claude Code) und häng deine
Infos/Screenshots an:

> Erstelle eine JSON-Config für eine uniworks Promo-Seite. Halte dich exakt an
> dieses Schema (Beispiel unten). Regeln:
> - Alle Texte deutsch, Studierende mit „du“ ansprechen, Sentence case.
> - `slug`: nur Kleinbuchstaben/Zahlen/Bindestriche (wird die URL /slug).
> - `headline` darf genau ein `<em>…</em>` enthalten (wird grün hervorgehoben).
> - Icons sind Tabler-Icon-Namen (z. B. ti-music, ti-map-pin, ti-calendar-event,
>   ti-coin-euro, ti-tools-kitchen-2, ti-stairs, ti-moon, ti-truck, ti-glass-full).
> - `calendar.days`: pro Tag `label` (z. B. "Samstag, 11. Juli"), `sub`
>   (z. B. "Konzerttag 1"), und `shifts` mit `name`, optional `time`
>   (Format "07:30 – 19:30 Uhr"), `icon`, `free` (freie Plätze), `total`.
> - `"faq": "standard"` übernimmt unsere Standard-FAQ; einzelne Antworten kannst
>   du über `faq_overrides` (Frage → neue Antwort) anpassen, zusätzliche Fragen
>   über `faq_extra`.
> - Preise/Zahlen deutsch formatieren: `16&nbsp;€`, `15.000+`.
> - Gib NUR das JSON aus.
>
> Hier die Event-Infos: [Ort, Datum, Schichten mit Zeiten und freien Plätzen,
> Lohn, Bonus-Aktion, Besonderheiten …]
>
> [+ hier das komplette bts-allianz.json als Schema-Beispiel einfügen]

Danach: JSON-Datei + Bilder (am besten schon .webp) per Slack/Mail an die Person
mit Repo-Zugriff schicken. Diese legt die Datei in `templates/promo/` ab und führt
Schritt 2–4 oben aus.

## Feld-Referenz

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `slug` | ✓ | URL-Pfad: `/slug`, Datei `pages/slug.html` |
| `title`, `description` | ✓ | Browser-Titel + Google-Beschreibung |
| `social_description` | – | WhatsApp/Instagram-Vorschautext (sonst = description) |
| `eyebrow` | – | Badge über der Headline (`icon`, `text`) |
| `headline`, `intro` | ✓ | H1 (mit `<em>` für grün) + Einleitungstext |
| `meta` | – | Icon-Zeile unter dem Intro (Ort, Datum, Lohn) |
| `hero_image` | ✓ | Großes Bild rechts (`src`, `alt`) |
| `hero_buttons`, `cta_buttons` | – | Buttons (Standard: „Jetzt registrieren“ + App) |
| `stats` | ✓ | Grünes Zahlen-Band, je `big` + `small` (2–5 Einträge) |
| `jobs_heading`, `jobs_intro`, `jobs` | ✓ | Job-Karten: `title`, `icon`, `image`, `alt`, `text`, `tags` |
| `gallery` | – | Bildergalerie unter den Jobs (`src`, `alt`) |
| `calendar` | ✓ | `year`, `month` (1–12), `snapshot_note`, `days` (siehe oben) |
| `pay` | ✓ | `amount`, `suffix`, `text` |
| `bonus` | – | Bonus-Karte (`heading`, `badge_big`, `badge_small`, `text`); weglassen = Sektion erscheint nicht |
| `faq`, `faq_overrides`, `faq_extra` | – | `"standard"` = 15 Standard-Fragen aus `faq-standard.json` |
| `cta` | ✓ | Abschluss-Box (`heading`, `text`) |

Kalender-Logik: Tage mit `free > 0` werden voll grün („Plätze frei“), Tage, deren
Schichten alle `free: 0` haben, hellgrün durchgestrichen („ausgebucht“). Hover
(Desktop) bzw. Tippen (Mobil) zeigt die Schichten mit Zeiten und freien Plätzen.
Wochentags-Versatz und Monatslänge berechnet das Skript selbst.

## Wichtig

- **Bildrechte klären**, bevor Künstler-/Pressefotos live gehen.
- Verfügbarkeiten im Kalender sind ein **Snapshot** — `snapshot_note` mit Datum
  („Stand: …“) pflegen und die Seite bei Bedarf neu generieren.
- Design-Änderungen, die alle Promos betreffen, gehören in `template.html` —
  danach alle Configs einmal neu generieren.
