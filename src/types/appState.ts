import type { CharacterPosition, CustomCharacter } from "./characters";

export type AppStateStorage = {
  isNightMode: boolean;
  selectedBackground: string;
  customCharacters: CustomCharacter[];
  characterPositions: Record<string, CharacterPosition>;
};
