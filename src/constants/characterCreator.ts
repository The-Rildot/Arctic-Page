import type { CharacterComponentKey, CharacterComponents } from "../types/characters";

export const MAX_CUSTOM_CHARACTERS = 6;

export const CHARACTER_COMPONENT_LABELS: Record<CharacterComponentKey, string> = {
  head: "Head",
  body: "Body",
  arms: "Arms",
  legs: "Legs",
  shirt: "Shirt",
  eyes: "Eyes",
  mouthNose: "Mouth/Nose",
  blush: "Blush",
  message: "Message"
};

export const CHARACTER_VARIANT_OPTIONS: Record<CharacterComponentKey, string[]> = {
  head: ["penguin-head", "polar-bear-head", "seal-head", "owl-head"],
  body: ["penguin-body", "polar-bear-body", "seal-body", "robot-body"],
  arms: ["penguin-arms", "polar-bear-arms", "seal-fins", "robot-arms"],
  legs: ["penguin-legs", "polar-bear-legs", "seal-tail", "robot-legs"],
  shirt: ["penguin-shirt", "polar-bear-shirt", "hoodie-shirt", "jacket-shirt"],
  eyes: ["penguin-eyes", "polar-bear-eyes", "sleepy-eyes", "wide-eyes"],
  mouthNose: ["penguin-beak", "polar-bear-nose", "seal-snout", "robot-mouth"],
  blush: ["penguin-blush", "polar-bear-blush", "sunset-blush", "freckles"],
  message: ["classic-message", "bubble-message", "badge-message"]
};

export const DEFAULT_COMPONENT_COLORS: Record<CharacterComponentKey, string> = {
  head: "#dbeafe",
  body: "#93c5fd",
  arms: "#bfdbfe",
  legs: "#bfdbfe",
  shirt: "#f9a8d4",
  eyes: "#111827",
  mouthNose: "#7c3aed",
  blush: "#f472b6",
  message: "#0f172a"
};

export const createDefaultComponents = (): CharacterComponents => ({
  head: { variantId: "penguin-head", color: DEFAULT_COMPONENT_COLORS.head },
  body: { variantId: "penguin-body", color: DEFAULT_COMPONENT_COLORS.body },
  arms: { variantId: "penguin-arms", color: DEFAULT_COMPONENT_COLORS.arms },
  legs: { variantId: "penguin-legs", color: DEFAULT_COMPONENT_COLORS.legs },
  shirt: { variantId: "penguin-shirt", color: DEFAULT_COMPONENT_COLORS.shirt },
  eyes: { variantId: "penguin-eyes", color: DEFAULT_COMPONENT_COLORS.eyes },
  mouthNose: { variantId: "penguin-beak", color: DEFAULT_COMPONENT_COLORS.mouthNose },
  blush: { variantId: "penguin-blush", color: DEFAULT_COMPONENT_COLORS.blush },
  message: { variantId: "classic-message", color: DEFAULT_COMPONENT_COLORS.message }
});
