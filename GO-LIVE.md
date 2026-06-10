# Go-live runbook — move uniworks.gmbh from Webflow → Vercel

**Context:** The new static site is deployed to the Vercel project `uniworkswebsite`
(team `uniworks-gmb-h` — the dedicated uniworks Vercel account). The live domain
`uniworks.gmbh` currently serves the **old Webflow site**, with DNS managed at **goneo**.
This runbook cuts the domain over to Vercel.

> Do these roughly in order. Nothing here is destructive to the new site; the only
> user-visible change is step 4 (DNS), which makes the new site go live.

## 0. Pre-flight (before touching DNS)
- [ ] Review the new site one more time (logged into Vercel, or after step 1).
- [ ] **Turn OFF Deployment Protection** so the public can load it:
      Vercel → Project `uniworkswebsite` → **Settings → Deployment Protection** →
      set **Vercel Authentication** to *Disabled* (or “Only Preview Deployments”).
      *(Right now production returns HTTP 401 to anonymous visitors — this is why.)*

## 1. Add the domain in Vercel
- [ ] Vercel → Project → **Settings → Domains → Add**.
- [ ] Add **`www.uniworks.gmbh`** and set it as the **primary** domain.
      *(Our canonical/OG/sitemap URLs all use `https://www.uniworks.gmbh`, so www is primary.)*
- [ ] Add **`uniworks.gmbh`** (apex) and choose **Redirect → www.uniworks.gmbh** (308).
- [ ] Vercel will now show the exact DNS records it wants — **use those values** (the
      ones below are Vercel’s current standard, but the dashboard is authoritative).

## 2. (goneo) update DNS records — **do this BEFORE touching Webflow**
In the goneo control panel (KIS) → DNS settings for `uniworks.gmbh`:
- [ ] **Delete** the existing Webflow records: the apex `A` (and any `AAAA`) records
      pointing at Webflow IPs (e.g. `75.2.70.75`, `99.83.190.102`), and the `www`
      `CNAME` pointing at Webflow (`proxy-ssl.webflow.com`). Remove any Webflow
      verification `TXT` too.
- [ ] **Add** for the apex `uniworks.gmbh`:  `A` → **`76.76.21.21`**
- [ ] **Add** for `www`:  `A` → **`76.76.21.21`**
      *(Vercel currently recommends an A record for `www` too — verified via
      `vercel domains inspect` on 2026-06-10. A `CNAME cname.vercel-dns.com` also works
      if goneo prefers that; the Vercel dashboard is authoritative.)*
- [ ] Lower the TTL first if possible (e.g. 300s) to speed up propagation.

## 3. Wait + verify
- [ ] DNS propagation: minutes to a few hours. Vercel auto-issues the SSL cert once it
      sees the records (domain shows “Valid Configuration” in Vercel → Domains).
- [ ] Verify it’s now Vercel + cache headers are live:
      ```
      curl -sI https://www.uniworks.gmbh/ | grep -iE 'x-vercel-id|cache-control'
      # expect: x-vercel-id: ...   and   cache-control: public, max-age=0, must-revalidate
      curl -sI https://www.uniworks.gmbh/fonts/ibm-plex-sans.css | grep -i cache-control
      # expect: cache-control: public, max-age=2592000
      ```
- [ ] Check apex redirect: `curl -sI https://uniworks.gmbh/` → 308 → `https://www.uniworks.gmbh/`.
      **⚠ Blocked as of 2026-06-10:** goneo serves zone-level CAA records
      (`0 issue "amazon.com"`, `0 issue "pki.goog"`) that are invisible in the KIS DNS
      editor (no CAA type there) and block Let's Encrypt from issuing the apex cert.
      **Do NOT remove them** — they are required by AWS ACM (apps/admin subdomains,
      SES DKIM) and Google. Support ticket sent to goneo asking to ADD
      `0 issue "letsencrypt.org"` alongside. Once goneo adds it, Vercel auto-issues
      the cert (no action needed). Until then `https://uniworks.gmbh` shows a cert
      warning; `www` and `http://` apex are unaffected.
- [ ] Spot-check the live URL structure: `/unternehmen/events`, `/nutzungsbedingungen`,
      `/post/die-uniworks-app`, `/en` — all should return 200 (clean URLs, no `.html`).

## 4. (Webflow side) release the domain — **only after step 3 passes**
- [ ] Webflow → Project **Site settings → Publishing → Custom domains** → remove
      `uniworks.gmbh` and `www.uniworks.gmbh`, then **unpublish** the Webflow site.
      Doing this earlier would take the old site down while DNS still points at Webflow.

## 5. Post-cutover follow-ups (not blockers)
- ~~Homepage URL via `/pages/…`~~ **Done:** clean URLs shipped — `/` serves the homepage
  directly, all live Webflow paths are matched 1:1 via `vercel.json` rewrites.
- ~~Old Webflow URLs → 404~~ **Done:** every live URL (incl. `/post/<slug>`, `/vorteile`,
  `/kategorien/*`) is served or redirected; `/nutzungsbedingungen` rebuilt as a real page.
- **Confirm Typeform still receives submissions** after go-live (it will — links are unchanged).

## Quick reference
- Vercel project: `uniworkswebsite` · team `uniworks-gmb-h` (dedicated uniworks account)
- DNS at goneo: apex `A` → `76.76.21.21` · `www` `A` → `76.76.21.21`
  (Vercel’s dashboard is authoritative — it currently recommends A records for both)
- Primary/canonical host: `https://www.uniworks.gmbh`
