# Promo-Seite erstellen — Anleitung fürs Team

Mit dieser Anleitung erstellst du in ~10 Minuten eine neue Promo-Seite für
uniworks.gmbh (wie www.uniworks.gmbh/bts-allianz) — ganz ohne Zugriff aufs
Repo. Du brauchst nur **Claude** (claude.ai reicht).

## So funktioniert's

Du lässt Claude eine Config-Datei (JSON) erstellen und schickst sie zusammen
mit den Bildern an die Person mit Repo-Zugriff. Die Seite wird daraus
automatisch generiert — Design, FAQ, Kalender-Interaktivität usw. sind fix,
du lieferst nur die Event-Infos.

### Schritt 1: Infos sammeln

- **Event:** Name, Ort, Datum
- **Schichten pro Tag:** Art (z. B. Catering, Stagehand), Uhrzeit,
  wie viele Plätze frei / insgesamt (Screenshots aus dem Schichttool reichen —
  Claude liest sie aus)
- **Lohn** und ggf. **Bonus-Aktion** (z. B. Willkommensbonus)
- **3–6 Bilder** (Querformat, mind. 1200 px breit; Bildrechte müssen geklärt sein!)

### Schritt 2: Prompt an Claude

Lade zuerst die Datei **`vorschau-template.html`** (bekommst du zusammen mit
dieser Anleitung) mit in den Chat hoch. Kopiere dann den kompletten Block unten
in Claude, häng deine Infos/Screenshots an und ersetze den Teil in
[eckigen Klammern]:

---

Erstelle eine JSON-Config für eine uniworks Promo-Seite. Halte dich exakt an das
Schema des Beispiels unten. Regeln:

- Alle Texte deutsch, Studierende mit „du“ ansprechen, Sentence case (keine
  DURCHGEHENDE GROSSSCHREIBUNG).
- `slug`: nur Kleinbuchstaben/Zahlen/Bindestriche — wird die URL (z. B. /oktoberfest-2026).
- `headline` darf genau ein `<em>…</em>` enthalten (wird grün hervorgehoben).
- Icons sind Tabler-Icon-Namen, z. B. ti-music, ti-map-pin, ti-calendar-event,
  ti-coin-euro, ti-tools-kitchen-2 (Catering), ti-stairs (Stagehand), ti-moon
  (Nachtschicht), ti-truck (Logistik), ti-glass-full (Ausschank), ti-confetti (Event).
- `calendar.days`: nur Tage mit Schichten eintragen. Pro Tag: `label`
  ("Samstag, 11. Juli"), `sub` ("Konzerttag 1" / "Aufbau" …) und `shifts` mit
  `name`, optional `time` (Format "07:30 – 19:30 Uhr"), `icon`, `free` (freie
  Plätze), `total`. Ausgebuchte Schichten mit `free: 0` trotzdem auflisten.
- `"faq": "standard"` übernimmt die 15 uniworks-Standard-Fragen. Einzelne
  Antworten über `faq_overrides` anpassen (z. B. Lohn-Monat, Dresscode),
  zusätzliche eventspezifische Fragen über `faq_extra`.
- Bildpfade nach dem Muster `/images/visuals/EVENTNAME/Bild.webp` benennen.
- Zahlen deutsch formatieren: `16&nbsp;€`, `15.000+`.
- `bonus` nur ausfüllen, wenn es wirklich eine Bonus-Aktion gibt, sonst weglassen.
- Gib NUR das fertige JSON aus, keinen weiteren Text.

Meine Event-Infos: [Ort, Datum, Schichten mit Zeiten und freien Plätzen, Lohn,
Bonus-Aktion, Besonderheiten — oder Screenshots anhängen]

Schema-Beispiel (die BTS-Seite wurde exakt daraus generiert):

```json
{
  "slug": "bts-allianz",
  "title": "BTS in der Allianz Arena — dein Konzert-Job | uniworks",
  "description": "Arbeite beim BTS-Konzertwochenende in der Allianz Arena: Catering- und Stagehand-Schichten vom 9. bis 13. Juli 2026, mindestens 16 € pro Stunde. Freie Plätze im Kalender checken und in der uniworks App buchen.",
  "social_description": "Catering- und Stagehand-Schichten beim BTS-Konzertwochenende in der Allianz Arena (11. + 12. Juli 2026). Jetzt registrieren und Schicht in der uniworks App sichern.",
  "eyebrow": { "icon": "ti-music", "text": "Konzert-Job · München" },
  "headline": "Dein Einsatz beim <em>BTS-Konzert</em> in der Allianz Arena",
  "intro": "Am 11. und 12. Juli 2026 spielt BTS zwei Abende in der Allianz Arena – und du kannst backstage dabei sein. Wir suchen Studierende für Catering- und Stagehand-Schichten rund um das Konzertwochenende. Registriere dich jetzt und sichere dir deine Schicht direkt in der uniworks App.",
  "meta": [
    { "icon": "ti-map-pin", "text": "Allianz Arena, München" },
    { "icon": "ti-calendar-event", "text": "9.–13. Juli 2026" },
    { "icon": "ti-coin-euro", "text": "mind. 16&nbsp;€ pro Stunde" }
  ],
  "hero_image": { "src": "/images/visuals/BTS/BTSPromo4.webp", "alt": "BTS live im Stadion – Konfettiregen über der Bühne" },
  "stats": [
    { "big": "11. + 12. Juli", "small": "Konzertabende: Samstag & Sonntag" },
    { "big": "5", "small": "Einsatztage inkl. Auf- & Abbau" },
    { "big": "Catering & Stagehand", "small": "Schichtarten" },
    { "big": "16&nbsp;€", "small": "Stundenlohn – mindestens" }
  ],
  "jobs_intro": "Zwei Jobs, ein Wochenende, 70.000 Fans pro Abend: Such dir aus, ob du das Stadion kulinarisch versorgst oder rund um die Bühne mit anpackst.",
  "jobs": [
    {
      "title": "Catering",
      "icon": "ti-tools-kitchen-2",
      "image": "/images/visuals/BTS/BTSPromoCatering.webp",
      "alt": "Catering-Einsatz im Stadion",
      "text": "Du unterstützt die Gastronomie-Teams in der Arena: Speisen und Getränke vorbereiten, ausgeben und die Stände am Laufen halten – vom Fan-Bereich bis zur VIP-Hospitality. Du arbeitest im Team, eine Einweisung bekommst du vor Ort.",
      "tags": ["Fr · Sa · So", "keine Erfahrung nötig"]
    },
    {
      "title": "Stagehand",
      "icon": "ti-stairs",
      "image": "/images/visuals/BTS/BTSPromoStagehands.webp",
      "alt": "Stagehands beim Bühnenaufbau im Stadion",
      "text": "Du hilfst rund um die Bühne mit: Technik und Equipment ausladen, beim Aufbau unterstützen und nach der letzten Show wieder verladen. Dafür bist du ganz nah am Konzert dran und hast die Chance, die Show hautnah mitzuerleben – näher als jeder Fan im Innenraum.",
      "tags": ["Do · Fr · So/Mo (Nachtschicht)", "anpacken statt zuschauen"]
    }
  ],
  "gallery": [
    { "src": "/images/visuals/BTS/BTSPromo2.webp", "alt": "BTS auf der Bühne vor dem Publikum" },
    { "src": "/images/visuals/BTS/BTSPromo3.webp", "alt": "BTS – Gruppenporträt" },
    { "src": "/images/visuals/BTS/BTSPromo5.webp", "alt": "ARMY-Lightsticks im ausverkauften Stadion" }
  ],
  "calendar": {
    "year": 2026,
    "month": 7,
    "snapshot_note": "Stand: 5. Juli 2026 – tagesaktuelle Verfügbarkeit siehst du in der uniworks App.",
    "days": {
      "9": {
        "label": "Donnerstag, 9. Juli", "sub": "Aufbau",
        "shifts": [
          { "name": "Stagehand", "time": "13:30 – 23:30 Uhr", "icon": "ti-stairs", "free": 2, "total": 5 },
          { "name": "Stagehand (2 weitere Schichten)", "icon": "ti-stairs", "free": 0, "total": 15 }
        ]
      },
      "10": {
        "label": "Freitag, 10. Juli", "sub": "Aufbau & Vorbereitung",
        "shifts": [
          { "name": "Stagehand", "time": "07:30 – 19:30 Uhr", "icon": "ti-stairs", "free": 8, "total": 10 },
          { "name": "Catering", "time": "16:00 – 22:00 Uhr", "icon": "ti-tools-kitchen-2", "free": 3, "total": 4 },
          { "name": "Stagehand & Stagehand Light", "icon": "ti-stairs", "free": 0, "total": 10 },
          { "name": "Catering", "icon": "ti-tools-kitchen-2", "free": 0, "total": 4 }
        ]
      },
      "11": {
        "label": "Samstag, 11. Juli", "sub": "Konzerttag 1",
        "shifts": [
          { "name": "Catering (alle Schichten)", "icon": "ti-tools-kitchen-2", "free": 0, "total": 4 }
        ]
      },
      "12": {
        "label": "Sonntag, 12. Juli", "sub": "Konzerttag 2",
        "shifts": [
          { "name": "Stagehand – Nachtschicht (Abbau)", "time": "21:00 – 07:00 Uhr", "icon": "ti-moon", "free": 16, "total": 43 },
          { "name": "Catering (alle Schichten)", "icon": "ti-tools-kitchen-2", "free": 0, "total": 4 }
        ]
      },
      "13": {
        "label": "Montag, 13. Juli", "sub": "Abbau (Nachtschicht ab So.)",
        "shifts": [
          { "name": "Stagehand – Nachtschicht ab So.", "time": "21:00 – 07:00 Uhr", "icon": "ti-moon", "free": 16, "total": 43 }
        ]
      }
    }
  },
  "pay": {
    "amount": "16&nbsp;€",
    "suffix": "pro Stunde – mindestens",
    "text": "Bei uniworks legen wir großen Wert auf faire Bezahlung: Du bekommst bei uns immer <strong>mindestens 16&nbsp;€ pro Stunde</strong>. Für einzelne Schichten – etwa die Abbau-Nachtschicht – legen wir einen Bonus obendrauf. Welche Schichten zusätzlich einen Bonus haben, siehst du direkt in der uniworks App."
  },
  "bonus": {
    "heading": "Dein Willkommensbonus",
    "badge_big": "+1",
    "badge_small": "Bonusstunde",
    "text": "Du bist neu bei uniworks? Dann legen wir noch etwas obendrauf: Wir geben einen Willkommensbonus von <strong>einer Bonusstunde für jede Schicht nächste Woche</strong> (9.–13. Juli) – gilt natürlich nur für Neuanmeldungen."
  },
  "faq": "standard",
  "faq_overrides": {
    "Wann erhalte ich meinen Lohn?": "Spätestens am zehnten des Folgemonats. Das Gehalt für das BTS-Wochenende bekommst du also Anfang August auf dein Konto überwiesen.",
    "Gibt es einen Dresscode zu beachten?": "Ja: Im Catering trägst du weiße Bluse oder weißes Hemd, schwarze Hose und gepflegte, geschlossene Schuhe. Als Stagehand kommst du in robuster, bequemer Kleidung mit festen Schuhen. Die Details bekommst du mit deiner Schichtbestätigung in der App."
  },
  "cta": {
    "heading": "Sichere dir deine Schicht",
    "text": "Registriere dich jetzt und buche deine Schicht für das BTS-Wochenende direkt in der uniworks App."
  }
}
```

---

### Schritt 3: Vorschau ansehen

Wenn das JSON fertig ist, schreib Claude:

> Fülle jetzt die hochgeladene Datei `vorschau-template.html` mit den Werten aus
> der Config (Anleitung steht im Kommentar am Dateianfang) und zeig sie mir als
> interaktives HTML-Artifact.

Claude rendert dir die Seite direkt im Chat — inklusive klickbarem Kalender.
Bilder erscheinen als beschriftete Platzhalter (die echten Fotos werden erst
beim Einbau eingesetzt), Nav und Footer sind vereinfacht. Layout, Texte, Stats
und Kalender entsprechen aber der echten Seite. Änderungswünsche? Einfach Claude
sagen („ändere die Headline zu …“) — es aktualisiert Vorschau **und** JSON.

### Schritt 4: Prüfen

Bevor du das JSON weiterschickst, kurz checken:

- ✅ Stimmen alle **Daten, Uhrzeiten und freien Plätze** mit dem Schichttool überein?
- ✅ Ist der **Lohn** korrekt? Gibt es die **Bonus-Aktion** wirklich so?
- ✅ Sind die **Bildrechte** geklärt (besonders bei Künstler-/Pressefotos)?

### Schritt 5: Abschicken

Schick per Slack/Mail an die Person mit Website-Zugriff:

1. die **JSON-Datei** (z. B. `oktoberfest-2026.json`)
2. die **Bilder** (Originale reichen, sie werden beim Einbau zu WebP konvertiert)

Fertig — die Seite ist dann in wenigen Minuten unter
`www.uniworks.gmbh/<slug>` live. Änderungen später (z. B. neue
Verfügbarkeiten)? Einfach das JSON anpassen und nochmal schicken.
