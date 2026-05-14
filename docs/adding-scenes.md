# Adding scenes (background presets)

Each **Scene** is a fullscreen decorative stack behind draggable characters.

---

## Pieces that must stay in sync

| Piece | Role |
|-------|------|
| **`src/constants/scenes.ts`** | Authoritative **`SceneId`** union, ordered **`SCENE_IDS`**, **`SCENE_PRESETS`** (dropdown `{ id, label }`), **`isSceneId`** guard |
| **`src/components/backgrounds/SceneBackground.tsx`** | Root wrapper `scene-${sceneId}` + switch to scene component |
| **`src/components/backgrounds/scenes/<Name>Scene.tsx`** | JSX layers (.sky, dunes, planets, …) |
| **`styles.css`** | `body[data-scene="your-id"]` day/night backdrops; **`.scene-background`** shell |
| **`src/components/backgrounds/scenes/<name>.scene.css`** | Scene-specific rules (import from matching **`<Name>Scene.tsx`** so CSS lazy-loads with the scene chunk) |
| **`index.html`** (optional) | `data-scene` on `<body>` avoids a one-frame blank before React sets `dataset.scene` |

Persistence: **`storage.getSelectedScene` / `setSelectedScene`** in **`src/utils/storage.ts`** accepts any **`SceneId`** from **`SCENE_IDS`** automatically — no registry change unless you migrate legacy keys.

---

## Mobile viewport and breakpoints

**Convention:** **`max-width: 480px`** is the primary phone breakpoint for new CSS (scene layers, future bottom UI). Example:

```css
@media (max-width: 480px) {
  .scene-background.scene-yourscene .your-layer {
    /* … */
  }
}
```

**Phase 1 layout (playground shell):** **`styles.css`** sets **`html`**, **`body`**, and **`#root`** to fill the viewport using **`100dvh`** with a **`100vh`** fallback so mobile browser chrome does not clip the canvas vertically. **`Index.html`** uses **`viewport-fit=cover`** on the viewport meta so **`env(safe-area-inset-*)`** is available for **UI chrome** (notches / home indicator). Character positioning may still use flush viewport math per product requirements.

**Phase 2 (playground characters):** **`getPlaygroundCharacterSize()`** in **`src/constants/motion.ts`** returns **300×300** above **`480px`** width and a smaller square at **`≤480px`** so about three figures fit with overlap; **`usePlaygroundCharacterSize`** keeps **`App`** / **`CharacterView`** / drag clamping aligned on resize.

**Phase 3 (mobile controls, ≤480px):** **`ControlPanel`** uses a **bottom bar** when collapsed (tap to open) and a **50dvh bottom sheet** with a dim **scrim** (tap to close) when expanded; styles live under **`@media (max-width: 480px)`** in **`styles.css`**. Tablet **481px–1024px** still uses the compact corner panel.

**Phase 6 (scene wave 1 — Arctic + Forest):** **`arctic.scene.css`** and **`forest.scene.css`** each end with an **`@media (max-width: 480px)`** block: foreground stacks use **`calc(vh + max(~52px, env(safe-area-inset-bottom)))`**-style **`bottom`** values so hills / trees / ice sit above the fixed Controls bar; oversized **`vh`** tree bands and **`vw`** ellipses are toned down; Forest mid/front trees use **`transform: scale(...)`** with **`transform-origin: bottom center`** (and **`translateX(-50%) scale(...)`** where the desktop rule already translates).

**Phase 7 (scene wave 2 — Ocean, City, Desert, Space):** **`ocean.scene.css`**, **`city.scene.css`**, **`desert.scene.css`**, and **`space.scene.css`** add the same breakpoint: shallower / **`dvh`**-capped water and reef art (Ocean); raised façades, shorter skyline rows, street props, and thicker **`city-ground`** (City); lifted dunes, scaled saguaros, raised pyramid and barrel props (Desert); tighter nebula inset, smaller planets / station, shorter horizon glow (Space).

**Phase 8 (QA and tests):** Run **`npm run lint`**, **`npm test`**, and **`npm run build`** before release. Vitest covers **`src/constants/motion.ts`** (viewport sizing, wander deltas, action-row clamp, keyboard nudge) and **`readPhoneLayout`** in **`src/hooks/usePhoneLayout.test.ts`**. For **manual** checks, use DevTools or real devices at **320**, **390**, and **480** portrait widths: character **drag** and **wander**, **scene** changes, **import / export** and **share link**, character **creator** open → edit → save → close. On iOS Safari and Chrome Android when available, confirm the playground does not scroll while dragging figures — **`.draggable-character`** sets **`touch-action: none`** in **`styles.css`**, and **`useCharacterMotion`** uses **pointer capture** so the active pointer stays on the character until release.

### Mobile scene layer checklist (when editing `*.scene.css`)

- Wrap rules in **`@media (max-width: 480px)`** and scope with **`.scene-background.scene-<id>`** so desktop stays unchanged.
- Lift ground-adjacent layers with **`bottom: calc(<existing vh> + max(52px, env(safe-area-inset-bottom, 0px)))`** (tune **52px** if the chrome height changes).
- Cap tall **`min(..., XXvh)`** bands with **`dvh`** (e.g. **`min(220px, 32dvh)`**) so short viewports keep a playable band for characters.
- If art is **`vw`-heavy** or many fixed-size triangles, reduce heights, **`vw` span**, or apply a contained **`scale()`** on a wrapper rather than hand-editing dozens of borders.

See the mobile rollout plan in Cursor for the full phased checklist. For **screenshots**, **GIFs**, and **importable playground JSON**, see the root [README](../README.md), [`docs/media/README.md`](./media/README.md), and [`../presets/README.md`](../presets/README.md).

---

## Naming rules

Pick a **scene id**:

- lowercase, **hyphen-safe** ASCII: e.g. `savanna`, `underwater-city`
- Same string everywhere: **`scenes.ts`**, **`scene-${id}`**, **`body[data-scene="…"]`**, **`SceneBackground` conditional**

Duplicate ids break TypeScript uniqueness.

---

## Step-by-step — add `"savanna"`

### 1. Register the scene

**File:** `src/constants/scenes.ts`

Append to **`SCENE_IDS`**:

```ts
export const SCENE_IDS = ["arctic", ..., "space", "savanna"] as const;
```

Append **`SCENE_PRESETS`** entry:

```ts
{ id: "savanna", label: "Savanna" }
```

`SceneId`, **`isSceneId`**, and the **Scene** dropdown in **`App.tsx`** update automatically via these exports.

Run **`npm run build`** once — TS will complain until steps 2–3 exist.

---

### 2. Body backdrop (viewport fill)

**File:** `styles.css` near other `body[data-scene=...]` rules.

Add **day**:

```css
body[data-scene="savanna"]:not(.dark-mode) {
  background: linear-gradient(180deg, #38bdf8 0%, #fbbf24 50%, #d97706 100%);
}
```

Add **night** (uses existing **`document.body`** class **`dark-mode`** toggled by the app):

```css
body[data-scene="savanna"].dark-mode {
  background: linear-gradient(175deg, #0c1912 0%, #422006 50%, #1c1917 100%);
}
```

---

### 3. Scene layer component

Create **`src/components/backgrounds/scenes/SavannaScene.tsx`**:

Pattern from peers (`ArcticScene.tsx`, **`SpaceScene.tsx`**):

```tsx
import { sceneNight } from "./sceneNight";

type SavannaSceneProps = { isNightMode: boolean };

export function SavannaScene({ isNightMode }: SavannaSceneProps) {
  return (
    <>
      <div className={sceneNight("savanna-sun", isNightMode)} />
      <div className={sceneNight("savanna-hill savanna-hill--far", isNightMode)} />
      <div className="savanna-tree savanna-tree--1" />
      <div className={sceneNight("savanna-ground", isNightMode)} />
    </>
  );
}
```

**`sceneNight`** appends **`scene-night`** when `isNightMode` — style night layers with selectors like:

```css
.scene-background.scene-savanna .savanna-sun.scene-night { ... }
```

Use **`scene-night`** instead of **`dark-mode`** on **scene elements** so you do not collide with **`body.dark-mode`** global behavior.

---

### 4. Wire `SceneBackground`

**File:** `src/components/backgrounds/SceneBackground.tsx`

- Import **`SavannaScene`**
- Add branch:

```tsx
{sceneId === "savanna" ? <SavannaScene isNightMode={isNightMode} /> : null}
```

Root div already renders **`scene-${sceneId}`** (`scene-savanna`).

---

### 5. Scoped CSS layers

Prefix **all** selectors for this scene with:

```css
.scene-background.scene-savanna .savanna-sun { ... }
```

Why:

1. Layers never collide with **`scene-arctic`**, **`scene-city`**, etc.
2. Z-index stacking stays predictable (**`characters`** stack above **`scene-background`**, **`z-index: 0`**)

Layout tips:

- Usually **`position: absolute`**, **`inset` / bottom / vw / vh`** for responsiveness.
- Put static images in **`public/assets/`**, reference **`/assets/your-file.png`** in **`<img src>`**.

---

### 6. Motion / accessibility hooks (recommended)

If you add **`animation`** (waves, drifting clouds):

Extend **`prefers-reduced-motion`** in **`styles.css`** (existing block near character transitions) so animated layers **respect `prefers-reduced-motion: reduce`**.

---

### 7. Verify

```bash
npm run lint
npm run test
npm run build
```

In the UI: Scene → new label, toggle Day/Night, resize window — backgrounds should honor **`body`** gradients and layer stacking.

---

## AI / checklist summary

Copy-paste checklist:

1. [ ] **`scenes.ts`**: **`SCENE_IDS`** + **`SCENE_PRESETS`**
2. [ ] **`styles.css`**: **`body[data-scene="…"]`** day + **`body[data-scene="…"].dark-mode`** night
3. [ ] **`scenes/NewScene.tsx`**: layers + **`sceneNight`**
4. [ ] **`SceneBackground.tsx`**: import + **`sceneId === "…"`** branch
5. [ ] **`styles.css`**: **`.scene-background.scene-{id}`** blocks for layers
6. [ ] Assets under **`public/assets/`** if needed
7. [ ] Reduced-motion rules if animations added
8. [ ] **`npm run build`**

---

## Optional: migrating old stored IDs

Legacy keys may exist under **`localStorage`** (`storage.ts`). If you rename or remove scenes, extend **`LEGACY_BACKGROUND_SCENE_HINT`** or adjust **`getSelectedScene`** normalization — see **`src/utils/storage.ts`** and **`src/utils/storage.test.ts`**.
