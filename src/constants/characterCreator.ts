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
  head: ["round", "oval", "square"],
  body: ["round", "oval", "capsule"],
  arms: ["short", "medium", "long"],
  legs: ["short", "medium", "long"],
  shirt: ["plain", "stripe", "badge"],
  eyes: ["round", "oval", "dot"],
  mouthNose: ["smile", "flat", "triangle"],
  blush: ["soft", "wide", "none"],
  message: ["default"]
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
  head: { variantId: "round", color: DEFAULT_COMPONENT_COLORS.head },
  body: { variantId: "round", color: DEFAULT_COMPONENT_COLORS.body },
  arms: { variantId: "medium", color: DEFAULT_COMPONENT_COLORS.arms },
  legs: { variantId: "medium", color: DEFAULT_COMPONENT_COLORS.legs },
  shirt: { variantId: "plain", color: DEFAULT_COMPONENT_COLORS.shirt },
  eyes: { variantId: "round", color: DEFAULT_COMPONENT_COLORS.eyes },
  mouthNose: { variantId: "smile", color: DEFAULT_COMPONENT_COLORS.mouthNose },
  blush: { variantId: "soft", color: DEFAULT_COMPONENT_COLORS.blush },
  message: { variantId: "default", color: DEFAULT_COMPONENT_COLORS.message }
});
