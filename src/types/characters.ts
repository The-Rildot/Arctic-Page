export const CHARACTER_COMPONENT_KEYS = [
  "head",
  "body",
  "arms",
  "legs",
  "eyes",
  "mouthNose",
  "blush"
] as const;

export type CharacterComponentKey = (typeof CHARACTER_COMPONENT_KEYS)[number];

export type CharacterComponentOption = {
  variantId: string;
  color: string;
};

export type CharacterComponents = Record<CharacterComponentKey, CharacterComponentOption>;

export type CharacterPosition = {
  x: number;
  y: number;
};

export type BaseCharacter = {
  id: string;
  type: "base";
  species: "penguin" | "bear";
  position: CharacterPosition;
};

export type CustomCharacter = {
  id: string;
  type: "custom";
  name: string;
  position: CharacterPosition;
  components: CharacterComponents;
};

export type AppCharacter = BaseCharacter | CustomCharacter;
