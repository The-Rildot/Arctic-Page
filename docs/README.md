# Arctic Page extension guides

Docs for extending the playable scene backgrounds and the **character part system** (what the Character Creator exposes as selectable “templates”).

| Guide | Topic |
|--------|--------|
| [adding-character-templates.md](./adding-character-templates.md) | New head, body, arms, shirt, eyes, etc. variants and wired-up React parts |
| [adding-scenes.md](./adding-scenes.md) | New `Scene` presets, React layer components, CSS, persistence, mobile checklist |
| [DEPLOY.md](./DEPLOY.md) | Static hosting, Vite `base`, GitHub Pages / Netlify notes |
| [../presets/README.md](../presets/README.md) | **Playground import JSON** — curated snapshots for **Import** in the app |

Audience: contributors and automation (follow paths and steps literally).

Verification after changes:

```bash
npm run lint
npm test
npm run build
```

If you add or edit files under **`presets/playground/*.json`**, keep them valid for **`parsePlaygroundImport`** (see `src/utils/playgroundExport.ts`); CI runs **`playgroundPresets.test.ts`** which loads every preset.

Repository root layout (relevant folders):

```
presets/playground/              # Importable playground JSON (v: 1)
src/constants/characterCreator.ts   # Creator dropdown variant IDs
src/constants/scenes.ts               # Scene IDs and labels
src/components/character/partRegistry.tsx
src/components/character/parts/**     # Per-variant React/CSS
src/components/backgrounds/scenes/*.tsx
styles.css                             # Scene + legacy character styling
docs/media/                            # README / doc screenshots and GIFs
```
