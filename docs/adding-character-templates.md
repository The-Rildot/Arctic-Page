# Adding character templates (new part variants)

In this codebase, a **character template** is a **combinable part variant**: e.g. a new `"robot-head"` that can be picked in the Character Creator and saved on custom characters.

Custom characters persist `variantId` + `color` per slot (`CharacterComponents`). The renderer resolves each slot to a React component via **`partRegistry.tsx`**.

---

## Mental model

1. **`characterCreator.ts`** — lists which `variantId` strings appear in each creator dropdown (`CHARACTER_VARIANT_OPTIONS`).
2. **`partRegistry.tsx`** — maps each `variantId` to an actual **`ComponentType`** (your part).
3. **`src/components/character/parts/*`** — the React markup + class names used for drawing that part.

Colors are **not** baked into parts: `CharacterRoot` applies CSS variables from `src/character/characterVars.ts` (`--char-head`, `--char-body`, …) from the chosen `components.*.color` values.

If a variant is missing from both the options list **and** the registry map for a slot, **`partRegistry`** falls back to a penguin-shaped default so the app rarely crashes.

---

## Checklist — add one new variant (example: new head)

Use a **consistent string id**, e.g. `alien-head` (kebab-case, unique per slot type).

### 1. Implement the React part

Create a file next to sibling heads:

- Path pattern: `src/components/character/parts/heads/<YourName>HeadFrame.tsx`

Match an existing pattern (frames often wrap **`children`** for nested eyes/blush):

```tsx
import type { ReactNode } from "react";

export function AlienHeadFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="your-head-shell">
      {children}
    </div>
  );
}
```

- Reuse **`styles.css`** under `.character-root` (existing classes) or introduce new selectors scoped under `.character-root .your-head-shell`.
- Prefer CSS variables **`var(--char-head)`**, **`var(--char-face)`**, etc., so picker colors apply.

References:

- `src/components/character/parts/heads/PenguinHeadFrame.tsx` — simple frame + children  
- Bear / seal heads — other frame shapes  

### 2. Register in `partRegistry.tsx`

Import your component at the top, then extend the matching map **`headMap`** (or `bodyMap`, `armsMap`, …):

```tsx
const headMap: Record<string, ComponentType<{ children?: ReactNode }>> = {
  "penguin-head": PenguinHeadFrame,
  "alien-head": AlienHeadFrame
};
```

Maps live in **`src/components/character/partRegistry.tsx`**.

**Slot → map name**

| Creator key | Resolver | Map constant |
|-------------|----------|--------------|
| `head` | `resolveHead` | `headMap` |
| `body` | `resolveBody` | `bodyMap` |
| `arms` | `resolveArms` | `armsMap` |
| `legs` | `resolveLegs` | `legsMap` |
| `shirt` | `resolveShirt` | `shirtMap` |
| `eyes` | `resolveEyes` | `eyesMap` |
| `mouthNose` | `resolveMouth` | `mouthMap` |
| `blush` | `resolveBlush` | `blushMap` |

**Shirt maps** expect props: **`{ messageText, emoji, messageClassSuffix }`** — copy an existing shirt part signature.

### 3. Expose in the Character Creator dropdown

Edit **`CHARACTER_VARIANT_OPTIONS`** in **`src/constants/characterCreator.ts`**:

```ts
head: ["penguin-head", "polar-bear-head", "seal-head", "owl-head", "alien-head"],
```

Keep the **`variantId`** string **identical** to the registry key.

Optionally extend **`CHARACTER_COMPONENT_LABELS`** only if you add entirely new creator UI sections (rare).

### 4. Messages (shirt / badge styles)

Message **shape** variants use `components.message.variantId` as:

- **`classic-message`**, **`bubble-message`**, **`badge-message`** (see **`messageVariantClassSuffix`** in `partRegistry.tsx`).

Adding a fourth style requires:

1. A new **`variantId`** in `CHARACTER_VARIANT_OPTIONS.message`.
2. New branch(es) in **`messageVariantClassSuffix`** returning the CSS suffix your shirt/message markup expects (`part-message--bubble`, etc. in **`styles.css`**).
3. Shirt parts that honor that suffix (see existing Penguin/Bear shirts).

---

## Adding a matching “preset” (optional)

**Built-ins** (`PENGUIN_PRESET`, `BEAR_PRESET`) live in **`src/constants/builtInCharacters.ts`** and are unrelated to **`createDefaultComponents()`** — update presets only if you want a draggable default character using your new variants.

Saved **custom characters** store full `CharacterComponents`; no extra step once registry + options exist.

---

## Types and limits

- Schema: **`CharacterComponents`** in **`src/types/characters.ts`** (nine keys, each `{ variantId, color }`).
- Max customs: **`MAX_CUSTOM_CHARACTERS`** in **`characterCreator.ts`**.

---

## Verify

Run:

```bash
npm run lint
npm run build
```

Manually: open **Create Character**, pick each new option, save, reload — confirm renders and persists.
