/** Night styling uses `.scene-night` on layers (separate from `body.dark-mode`). */
export function sceneNight(base: string, isNightMode: boolean): string {
  return isNightMode ? `${base} scene-night` : base;
}
