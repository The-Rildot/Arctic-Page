# Arctic Page extension guides

Docs for extending the playable scene backgrounds and the **character part system** (what the Character Creator exposes as selectable “templates”).

| Guide | Topic |
|--------|--------|
| [adding-character-templates.md](./adding-character-templates.md) | New head, body, arms, shirt, eyes, etc. variants and wired-up React parts |
| [adding-scenes.md](./adding-scenes.md) | New `Scene` presets, React layer components, CSS, persistence |

Audience: contributors and automation (follow paths and steps literally).

Verification after changes:

```bash
npm run lint
npm run test
npm run build
```

Repository root layout (relevant folders):

```
src/constants/characterCreator.ts   # Creator dropdown variant IDs
src/constants/scenes.ts               # Scene IDs and labels
src/components/character/partRegistry.tsx
src/components/character/parts/**     # Per-variant React/CSS
src/components/backgrounds/scenes/*.tsx
styles.css                             # Scene + legacy character styling
```
