# Orbit Desk — web version

Orbit Desk is a WebGL solar-system tracker that runs in any modern browser. Visitors need no build step, executable, or GPU SDK — only an internet connection, for Three.js and the JPL lookups.

This folder is the site root. It can be served by any static host.

## How the JPL lookup works

The browser cannot query the JPL Small-Body Database directly, because JPL sends no CORS headers. A server-side proxy is required. This project ships two interchangeable ones:

- `jpl-proxy/` — a standalone Cloudflare Worker, for static hosts such as GitHub Pages.
- `_worker.js` — a Cloudflare Pages Function, used only when the whole site runs on Cloudflare Pages.

Tell the page where its proxy lives with the `jpl-proxy-url` meta tag in `index.html`:

```html
<meta name="jpl-proxy-url" content="https://<your-worker>.<your-subdomain>.workers.dev/api/sbdb" />
```

Leave that tag empty when hosting on Cloudflare Pages. The page then falls back to `/api/sbdb` on its own origin, which `_worker.js` answers.

## Preview locally

From this folder:

```powershell
npx wrangler pages dev .
```

This serves the page and its `/api/sbdb` route together. Opening `index.html` from disk, or serving it with a plain static server, leaves JPL lookup unavailable because no proxy is running.

## Deploy the proxy

Needed for GitHub Pages and any other static host. Not needed on Cloudflare Pages.

```powershell
cd jpl-proxy
npx wrangler deploy
```

Wrangler prints the deployed URL. Append `/api/sbdb`, and use the result as the `jpl-proxy-url` value in `index.html`. Re-run the same command whenever `worker.js` changes.

The Worker exposes one route, `GET /api/sbdb?query=<name>`, which forwards to the JPL Small-Body Database and returns JSON with permissive CORS headers.

## Deploy the site

**GitHub Pages** — commit the site root to the branch Pages serves (typically `main`, path `/`), then select that branch under Settings → Pages. The included `.nojekyll` file makes Pages serve the files directly instead of running Jekyll, which is faster and avoids build failures on files Jekyll cannot parse.

**Cloudflare Pages** — connect the repository, leave the meta tag empty, and `_worker.js` answers `/api/sbdb` on the same origin so no separate Worker is needed.

Either way, keep the `textures/` folder beside `index.html`; it holds the bundled maps and their attribution.

## Data and accuracy

Planet positions use approximate Keplerian elements. Objects added through the search field use the osculating elements JPL returns for their epoch. Holding one set of elements fixed over a long time span drifts from the true ephemeris, so treat positions as illustrative rather than navigational.

## Controls

- Drag with the left mouse button to rotate; right-drag to pan; scroll to zoom.
- Click a body to select it. Click empty space to return to the Sun.
- Left and right arrow keys change the selection; Home or R resets the camera.
- Type two or more characters in the JPL search field to see matching small bodies, then click one or press Enter.

Planet texture attribution is in `textures/ATTRIBUTION.md`.
