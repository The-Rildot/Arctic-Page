import type { CharacterComponents } from "../types/characters";

/**
 * Frozen looks for on-canvas characters. Not tied to the creator’s draft defaults
 * (`createDefaultComponents`); change presets here without affecting “Create Character”.
 */
export const PENGUIN_PRESET: CharacterComponents = {
  head: { variantId: "penguin-head", color: "#141414" },
  body: { variantId: "penguin-body", color: "#030202" },
  arms: { variantId: "penguin-arms", color: "#141414" },
  legs: { variantId: "penguin-legs", color: "#545252" },
  eyes: { variantId: "penguin-eyes", color: "#111827" },
  mouthNose: { variantId: "penguin-beak", color: "#ed9913" },
  blush: { variantId: "penguin-blush", color: "#fbcfe8" }
};

export const BEAR_PRESET: CharacterComponents = {
  head: { variantId: "polar-bear-head", color: "#ffffff" },
  body: { variantId: "polar-bear-body", color: "#4b5563" },
  arms: { variantId: "polar-bear-arms", color: "#ffffff" },
  legs: { variantId: "polar-bear-legs", color: "#e5e7eb" },
  eyes: { variantId: "polar-bear-eyes", color: "#111827" },
  mouthNose: { variantId: "polar-bear-nose", color: "#111827" },
  blush: { variantId: "polar-bear-blush", color: "#fbcfe8" }
};
