import type { PointerEvent } from "react";
import type { CharacterPosition, CustomCharacter } from "../types/characters";
import { CharacterView } from "./character/CharacterView";

type CustomCharacterProps = {
  character: CustomCharacter;
  position: CharacterPosition;
  showNameLabel?: boolean;
  onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (event: PointerEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
};

export function CustomCharacter({
  character,
  position,
  showNameLabel = false,
  onPointerDown,
  onPointerUp,
  isDragging = false
}: CustomCharacterProps) {
  return (
    <CharacterView
      className={`character-instance custom-character draggable-character${isDragging ? " dragging" : ""}`}
      components={character.components}
      messageText={character.messageText || "Message"}
      shirtEmoji="💬"
      position={position}
      nameLabel={character.name}
      showNameLabel={showNameLabel}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    />
  );
}
