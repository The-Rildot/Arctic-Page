import type { CharacterComponentKey, CharacterComponents } from "../types/characters";

export const MAX_CUSTOM_CHARACTERS = 6;

export const CHARACTER_COMPONENT_LABELS: Record<CharacterComponentKey, string> = {
  head: "Head",
  body: "Body",
  arms: "Arms",
  legs: "Legs",
  eyes: "Eyes",
  mouthNose: "Mouth/Nose",
  blush: "Blush"
};

export const CHARACTER_VARIANT_OPTIONS: Record<CharacterComponentKey, string[]> = {
  head: ["penguin-head", "polar-bear-head", "lion-head", "robot-head", "butterfly-head"],
  body: ["penguin-body", "polar-bear-body", "lion-body", "robot-body", "butterfly-body"],
  arms: ["penguin-arms", "polar-bear-arms", "lion-arms", "robot-arms", "butterfly-arms"],
  legs: ["penguin-legs", "polar-bear-legs", "lion-legs", "robot-legs", "butterfly-legs"],
  eyes: ["penguin-eyes", "polar-bear-eyes", "lion-eyes", "robot-eyes", "butterfly-eyes"],
  mouthNose: ["penguin-beak", "polar-bear-nose", "lion-mouth", "robot-mouth", "butterfly-mouth"],
  blush: ["penguin-blush", "polar-bear-blush", "lion-blush", "robot-blush", "butterfly-blush"]
};

/** Initial picker colors for a new draft in Character Creator only (see `builtInCharacters` for presets). */
export const DEFAULT_COMPONENT_COLORS: Record<CharacterComponentKey, string> = {
  head: "#dbeafe",
  body: "#93c5fd",
  arms: "#bfdbfe",
  legs: "#bfdbfe",
  eyes: "#111827",
  mouthNose: "#7c3aed",
  blush: "#f472b6"
};

export const createDefaultComponents = (): CharacterComponents => ({
  head: { variantId: "lion-head", color: DEFAULT_COMPONENT_COLORS.head },
  body: { variantId: "lion-body", color: DEFAULT_COMPONENT_COLORS.body },
  arms: { variantId: "lion-arms", color: DEFAULT_COMPONENT_COLORS.arms },
  legs: { variantId: "lion-legs", color: DEFAULT_COMPONENT_COLORS.legs },
  eyes: { variantId: "lion-eyes", color: DEFAULT_COMPONENT_COLORS.eyes },
  mouthNose: { variantId: "lion-mouth", color: DEFAULT_COMPONENT_COLORS.mouthNose },
  blush: { variantId: "lion-blush", color: DEFAULT_COMPONENT_COLORS.blush }
});
