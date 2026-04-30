import type { PointerEvent } from "react";
import type { CharacterPosition, CustomCharacter } from "../types/characters";

type CustomCharacterProps = {
  character: CustomCharacter;
  position: CharacterPosition;
  onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (event: PointerEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
};

const shapeMap: Record<string, string> = {
  round: "50%",
  oval: "45%",
  square: "16%",
  capsule: "40%",
  dot: "50%",
  smile: "50%",
  flat: "12%",
  triangle: "4px",
  soft: "50%",
  wide: "35%",
  none: "0%",
  plain: "12%",
  stripe: "24%",
  badge: "50%",
  short: "25%",
  medium: "40%",
  long: "60%",
  default: "12%"
};

export function CustomCharacter({
  character,
  position,
  onPointerDown,
  onPointerUp,
  isDragging = false
}: CustomCharacterProps) {
  const { components } = character;

  return (
    <div
      className={`custom-character draggable-character${isDragging ? " dragging" : ""}`}
      style={{
        left: position.x,
        top: position.y
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div
        className="custom-head"
        style={{
          backgroundColor: components.head.color,
          borderRadius: shapeMap[components.head.variantId] ?? "50%"
        }}
      >
        <div className="custom-eyes">
          <span
            className="custom-eye"
            style={{
              backgroundColor: components.eyes.color,
              borderRadius: shapeMap[components.eyes.variantId] ?? "50%"
            }}
          ></span>
          <span
            className="custom-eye"
            style={{
              backgroundColor: components.eyes.color,
              borderRadius: shapeMap[components.eyes.variantId] ?? "50%"
            }}
          ></span>
        </div>
        <div
          className="custom-mouth"
          style={{
            backgroundColor: components.mouthNose.color,
            borderRadius: shapeMap[components.mouthNose.variantId] ?? "12%"
          }}
        ></div>
        <div className="custom-blush-row">
          <span
            className="custom-blush"
            style={{
              backgroundColor: components.blush.color,
              borderRadius: shapeMap[components.blush.variantId] ?? "50%"
            }}
          ></span>
          <span
            className="custom-blush"
            style={{
              backgroundColor: components.blush.color,
              borderRadius: shapeMap[components.blush.variantId] ?? "50%"
            }}
          ></span>
        </div>
      </div>

      <div
        className="custom-body"
        style={{
          backgroundColor: components.body.color,
          borderRadius: shapeMap[components.body.variantId] ?? "40%"
        }}
      >
        <div className="custom-arms">
          <span
            className="custom-arm"
            style={{ backgroundColor: components.arms.color, height: shapeMap[components.arms.variantId] ?? "40%" }}
          ></span>
          <span
            className="custom-arm"
            style={{ backgroundColor: components.arms.color, height: shapeMap[components.arms.variantId] ?? "40%" }}
          ></span>
        </div>
        <div
          className="custom-shirt"
          style={{
            backgroundColor: components.shirt.color,
            borderRadius: shapeMap[components.shirt.variantId] ?? "12%"
          }}
        >
          <span style={{ color: components.message.color }}>{character.messageText || "Message"}</span>
        </div>
        <div className="custom-legs">
          <span
            className="custom-leg"
            style={{ backgroundColor: components.legs.color, height: shapeMap[components.legs.variantId] ?? "40%" }}
          ></span>
          <span
            className="custom-leg"
            style={{ backgroundColor: components.legs.color, height: shapeMap[components.legs.variantId] ?? "40%" }}
          ></span>
        </div>
      </div>
    </div>
  );
}
