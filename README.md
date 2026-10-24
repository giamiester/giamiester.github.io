# Orbit Desk web version

Orbit Desk runs in a modern browser; visitors do not need the Windows executable, Vulkan SDK, or a build step. This folder is the GitHub Pages site root.

## Preview on your computer

From the `web-deploy` folder, run:

```powershell
npx wrangler pages dev .
```

This serves the page and its JPL proxy locally. Opening `index.html` directly or using a plain static server will not enable JPL lookup.

## Publish the site

GitHub Pages only serves static files; it does not execute `_worker.js`. JPL also blocks direct browser embedding, so searches need a separately deployed proxy:

1. From this folder, run `cd jpl-proxy`, then `npx wrangler login` and `npx wrangler deploy`.
2. Copy the `workers.dev` URL printed by Wrangler and append `/api/sbdb`.
3. In this folder's `index.html`, set the `jpl-proxy-url` meta tag to that full URL.
4. Commit and push this folder's contents to `giamiester/giamiester.github.io`.

If the entire site is hosted on Cloudflare Pages instead, leave the meta tag empty; `_worker.js` serves `/api/sbdb`. Keep `textures` beside `index.html`; it contains the bundled maps and their attribution.

Three.js and JPL searches need an internet connection. Planet positions use approximate Keplerian elements; added objects use JPL osculating elements.

## Controls

- Drag with the left mouse button to rotate; right-drag to pan; use the wheel to zoom.
- Click a body to select it. Click empty space to return to the Sun.
- Use the left and right arrow keys to change selection; press Home or R to reset the camera.
- Add comets, asteroids, and other small bodies with the JPL search field.

Planet texture attribution is in `textures/ATTRIBUTION.md`.
