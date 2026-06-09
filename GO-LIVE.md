# Go-live runbook — move uniworks.gmbh from Webflow → Vercel

**Context:** The new static site is deployed to the Vercel project `uniworkswebsite`
(team `uskas-projects-df24489f`). The live domain `uniworks.gmbh` currently serves the
**old Webflow site** (Cloudflare edge), with DNS managed at **goneo**. This runbook cuts
the domain over to Vercel.

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

## 2. (Webflow side) release the domain
- [ ] Webflow → Project **Site settings → Publishing → Custom domains** → remove
      `uniworks.gmbh` and `www.uniworks.gmbh`, then **unpublish** the Webflow site
      (so Webflow stops claiming the domain / serving SSL for it).

## 3. (goneo) update DNS records
In the goneo control panel (KIS) → DNS settings for `uniworks.gmbh`:
- [ ] **Delete** the existing Webflow records: the apex `A` (and any `AAAA`) records
      pointing at Webflow IPs (e.g. `75.2.70.75`, `99.83.190.102`), and the `www`
      `CNAME` pointing at Webflow (`proxy-ssl.webflow.com`). Remove any Webflow
      verification `TXT` too.
- [ ] **Add** for the apex `uniworks.gmbh`:  `A` → **`76.76.21.21`**
- [ ] **Add** for `www`:  `CNAME` → **`cname.vercel-dns.com`**
      *(If goneo can’t set a CNAME on `www` alongside other records, use whatever the
      Vercel dashboard shows for `www`.)*
- [ ] Lower the TTL first if possible (e.g. 300s) to speed up propagation.

## 4. Wait + verify
- [ ] DNS propagation: minutes to a few hours. Vercel auto-issues the SSL cert once it
      sees the records (domain shows “Valid Configuration” in Vercel → Domains).
- [ ] Verify it’s now Vercel + cache headers are live:
      ```
      curl -sI https://www.uniworks.gmbh/pages/index.html | grep -iE 'x-vercel-id|cache-control'
      # expect: x-vercel-id: ...   and   cache-control: public, max-age=0, must-revalidate
      curl -sI https://www.uniworks.gmbh/fonts/ibm-plex-sans.css | grep -i cache-control
      # expect: cache-control: public, max-age=2592000
      ```
- [ ] Check apex redirect: `curl -sI https://uniworks.gmbh/` → 308 → `https://www.uniworks.gmbh/`.

## 5. Post-cutover follow-ups (not blockers)
- **Homepage URL:** `uniworks.gmbh/` loads root `index.html`, which redirects to
  `/pages/index.html`. Works, but the homepage lives at `/pages/…`. If you want a clean
  `/` homepage, we can add Vercel rewrites or restructure later.
- **Old Webflow URLs → 404:** the Webflow site’s paths (e.g. `/unternehmen/logistik-personal`)
  differ from the new ones (`/pages/unternehmen/logistik.html`). Add `redirects` in
  `vercel.json` for the important old URLs to preserve SEO/inbound links.
- **Confirm Typeform still receives submissions** after go-live (it will — links are unchanged).

## Quick reference
- Vercel project: `uniworkswebsite` · team `uskas-projects-df24489f`
- Vercel apex A record: `76.76.21.21` · www CNAME: `cname.vercel-dns.com`
- Primary/canonical host: `https://www.uniworks.gmbh`
