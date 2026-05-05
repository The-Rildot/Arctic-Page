import type { CharacterPosition } from "../types/characters";

export const BASE_CHARACTER_DEFAULTS: Record<string, CharacterPosition> = {
  penguin: { x: 140, y: 120 },
  bear: { x: 520, y: 120 }
};

export const CHARACTER_SIZES = {
  base: { width: 300, height: 300 },
  custom: { width: 300, height: 300 }
} as const;

/** How often the wander loop considers each character (slower = calmer scene). */
export const WANDER_INTERVAL_MS = 4200;
/** Per tick, probability a given character picks a new wander target (lower = rarer moves). */
export const WANDER_MOVE_CHANCE = 0.2;
/** Max pixels added to X/Y when wandering (smaller = gentler slides). */
export const WANDER_DELTA_X = 48;
export const WANDER_DELTA_Y = 40;

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** Clamp a character’s top-left position so the box stays inside the current viewport. */
export function clampPositionToViewport(
  position: CharacterPosition,
  size: { width: number; height: number }
): CharacterPosition {
  const maxX = Math.max(0, window.innerWidth - size.width);
  const maxY = Math.max(0, window.innerHeight - size.height);
  return {
    x: clamp(position.x, 0, maxX),
    y: clamp(position.y, 0, maxY)
  };
}

/** Clamp every draggable character to the viewport (resize, restored localStorage, etc.). */
/** Arrow-key move per keypress when a character has keyboard focus. */
export const KEYBOARD_NUDGE_PX = 20;

export function clampAllCharacterPositions(
  positions: Record<string, CharacterPosition>,
  draggableCharacterIds: readonly string[],
  customCharacterIds: readonly string[]
): Record<string, CharacterPosition> {
  const next = { ...positions };
  for (const id of draggableCharacterIds) {
    const isCustomCharacter = customCharacterIds.includes(id);
    const size = isCustomCharacter ? CHARACTER_SIZES.custom : CHARACTER_SIZES.base;
    const current =
      next[id] ??
      (isCustomCharacter ? { x: 200, y: 220 } : (BASE_CHARACTER_DEFAULTS[id] ?? { x: 200, y: 220 }));
    next[id] = clampPositionToViewport(current, size);
  }
  return next;
}
