import type { SceneId } from "../constants/scenes";
import type { CharacterPosition, CustomCharacter } from "./characters";

export type AppStateStorage = {
  isNightMode: boolean;
  selectedScene: SceneId;
  customCharacters: CustomCharacter[];
  characterPositions: Record<string, CharacterPosition>;
};
