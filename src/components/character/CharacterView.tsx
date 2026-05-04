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
  /** Visible above the character when `showNameLabel` is true (custom uses creator name; built-ins use stored labels). */
  nameLabel?: string;
  showNameLabel?: boolean;
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
  nameLabel,
  showNameLabel = false,
  onPointerDown,
  onPointerUp
}: CharacterViewProps) {
  const resolvedLabel = nameLabel?.trim();
  const showLabel = Boolean(showNameLabel && resolvedLabel);

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
      aria-label={showLabel ? resolvedLabel : undefined}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {showLabel ? (
        <div className="character-name-label" aria-hidden="true">
          {resolvedLabel}
        </div>
      ) : null}
      <CharacterRoot components={components}>
        <CharacterAssembler components={components} messageText={messageText} shirtEmoji={shirtEmoji} />
      </CharacterRoot>
    </div>
  );
}
