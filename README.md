# The Beaver Gazette 🦫

A niche beaver-enthusiast site that doubles as a consent-management test bed.

There are seven sites, one per legal template. Each has **its own hostname**, so each CMP setting
has its own domain and its scan covers exactly one template. Every site loads the **same six
consent-requiring services**, embedded the ordinary way. Blocking them before consent is the
CMP's job, not the markup's.

| Service | Consent category | What it loads |
| --- | --- | --- |
| YouTube video | Marketing | iframe from `youtube.com/embed` |
| Google Maps | Functional | iframe from `maps.google.com` |
| Geolocation | Functional | browser `navigator.geolocation` API |
| Google Analytics 4 | Statistics | `googletagmanager.com/gtag/js` |
| Social embed (X) | Marketing | timeline widget via `platform.twitter.com/widgets.js` |
| Live chat (Intercom) | Functional | `widget.intercom.io` |

## Sites

| Template | Folder | Hostname (use as the CMP Domain) |
| --- | --- | --- |
| GDPR | `sites/gdpr/` | `beaver-den-gdpr.pages.dev` |
| TCF | `sites/tcf/` | `beaver-den-tcf.pages.dev` |
| UK GDPR | `sites/uk-gdpr/` | `beaver-den-uk-gdpr.pages.dev` |
| UK TCF | `sites/uk-tcf/` | `beaver-den-uk-tcf.pages.dev` |
| PIPEDA | `sites/pipeda/` | `beaver-den-pipeda.pages.dev` |
| CIPA | `sites/cipa/` | `beaver-den-cipa.pages.dev` |
| MSPL | `sites/mspl/` | `beaver-den-mspl.pages.dev` |

Each folder is self-contained, with its own `index.html`, `style.css` and `script.js`. That keeps a
scan of one site limited to that site plus its six services.

The CMP loader script for each template sits in the `<head>` of its `index.html`. TCF and UK TCF
also load the TCF stub just before the loader.

The repo root `index.html` is the **hub**, served by GitHub Pages at
`https://sofs9191.github.io/beaver-den/`. It has no CMP, so it doubles as a control page: the same
six services load there with nothing blocking them.

## Hosting setup (Cloudflare Pages, one-time)

Create one Pages project per template, all connected to this repo:

1. **Workers & Pages → Create → Pages → Connect to Git**, then pick this repository.
2. Use these settings for each project:
   - Project name: `beaver-den-<slug>`, e.g. `beaver-den-gdpr`
   - Production branch: `main`
   - Framework preset: **None**, with the build command left **empty**
   - Build output directory: `sites/<slug>`

Every push to `main` then redeploys all seven.

If Cloudflare appends a suffix because a project name is taken, update the nav and hub links to
the real hostname.

## Placeholders to replace

- `G-XXXXXXXXXX`: your GA4 measurement ID (analytics block on every site)
- `YOUR_APP_ID`: your Intercom app ID (live chat block on every site)

## Geolocation

Geolocation is a browser API rather than a third-party script, so a CMP can't block it
automatically. `script.js` → `requestLocation()` includes a commented-out consent check to enable
once the CMP is live.

## Local preview

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` for the hub, or `http://localhost:8000/sites/gdpr/` and so on
for each site. The CMP won't validate on `localhost`, since each setting is tied to its
`pages.dev` domain.

## Notes

The beaver facts are real. The analytics and chat IDs are placeholders.
