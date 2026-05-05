import { afterEach, describe, expect, it } from "vitest";
import { clamp, clampAllCharacterPositions, clampPositionToViewport } from "./motion";

describe("clamp", () => {
  it("returns min when value is below range", () => {
    expect(clamp(0, 10, 20)).toBe(10);
  });

  it("returns max when value is above range", () => {
    expect(clamp(100, 10, 20)).toBe(20);
  });

  it("returns value when inside range", () => {
    expect(clamp(15, 10, 20)).toBe(15);
  });

  it("handles equal min and max", () => {
    expect(clamp(5, 7, 7)).toBe(7);
  });
});

describe("clampPositionToViewport", () => {
  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 768, configurable: true });
  });

  it("keeps position when in bounds", () => {
    Object.defineProperty(window, "innerWidth", { value: 800, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 600, configurable: true });
    const size = { width: 300, height: 300 };
    expect(clampPositionToViewport({ x: 100, y: 120 }, size)).toEqual({ x: 100, y: 120 });
  });

  it("clamps X and Y when out of bounds", () => {
    Object.defineProperty(window, "innerWidth", { value: 400, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 300, configurable: true });
    const size = { width: 300, height: 300 };
    expect(clampPositionToViewport({ x: 500, y: 200 }, size)).toEqual({ x: 100, y: 0 });
  });
});

describe("clampAllCharacterPositions", () => {
  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 768, configurable: true });
  });

  it("clamps listed draggable ids only", () => {
    Object.defineProperty(window, "innerWidth", { value: 400, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 400, configurable: true });
    const draggable = ["penguin", "bear"] as const;
    const customIds: string[] = [];
    const result = clampAllCharacterPositions({ penguin: { x: 500, y: 0 }, bear: { x: 0, y: 500 } }, draggable, customIds);
    expect(result.penguin!.x).toBe(100);
    expect(result.bear!.y).toBe(100);
  });
});
