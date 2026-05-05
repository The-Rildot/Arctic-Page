import type { KeyboardEvent, PointerEvent, CSSProperties } from "react";
import { KEYBOARD_NUDGE_PX } from "../../constants/motion";
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
  /** Stable id for keyboard nudge (`penguin`, `bear`, or custom id). */
  characterId?: string;
  onArrowKeyNudge?: (characterId: string, deltaX: number, deltaY: number) => void;
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
  characterId,
  onArrowKeyNudge,
  onPointerDown,
  onPointerUp
}: CharacterViewProps) {
  const resolvedLabel = nameLabel?.trim();
  const showLabel = Boolean(showNameLabel && resolvedLabel);
  const keyboardMovable = Boolean(characterId && onArrowKeyNudge);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!keyboardMovable || !characterId || !onArrowKeyNudge) {
      return;
    }
    const step = KEYBOARD_NUDGE_PX;
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        onArrowKeyNudge(characterId, -step, 0);
        break;
      case "ArrowRight":
        event.preventDefault();
        onArrowKeyNudge(characterId, step, 0);
        break;
      case "ArrowUp":
        event.preventDefault();
        onArrowKeyNudge(characterId, 0, -step);
        break;
      case "ArrowDown":
        event.preventDefault();
        onArrowKeyNudge(characterId, 0, step);
        break;
      default:
        break;
    }
  };

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
      role={keyboardMovable ? "application" : undefined}
      aria-label={
        showLabel
          ? keyboardMovable
            ? `${resolvedLabel}. Use arrow keys to move.`
            : resolvedLabel
          : keyboardMovable
            ? "Character. Use arrow keys to move when focused."
            : undefined
      }
      title={keyboardMovable ? "Focus this character, then use arrow keys to move." : undefined}
      tabIndex={keyboardMovable ? 0 : undefined}
      onKeyDown={handleKeyDown}
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
