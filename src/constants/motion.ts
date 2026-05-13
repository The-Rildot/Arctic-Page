import type { CharacterPosition } from "../types/characters";

export const BASE_CHARACTER_DEFAULTS: Record<string, CharacterPosition> = {
  penguin: { x: 140, y: 120 },
  bear: { x: 520, y: 120 }
};

/** Desktop / large-viewport character hit box (matches `.character-root` art at 1×). */
export const DESKTOP_CHARACTER_PX = 300;

/** Viewport width at which playground characters shrink for “three abreast” mobile layout. */
export const MOBILE_BREAKPOINT_PX = 480;

/**
 * Adjacent figures overlap by this fraction of one character width per shared edge
 * so three characters fit across ~320px (see mobile plan Phase 2).
 */
const MOBILE_THREE_ABREAST_GAP_OVERLAP = 0.12;

export const CHARACTER_SIZES = {
  base: { width: DESKTOP_CHARACTER_PX, height: DESKTOP_CHARACTER_PX },
  custom: { width: DESKTOP_CHARACTER_PX, height: DESKTOP_CHARACTER_PX }
} as const;

/** How often the wander loop considers each character (slower = calmer scene). */
export const WANDER_INTERVAL_MS = 4200;
/** Per tick, probability a given character picks a new wander target (lower = rarer moves). */
export const WANDER_MOVE_CHANCE = 0.2;
/** Max pixels added to X/Y when wandering at desktop character size (scaled down on mobile). */
export const WANDER_DELTA_X = 48;
export const WANDER_DELTA_Y = 40;

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** Playground character outer box: desktop 300×300; on narrow viewports, square side fits ~3 figures with overlap. */
export function getPlaygroundCharacterSize(): { width: number; height: number } {
  if (typeof window === "undefined") {
    return { width: DESKTOP_CHARACTER_PX, height: DESKTOP_CHARACTER_PX };
  }
  const vw = window.innerWidth;
  if (vw > MOBILE_BREAKPOINT_PX) {
    return { width: DESKTOP_CHARACTER_PX, height: DESKTOP_CHARACTER_PX };
  }
  const denominator = 3 - 2 * MOBILE_THREE_ABREAST_GAP_OVERLAP;
  const side = Math.max(64, Math.floor(vw / denominator));
  return { width: side, height: side };
}

/** Arrow-key nudge at desktop; scales down with smaller playground characters. */
const KEYBOARD_NUDGE_BASE_PX = 20;

export function getKeyboardNudgePx(): number {
  const { width } = getPlaygroundCharacterSize();
  return Math.max(8, Math.round(KEYBOARD_NUDGE_BASE_PX * (width / DESKTOP_CHARACTER_PX)));
}

/** @deprecated Prefer `getKeyboardNudgePx()` — kept for tests / callers not yet migrated. */
export const KEYBOARD_NUDGE_PX = KEYBOARD_NUDGE_BASE_PX;

export function getWanderDeltaX(): number {
  const scale = getPlaygroundCharacterSize().width / DESKTOP_CHARACTER_PX;
  return Math.max(16, Math.round(WANDER_DELTA_X * scale));
}

export function getWanderDeltaY(): number {
  const scale = getPlaygroundCharacterSize().width / DESKTOP_CHARACTER_PX;
  return Math.max(14, Math.round(WANDER_DELTA_Y * scale));
}

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

/** Center of the layout viewport, clamped so the full character box stays on-screen (used for new custom characters). */
export function getCenteredCharacterPosition(size: { width: number; height: number }): CharacterPosition {
  if (typeof window === "undefined") {
    return { x: 60, y: 80 };
  }
  return clampPositionToViewport(
    {
      x: Math.round((window.innerWidth - size.width) / 2),
      y: Math.round((window.innerHeight - size.height) / 2)
    },
    size
  );
}

/** Clamp every draggable character to the viewport (resize, restored localStorage, etc.). */
export function clampAllCharacterPositions(
  positions: Record<string, CharacterPosition>,
  draggableCharacterIds: readonly string[],
  customCharacterIds: readonly string[]
): Record<string, CharacterPosition> {
  const size = getPlaygroundCharacterSize();
  const next = { ...positions };
  for (const id of draggableCharacterIds) {
    const isCustomCharacter = customCharacterIds.includes(id);
    const current =
      next[id] ??
      (isCustomCharacter ? { x: 200, y: 220 } : (BASE_CHARACTER_DEFAULTS[id] ?? { x: 200, y: 220 }));
    next[id] = clampPositionToViewport(current, size);
  }
  return next;
}
