import { createDefaultComponents } from "./characterCreator";
import type { CharacterComponents } from "../types/characters";

export const PENGUIN_PRESET: CharacterComponents = createDefaultComponents();

export const BEAR_PRESET: CharacterComponents = {
  head: { variantId: "polar-bear-head", color: "#ffffff" },
  body: { variantId: "polar-bear-body", color: "#4b5563" },
  arms: { variantId: "polar-bear-arms", color: "#ffffff" },
  legs: { variantId: "polar-bear-legs", color: "#e5e7eb" },
  shirt: { variantId: "polar-bear-shirt", color: "#1f2937" },
  eyes: { variantId: "polar-bear-eyes", color: "#111827" },
  mouthNose: { variantId: "polar-bear-nose", color: "#111827" },
  blush: { variantId: "polar-bear-blush", color: "#fbcfe8" },
  message: { variantId: "classic-message", color: "#9dc2fa" }
};
