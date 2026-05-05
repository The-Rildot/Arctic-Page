export const SCENE_IDS = ["arctic", "desert", "ocean", "city", "forest", "space"] as const;

export type SceneId = (typeof SCENE_IDS)[number];

export const DEFAULT_SCENE_ID: SceneId = "arctic";

export const SCENE_PRESETS: readonly { id: SceneId; label: string }[] = [
  { id: "arctic", label: "Arctic" },
  { id: "desert", label: "Desert" },
  { id: "ocean", label: "Ocean" },
  { id: "city", label: "City" },
  { id: "forest", label: "Forest" },
  { id: "space", label: "Space" }
] as const;

export function isSceneId(value: string): value is SceneId {
  return (SCENE_IDS as readonly string[]).includes(value);
}
