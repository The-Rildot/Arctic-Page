# Playground presets

JSON snapshots you can **Import** in the app (Control panel → **Import** → choose a `.json` file).

## How to use

1. Run the dev server (`npm run dev`) or open your deployed build.
2. Open **Import** and select a file from [`playground/`](./playground/).

Try **`default-arctic-day.json`** or **`city-night.json`** first.

## How to author new presets

1. Arrange the scene in the UI (scene, day/night, characters, locks, names).
2. Click **Export** — your browser downloads a valid JSON file.
3. Move or copy it into **`presets/playground/`**, rename descriptively, and commit.

Hand-editing is possible but easy to get wrong; exporting from the app is the reliable approach.

## Schema

- **`v`** must be **`1`** (see `PLAYGROUND_EXPORT_VERSION` in [`src/utils/playgroundExport.ts`](../src/utils/playgroundExport.ts)).
- Top-level shape is **`PlaygroundExportV1`**: `isNightMode`, `selectedScene`, `customCharacters`, `characterPositions`, `showCharacterNames`, plus optional `builtInCharacterNames` and `lockedCharacterIds` (normalized on import if omitted or partial).
- **`selectedScene`** must be one of the IDs in [`src/constants/scenes.ts`](../src/constants/scenes.ts).
- Each **custom** entry must match **`CustomCharacter`** in [`src/types/characters.ts`](../src/types/characters.ts) (including full `components` with `variantId` / `color` per slot).
- **`characterPositions`** should include **`penguin`**, **`bear`**, and every **custom** character **`id`**.
