# Orbit Desk web version

Orbit Desk runs in a modern browser; visitors do not need the Windows executable, Vulkan SDK, or a build step. Use the `web-deploy` folder as the deployment root. GitHub Pages needs the separate Cloudflare Worker proxy in `web-deploy/jpl-proxy`; Cloudflare Pages can use the included `_worker.js` directly.

## Preview on your computer

From the `web-deploy` folder, run:

```powershell
npx wrangler pages dev .
```

This serves the page and its JPL proxy locally. Opening `index.html` directly or using a plain static server will not enable JPL lookup.

## Publish the site

For GitHub Pages, deploy `web-deploy/jpl-proxy` with Wrangler, set the resulting `/api/sbdb` URL in the `jpl-proxy-url` meta tag in `web-deploy/index.html`, then publish `web-deploy`. For Cloudflare Pages, leave the tag empty and deploy the folder directly. JPL's API policy disallows direct browser embedding, so other hosts also need a server-side proxy. Keep `textures` beside `index.html`; it contains the bundled maps and their attribution.

Three.js and JPL searches need an internet connection. Planet positions use approximate Keplerian elements; added objects use JPL osculating elements.

## Controls

- Drag with the left mouse button to rotate; right-drag to pan; use the wheel to zoom.
- Click a body to select it. Click empty space to return to the Sun.
- Use the left and right arrow keys to change selection; press Home or R to reset the camera.
- Add comets, asteroids, and other small bodies with the JPL search field.

Planet texture attribution is in `textures/ATTRIBUTION.md`.
