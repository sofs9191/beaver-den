# The Beaver Gazette 🦫

A niche beaver-enthusiast site that doubles as a consent-management test bed.

There are eight sites, one per legal template. Each has **its own hostname**, so each CMP setting
has its own domain and its scan covers exactly one template. Every site loads the **same six
consent-requiring services**, embedded the ordinary way. Blocking them before consent is the
CMP's job, not the markup's.

| Service | Consent category | What it loads |
| --- | --- | --- |
| YouTube video | Marketing | iframe from `youtube.com/embed` |
| Google Maps | Functional | iframe from `maps.google.com` |
| Geolocation | Functional | browser `navigator.geolocation` API |
| Google Analytics 4 | Statistics | `googletagmanager.com/gtag/js` |
| Social embed (X) | Marketing | single post embed via `platform.twitter.com/widgets.js` |
| Live chat (Crisp) | Functional | `client.crisp.chat` |

## Sites

| Template | Folder | Hostname (use as the CMP Domain) |
| --- | --- | --- |
| GDPR | `sites/gdpr/` | `beaver-den.pages.dev` |
| TCF | `sites/tcf/` | `beaver-den-tcf.pages.dev` |
| UK GDPR | `sites/uk-gdpr/` | `beaver-den-uk-gdpr.pages.dev` |
| UK TCF | `sites/uk-tcf/` | `beaver-den-uk-tcf.pages.dev` |
| PIPEDA | `sites/pipeda/` | `beaver-den-pipeda.pages.dev` |
| CIPA | `sites/cipa/` | `beaver-den-cipa.pages.dev` |
| MSPL | `sites/mspl/` | `beaver-den-mspl.pages.dev` |
| LFPDPPP (Mexico) | `sites/mexico/` | `beaver-den-mexico.pages.dev` |
| Consent or Pay (TCF) | `sites/consent-or-pay/` | `beaver-den-consent-or-pay.pages.dev` |
| Age Verification | `sites/age-verification/` | `beaver-den-age-verification.pages.dev` |
| DSR | `sites/dsr/` | `beaver-den-dsr.pages.dev` |

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
   - Project name: `beaver-den-<slug>`, e.g. `beaver-den-tcf`. The one exception is GDPR, whose
     project is named plain `beaver-den` (Cloudflare project names can't be changed).
   - Production branch: `main`
   - Framework preset: **None**, with the build command left **empty**
   - Build output directory: `sites/<slug>`

Every push to `main` then redeploys all of them.

If Cloudflare appends a suffix because a project name is taken, update the nav and hub links to
the real hostname.

## Feature-test sites

These three test CMP features rather than a legal template. Each has the usual six services.

- **Consent or Pay (TCF):** an article with two Google Ad Manager slots, using Google's public sample
  ad unit `/6355419/Travel/Europe`. It also has `login.html` (simulated sign-in) and
  `subscribe.html` (plan picker). Neither page sends, stores or charges anything; the real
  subscription flow is the publisher's. The CMP snippet is the TCF stub plus the loader, and it goes
  on all three pages.
- **Age Verification:** the age gate is configured in the CMP admin (Appearance → Layout → Age
  Verification Gate), so the page only needs the loader. Use `/under-age` as the gate's redirect
  target. That page loads no CMP, no third parties and no links.
- **DSR:** a privacy-rights page with a marked spot for the DSR form snippet.

## Financial services (Mexico only)

The Mexico site also loads three financial services. They're meant for testing a custom scanner
category such as "Financial".

| Service | What it loads | Data it collects |
| --- | --- | --- |
| Stripe | `js.stripe.com/v3` | fraud-detection frame on page load |
| Mercado Pago | `www.mercadopago.com/v2/security.js` | device fingerprint, stored in `MP_DEVICE_SESSION_ID` |
| TradingView (USD/MXN) | `s3.tradingview.com` widget, iframe from `tradingview-widget.com` | visible rate chart; widget tracking |

In testing without a publishable key, Stripe set no `__stripe_mid` / `__stripe_sid` cookies, but
the script and its fraud frame still loaded.

## Service IDs

- Google Analytics 4: `G-Z5837W9ZMF`, one data stream shared by all sites. GA4 separates the
  traffic by hostname.
- Crisp: website ID `9d8bf734-9f1c-4b3b-a639-5d4ff8152118`, on the free plan

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

The beaver facts are real.
