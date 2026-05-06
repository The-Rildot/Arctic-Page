# Arctic Page

A browser **scene playground** built with **React 19** and **Vite**. Pick a themed background, toggle **day and night**, drag **CSS-built characters** around the page, and design **custom characters** in the creator. Settings persist in **`localStorage`** so your layout survives refresh.

---

## Features

| Area | What you get |
|------|----------------|
| **Scenes** | Six fullscreen presets: Arctic, Desert, Ocean, City, Forest, Space — each with layered artwork (CSS and PNG assets where used). Scene CSS is **split per scene** and **lazy-loaded** with the scene component so inactive presets are not loaded up front. |
| **Characters** | Built-in **penguin** and **polar bear** presets plus up to **six custom** characters from the creator (mix-and-match parts and colors). |
| **Interaction** | **Pointer drag** to move characters; **Tab** to focus a character and **arrow keys** to nudge position (20px steps). |
| **Day / night** | Toggle affects scene styling and body backdrop; state is remembered. |
| **Toolbar** | Scene picker, show/hide name labels, editable display names for built-ins, reset custom characters, open creator, **Export** / **Import** (JSON), **Copy share link** (URL hash when the snapshot is small enough). |
| **Persistence** | Night mode, scene, custom characters, positions, name visibility, and built-in names — all stored locally (see `src/utils/storage.ts`). |
| **Accessibility** | Character creator uses a focus trap and dialog semantics; toolbar controls are labeled; ESLint includes **jsx-a11y**. Optional share/import flows announce status with a live region. |
| **Motion** | **`prefers-reduced-motion`** tones down character transitions, wandering, ocean waves/fish, and legacy penguin/bear decorative animations. |
| **Deploy** | Static `dist/` output; see [`docs/DEPLOY.md`](docs/DEPLOY.md) for **`vite` `base`** on GitHub Pages and other hosts. A light **[Web App Manifest](public/manifest.webmanifest)** is linked for theme/name hints (no service worker). |

---

## Tech stack

- **React 19**, **TypeScript**, **Vite 6**
- **Tailwind CSS** (via `index.css`) for control chrome and modal utilities; large scene styling lives in **`styles.css`** (global + character UI) and **`src/components/backgrounds/scenes/*.scene.css`** (per scene)
- **Vitest** + **happy-dom** for unit tests; **ESLint** (`typescript-eslint`, React Hooks, React Refresh, jsx-a11y)
- **GitHub Actions** CI: `npm ci` → lint → test → build (see [.github/workflows/ci.yml](.github/workflows/ci.yml))

---

## Requirements

- **Node.js** 22 or newer (see `.nvmrc` and `package.json` `engines`; aligned with CI).
- **[npm](https://docs.npmjs.com/cli/)** only — this repo uses **`package-lock.json`**. Ignore or delete stray **`pnpm-lock.yaml`** / **`yarn.lock`** (also listed in `.gitignore`).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server ([Vite](https://vitejs.dev/), default port **5173**) |
| `npm run build` | Typecheck (`tsc -b`) and production build → **`dist/`** |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint on `src/` |
| `npm run test` | Vitest (single run) |
| `npm run test:watch` | Vitest watch mode |

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [`docs/README.md`](docs/README.md) | Extending scenes and character templates |
| [`docs/DEPLOY.md`](docs/DEPLOY.md) | Hosting, **`base`** path, static-site notes |

---

## Screenshots

These images are from an **earlier** build of the app (layout and scenes may differ slightly today):

| Day | Night |
|-----|-------|
| ![Day](https://github.com/user-attachments/assets/3753547d-bbe8-48e7-b292-b7db5f3599bb) | ![Night](https://github.com/user-attachments/assets/8c20ca46-66a9-43e4-ac33-b7e2d0ba9f59) |

---

## License

[ISC](https://opensource.org/licenses/ISC) — see [`package.json`](package.json).
