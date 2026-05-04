import type { PointerEvent, CSSProperties } from "react";
import type { CharacterComponents } from "../../types/characters";
import type { CharacterPosition } from "../../types/characters";
import { CharacterAssembler } from "./CharacterAssembler";
import { CharacterRoot } from "./CharacterRoot";

type CharacterViewProps = {
  components: CharacterComponents;
  messageText: string;
  shirtEmoji: string;
  position: CharacterPosition;
  className?: string;
  style?: CSSProperties;
  onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (event: PointerEvent<HTMLDivElement>) => void;
};

export function CharacterView({
  components,
  messageText,
  shirtEmoji,
  position,
  className = "",
  style,
  onPointerDown,
  onPointerUp
}: CharacterViewProps) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: 300,
        height: 300,
        ...style
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <CharacterRoot components={components}>
        <CharacterAssembler components={components} messageText={messageText} shirtEmoji={shirtEmoji} />
      </CharacterRoot>
    </div>
  );
}
