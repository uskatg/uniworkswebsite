#!/usr/bin/env python3
"""
uniworks promo-page generator.

Usage:
    python3 templates/promo/create-promo.py templates/promo/<my-event>.json

Reads a JSON config (see bts-allianz.json for a full example), renders
pages/<slug>.html from template.html, and registers the page in
vercel.json (rewrite + redirect) and sitemap.xml. Safe to re-run: an
existing page is overwritten, routing entries are only added once.

Requires only the Python 3 that ships with macOS. No installs.
"""
import calendar
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent  # repo root
TEMPLATE = HERE / "template.html"
STANDARD_FAQ = HERE / "faq-standard.json"

GERMAN_MONTHS = [None, "Januar", "Februar", "März", "April", "Mai", "Juni",
                 "Juli", "August", "September", "Oktober", "November", "Dezember"]

DEFAULT_HERO_BUTTONS = [
    {"text": "Jetzt registrieren", "href": "https://apply.uniworks.gmbh", "style": "p"},
    {"text": "Schichten in der App ansehen", "href": "/app", "style": "s"},
]
DEFAULT_CTA_BUTTONS = [
    {"text": "Jetzt registrieren", "href": "https://apply.uniworks.gmbh", "style": "p"},
    {"text": "Zur uniworks App", "href": "/app", "style": "s"},
]


def die(msg):
    print(f"FEHLER: {msg}", file=sys.stderr)
    sys.exit(1)


def esc_amp(value):
    """Escape bare & (but keep existing entities like &nbsp; and HTML tags intact)."""
    if isinstance(value, str):
        return re.sub(r"&(?![a-zA-Z]{2,8};|#\d+;)", "&amp;", value)
    if isinstance(value, list):
        return [esc_amp(v) for v in value]
    if isinstance(value, dict):
        return {k: esc_amp(v) for k, v in value.items()}
    return value


def render_buttons(buttons, indent):
    out = []
    for b in buttons:
        cls = "btn btn-p" if b.get("style", "p") == "p" else "btn btn-s"
        ext = ' target="_blank" rel="noopener"' if b["href"].startswith("http") else ""
        out.append(f'{indent}<a href="{b["href"]}" class="{cls}"{ext}>{b["text"]}</a>')
    return "\n".join(out)


def render_meta_items(items):
    return "\n".join(
        f'          <span class="bt-meta-i"><i class="ti {m["icon"]}" aria-hidden="true"></i>{m["text"]}</span>'
        for m in items
    )


def render_stats(stats):
    return "\n".join(
        f'      <div class="bt-stat"><b>{s["big"]}</b><span>{s["small"]}</span></div>'
        for s in stats
    )


def render_job_cards(jobs):
    cards = []
    for j in jobs:
        tags = "\n".join(f'            <span class="bt-tag">{t}</span>' for t in j.get("tags", []))
        tags_block = f'\n          <div class="bt-job-tags">\n{tags}\n          </div>' if tags else ""
        cards.append(
            f'''      <article class="bt-job">
        <img src="{j["image"]}" alt="{j["alt"]}" loading="lazy" />
        <div class="bt-job-body">
          <h3><i class="ti {j["icon"]}" aria-hidden="true"></i>{j["title"]}</h3>
          <p>{j["text"]}</p>{tags_block}
        </div>
      </article>'''
        )
    return "\n".join(cards)


def render_gallery(gallery):
    if not gallery:
        return ""
    figs = "\n".join(
        f'      <figure{cls}><img src="{g["src"]}" alt="{g["alt"]}" loading="lazy" /></figure>'
        for g in gallery
        for cls in ["" if g.get("mobile", True) else ' class="gal-desk"']
    )
    return f'    <div class="bt-gal">\n{figs}\n    </div>'


def render_faq(items):
    out = []
    for item in items:
        answer = item.get("a_html") or f'<p>{item["a"]}</p>'
        # indent the answer HTML consistently
        answer = "\n".join("        " + line.strip() for line in answer.strip().splitlines())
        out.append(
            f'''      <details>
        <summary>{item["q"]}<i class="ti ti-chevron-down" aria-hidden="true"></i></summary>
{answer}
      </details>'''
        )
    return "\n".join(out)


def render_bonus(bonus):
    if not bonus:
        return ""
    badge = ""
    if bonus.get("badge_big"):
        small = f'<small>{bonus["badge_small"]}</small>' if bonus.get("badge_small") else ""
        badge = f'\n        <div class="bt-ref-badge">{bonus["badge_big"]}{small}</div>'
    return f'''
  <!-- ── BONUS ── -->
  <section class="bt-sec alt">
    <div class="bt-ref">
      <div class="bt-ref-inner">
        <h2>{bonus["heading"]}</h2>{badge}
        <p>{bonus["text"]}</p>
      </div>
    </div>
  </section>
'''


def render_cal_days_js(days):
    lines = []
    for day in sorted(days, key=int):
        info = days[day]
        shifts = ", ".join(json.dumps(s, ensure_ascii=False) for s in info["shifts"])
        lines.append(
            f'      {int(day)}: {{label: {json.dumps(info["label"], ensure_ascii=False)}, '
            f'sub: {json.dumps(info["sub"], ensure_ascii=False)}, shifts: [{shifts}]}}'
        )
    return "{\n" + ",\n".join(lines) + "\n    }"


def patch_vercel(slug):
    path = ROOT / "vercel.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    changed = False
    redirect = {"source": f"/pages/{slug}.html", "destination": f"/{slug}", "permanent": True}
    rewrite = {"source": f"/{slug}", "destination": f"/pages/{slug}.html"}
    if not any(r.get("source") == redirect["source"] for r in data["redirects"]):
        data["redirects"].append(redirect)
        changed = True
    if not any(r.get("source") == rewrite["source"] for r in data["rewrites"]):
        data["rewrites"].append(rewrite)
        changed = True
    if changed:
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return changed


def patch_sitemap(slug):
    path = ROOT / "sitemap.xml"
    text = path.read_text(encoding="utf-8")
    loc = f"https://www.uniworks.gmbh/{slug}"
    if loc in text:
        return False
    entry = f"  <url>\n    <loc>{loc}</loc>\n  </url>\n</urlset>"
    path.write_text(text.replace("</urlset>", entry), encoding="utf-8")
    return True


def main():
    if len(sys.argv) != 2:
        die("Aufruf: python3 templates/promo/create-promo.py <config.json>")
    cfg_path = Path(sys.argv[1])
    if not cfg_path.exists():
        die(f"Config nicht gefunden: {cfg_path}")
    try:
        cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        die(f"Config ist kein gültiges JSON: {e}")

    for key in ("slug", "title", "description", "headline", "intro", "hero_image",
                "stats", "jobs", "calendar", "pay", "cta"):
        if key not in cfg:
            die(f'Pflichtfeld "{key}" fehlt in der Config.')
    slug = cfg["slug"]
    if not re.fullmatch(r"[a-z0-9-]+", slug):
        die("slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten.")

    cfg = esc_amp(cfg)

    cal = cfg["calendar"]
    year, month = int(cal["year"]), int(cal["month"])
    lead, ndays = calendar.monthrange(year, month)  # weekday of the 1st (Mo=0), days in month
    month_name = GERMAN_MONTHS[month]

    faq = cfg.get("faq", "standard")
    if faq == "standard":
        faq = json.loads(STANDARD_FAQ.read_text(encoding="utf-8"))
        faq = esc_amp(faq)
    for item in faq:  # replace individual standard answers by question text
        override = cfg.get("faq_overrides", {}).get(item["q"])
        if override is not None:
            item.pop("a_html", None)
            item["a"] = override
    faq += esc_amp(cfg.get("faq_extra", []))

    bonus_html = render_bonus(cfg.get("bonus"))

    # image warnings (page still renders; missing files just 404 locally)
    for src in ([cfg["hero_image"]["src"]] + [j["image"] for j in cfg["jobs"]]
                + [g["src"] for g in cfg.get("gallery", [])]):
        if not (ROOT / src.lstrip("/")).exists():
            print(f"WARNUNG: Bild fehlt im Repo: {src}")

    tokens = {
        "SLUG": slug,
        "TITLE": cfg["title"],
        "DESC": cfg["description"],
        "SOCIAL_DESC": cfg.get("social_description", cfg["description"]),
        "EYEBROW_ICON": cfg.get("eyebrow", {}).get("icon", "ti-confetti"),
        "EYEBROW_TEXT": cfg.get("eyebrow", {}).get("text", "Event-Job"),
        "HEADLINE": cfg["headline"],
        "INTRO": cfg["intro"],
        "META_ITEMS": render_meta_items(cfg.get("meta", [])),
        "HERO_BUTTONS": render_buttons(cfg.get("hero_buttons", DEFAULT_HERO_BUTTONS), "          "),
        "HERO_IMG": cfg["hero_image"]["src"],
        "HERO_ALT": cfg["hero_image"]["alt"],
        "STATS_COUNT": str(len(cfg["stats"])),
        "STATS": render_stats(cfg["stats"]),
        "JOBS_HEADING": cfg.get("jobs_heading", "Was erwartet dich?"),
        "JOBS_INTRO": cfg.get("jobs_intro", ""),
        "JOB_CARDS": render_job_cards(cfg["jobs"]),
        "GALLERY_BLOCK": render_gallery(cfg.get("gallery", [])),
        "CAL_HEADING": cal.get("heading", f"Die Einsatztage im {month_name}"),
        "CAL_INTRO": cal.get("intro", "Tippe auf einen markierten Tag oder fahre mit der Maus darüber – du siehst sofort, welche Schichten noch frei sind."),
        "CAL_MONTH_LABEL": f"{month_name} {year}",
        "CAL_HINT": cal.get("snapshot_note", "Tagesaktuelle Verfügbarkeit siehst du in der uniworks App."),
        "CAL_SNAPSHOT_COMMENT": cal.get("snapshot_note", "siehe uniworks App"),
        "CAL_DAYS_JS": render_cal_days_js(cal["days"]),
        "CAL_LEAD": str(lead),
        "CAL_NDAYS": str(ndays),
        "PAY_HEADING": cfg["pay"].get("heading", "Dein Gehalt im Überblick"),
        "PAY_AMOUNT": cfg["pay"]["amount"],
        "PAY_SUFFIX": cfg["pay"].get("suffix", "pro Stunde – mindestens"),
        "PAY_TEXT": cfg["pay"]["text"],
        "BONUS_SECTION": bonus_html,
        "FAQ_SEC_CLASS": "bt-sec" if bonus_html else "bt-sec alt",
        "FAQ_HEADING": cfg.get("faq_heading", "Häufige Fragen"),
        "FAQ_ITEMS": render_faq(faq),
        "CTA_HEADING": cfg["cta"]["heading"],
        "CTA_TEXT": cfg["cta"]["text"],
        "CTA_BUTTONS": render_buttons(cfg.get("cta_buttons", DEFAULT_CTA_BUTTONS), "        "),
    }

    html = TEMPLATE.read_text(encoding="utf-8")
    for name, value in tokens.items():
        html = html.replace("{{" + name + "}}", value)
    leftover = re.findall(r"\{\{[A-Z_]+\}\}", html)
    if leftover:
        die(f"Nicht ersetzte Platzhalter im Template: {', '.join(sorted(set(leftover)))}")

    out = ROOT / "pages" / f"{slug}.html"
    out.write_text(html, encoding="utf-8")

    v = patch_vercel(slug)
    s = patch_sitemap(slug)
    print(f"✓ Seite geschrieben: pages/{slug}.html")
    print(f"✓ vercel.json: {'Route /' + slug + ' hinzugefügt' if v else 'Route existiert bereits'}")
    print(f"✓ sitemap.xml: {'Eintrag hinzugefügt' if s else 'Eintrag existiert bereits'}")
    print()
    print(f"Vorschau:  python3 -m http.server 8000  →  http://localhost:8000/pages/{slug}.html")
    print(f"Live nach Deploy:  https://www.uniworks.gmbh/{slug}")


if __name__ == "__main__":
    main()
