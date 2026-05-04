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
