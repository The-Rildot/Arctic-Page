# Deploying Arctic Page

The app is a static **Vite + React** build (`npm run build` → `dist/`). Host `dist` on any static file server.

## Node

Use **Node 22+** (see `.nvmrc` and `package.json` `engines`). CI runs the same version.

## Vite `base` path

- **Site at domain root** (e.g. `https://example.com/`): keep the default `base: "/"` in `vite.config.ts`.
- **GitHub Pages project site** (e.g. `https://user.github.io/Arctic-Page/`): set `base` to the repository path with slashes:

  ```ts
  // vite.config.ts
  export default defineConfig({
    base: "/Arctic-Page/",
    // ...
  });
  ```

  Replace `Arctic-Page` with your repo name. Rebuild after changing `base`.

## GitHub Pages (example)

1. Set `base` as above if the site is not at the account root.
2. In the repo **Settings → Pages**, choose **GitHub Actions** or deploy `dist` from a workflow that runs `npm ci`, `npm run build`, and uploads `dist`.
3. Ensure the workflow uses Node 22 (match `.nvmrc`).

## Netlify / Cloudflare Pages

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Environment:** Node 22

If the site is served from a subpath, set `base` in Vite and any host “base directory” option to match.

## Web app manifest

`public/manifest.webmanifest` is linked from `index.html` for install / theme hints in supporting browsers. It does not register a service worker; add one later if you want offline caching.

## Optional preview asset

For README or host-specific docs you can reuse stills under [`docs/media/`](../docs/media/) (see [`docs/media/README.md`](./media/README.md) for filenames such as `readme-arctic-day.png` and `readme-space-group.png`).
