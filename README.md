# Orbit Desk web version

Orbit Desk can run as a static website. Visitors open the site in a modern browser; they do not need the Windows executable, Vulkan SDK, or a build step.

## Preview on your computer

From this folder, run:

```powershell
py -m http.server 8000
```

Then open <http://localhost:8000>. Keep the server window open while using the page. Opening `index.html` directly as a `file://` URL will not work because browsers restrict JavaScript modules on local files.

## Publish the site

Upload the contents of the `web-deploy` folder to any static web host, such as GitHub Pages, Cloudflare Pages, or Netlify. Keep the `textures` folder beside `index.html`; it contains the bundled planetary maps and their attribution.

The page loads Three.js from jsDelivr and uses NASA/JPL's Small-Body Database API when a visitor searches for an unlisted object. Those features need an internet connection. The solar-system view and the included objects otherwise run in the browser. Planet positions use approximate Keplerian elements; small-body search results use JPL osculating elements.

## Controls

- Drag with the left mouse button to rotate; right-drag to pan; use the wheel to zoom.
- Click a body to select it. Click empty space to return to the Sun.
- Use the left and right arrow keys to change selection; press Home or R to reset the camera.
- Add comets, asteroids, and other small bodies with the JPL search field.

Planet texture attribution is in `textures/ATTRIBUTION.md`.
