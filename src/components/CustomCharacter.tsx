import type { PointerEvent } from "react";
import type { CharacterPosition, CustomCharacter } from "../types/characters";
import { CharacterView } from "./character/CharacterView";

type CustomCharacterProps = {
  character: CustomCharacter;
  position: CharacterPosition;
  onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (event: PointerEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
};

export function CustomCharacter({ character, position, onPointerDown, onPointerUp, isDragging = false }: CustomCharacterProps) {
  return (
    <CharacterView
      className={`character-instance custom-character draggable-character${isDragging ? " dragging" : ""}`}
      components={character.components}
      messageText={character.messageText || "Message"}
      shirtEmoji="💬"
      position={position}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    />
  );
}
