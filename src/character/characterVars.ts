import type { CSSProperties } from "react";
import type { CharacterComponents } from "../types/characters";

export function characterCssVariables(components: CharacterComponents): CSSProperties {
  return {
    "--char-head": components.head.color,
    "--char-face": "#ffffff",
    "--char-body": components.body.color,
    "--char-arms": components.arms.color,
    "--char-legs": components.legs.color,
    "--char-shirt": components.shirt.color,
    "--char-eyes": components.eyes.color,
    "--char-mouth": components.mouthNose.color,
    "--char-blush": components.blush.color,
    "--char-message": components.message.color
  } as CSSProperties;
}
