# The Beaver Gazette 🦫

A niche beaver-enthusiast site that doubles as a consent-management test bed.

Seven pages, one per legal template. Every template page loads the **same six
consent-requiring services**, so the same page can be re-tested against each template:

| Service | Consent category | What it actually loads |
| --- | --- | --- |
| YouTube video | Marketing | iframe from `youtube-nocookie.com` |
| Google Maps | Functional | iframe from `maps.google.com` |
| Geolocation | Functional | browser `navigator.geolocation` API |
| Google Analytics 4 | Statistics | `googletagmanager.com/gtag/js` |
| Social embed (X) | Marketing | `platform.twitter.com/widgets.js` |
| Live chat (Intercom) | Functional | `widget.intercom.io` |

## Pages

| File | Template | Region |
| --- | --- | --- |
| `index.html` | — (control page, no CMP script) | — |
| `gdpr.html` | GDPR | European Union |
| `tcf.html` | TCF | EU · ad-tech vendors |
| `uk-gdpr.html` | UK GDPR | United Kingdom |
| `uk-tcf.html` | UK TCF | UK · ad-tech vendors |
| `pipeda.html` | PIPEDA | Canada |
| `cipa.html` | CIPA | US · schools & libraries |
| `mspl.html` | MSPL | US · state privacy laws |

## Where to paste each CMP script

Each template page has one clearly marked comment block in `<head>`:

```html
<!-- =====================================================================
     PASTE THE USERCENTRICS CMP SCRIPT FOR THE "GDPR" TEMPLATE HERE
     ...
     ===================================================================== -->
```

Replace that comment with the loader snippet from the Usercentrics admin UI for the
app/configuration set to that legal template. Keep it before the other scripts on the page.

## How the pre-consent blocking works

Every third-party service is already blocked using the standard CMP pattern:

```html
<script type="text/plain" data-usercentrics="Google Maps">
  /* embed code */
</script>
```

Browsers do not execute `type="text/plain"`, so nothing loads until the CMP flips the tag to
`text/javascript` after consent for that service.

**Adjust before real testing:** the `data-usercentrics="..."` values here are the human-readable
service names (`YouTube Video`, `Google Maps`, `Google Analytics 4`, `X (Twitter)`, `Intercom`,
`Browser Geolocation`). They must match the Data Processing Services actually configured in your
app, otherwise nothing will ever be unblocked.

Geolocation is a browser API, not a third-party script, so it can't use the `text/plain` trick.
`script.js` → `requestLocation()` has a commented-out `UC_UI.getServicesBaseInfo()` consent check
to uncomment once a CMP is loaded.

## Placeholders to replace

- `G-XXXXXXXXXX` — your GA4 measurement ID (in every template page's analytics block)
- `YOUR_APP_ID` — your Intercom app ID (in every template page's live chat block)
- The X/Twitter embed points at `@BeaverTrust`; swap in a real post URL if you want a rendered card

## The "Load anyway (demo only)" buttons

Each service card has a demo button that injects the embed directly, bypassing any CMP. It exists
so the page is explorable before a CMP is wired in — it is **not** part of the consent flow. See
`script.js`. Delete `script.js` and the `<template class="demo-embed">` elements if you want pages
that only ever load through the CMP.

## Publishing to GitHub Pages

```bash
cd beaver-den
git init
git add .
git commit -m "Beaver Gazette consent test site"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Build and deployment → Deploy from a branch → `main` /
`(root)`**. The site appears at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

Serving over HTTPS matters here — geolocation is blocked on plain `http://` (other than
`localhost`), and some CMP setups are domain-scoped.

## Local preview

Opening `index.html` directly works for layout, but geolocation and some embeds want a real origin:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Notes

The beaver facts are real. The analytics ID, chat app ID and social post are placeholders.
