import { describe, expect, it } from "vitest";
import { parsePlaygroundImport } from "./playgroundExport";

const presetModules = import.meta.glob("../../presets/playground/*.json", {
  eager: true
}) as Record<string, { default: unknown } | unknown>;

function getJsonExport(mod: { default: unknown } | unknown): unknown {
  if (mod && typeof mod === "object" && "default" in mod) {
    return (mod as { default: unknown }).default;
  }
  return mod;
}

describe("presets/playground JSON files", () => {
  const paths = Object.keys(presetModules);

  it("includes at least one preset", () => {
    expect(paths.length).toBeGreaterThan(0);
  });

  for (const path of paths) {
    it(`${path} parses as PlaygroundExportV1`, () => {
      const raw = getJsonExport(presetModules[path]!);
      expect(parsePlaygroundImport(raw)).not.toBeNull();
    });
  }
});
