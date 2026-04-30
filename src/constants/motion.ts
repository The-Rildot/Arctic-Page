import type { CharacterPosition } from "../types/characters";

export const BASE_CHARACTER_DEFAULTS: Record<string, CharacterPosition> = {
  penguin: { x: 140, y: 120 },
  bear: { x: 520, y: 120 }
};

export const CHARACTER_SIZES = {
  base: { width: 300, height: 300 },
  custom: { width: 140, height: 180 }
} as const;

export const WANDER_INTERVAL_MS = 1800;
export const WANDER_MOVE_CHANCE = 0.35;
export const WANDER_DELTA_X = 60;
export const WANDER_DELTA_Y = 50;

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
