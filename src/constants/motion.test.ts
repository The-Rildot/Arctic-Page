import { afterEach, describe, expect, it } from "vitest";
import {
  clamp,
  clampAllCharacterPositions,
  clampPositionToViewport,
  getCenteredCharacterPosition,
  getKeyboardNudgePx,
  getPlaygroundCharacterSize
} from "./motion";

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

describe("getCenteredCharacterPosition", () => {
  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 768, configurable: true });
  });

  it("centers a 300px box in an 800×600 viewport", () => {
    Object.defineProperty(window, "innerWidth", { value: 800, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 600, configurable: true });
    const size = { width: 300, height: 300 };
    expect(getCenteredCharacterPosition(size)).toEqual({ x: 250, y: 150 });
  });
});

describe("getPlaygroundCharacterSize", () => {
  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 768, configurable: true });
  });

  it("returns desktop box above mobile breakpoint", () => {
    Object.defineProperty(window, "innerWidth", { value: 481, configurable: true });
    expect(getPlaygroundCharacterSize()).toEqual({ width: 300, height: 300 });
  });

  it("sizes for three-abreast at 320px width", () => {
    Object.defineProperty(window, "innerWidth", { value: 320, configurable: true });
    expect(getPlaygroundCharacterSize()).toEqual({ width: 115, height: 115 });
  });
});

describe("getKeyboardNudgePx", () => {
  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
  });

  it("scales down with mobile character width", () => {
    Object.defineProperty(window, "innerWidth", { value: 320, configurable: true });
    expect(getKeyboardNudgePx()).toBe(8);
  });

  it("matches base nudge at desktop width", () => {
    Object.defineProperty(window, "innerWidth", { value: 900, configurable: true });
    expect(getKeyboardNudgePx()).toBe(20);
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
    Object.defineProperty(window, "innerWidth", { value: 900, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 400, configurable: true });
    const draggable = ["penguin", "bear"] as const;
    const customIds: string[] = [];
    const result = clampAllCharacterPositions({ penguin: { x: 700, y: 0 }, bear: { x: 0, y: 500 } }, draggable, customIds);
    expect(result.penguin!.x).toBe(600);
    expect(result.bear!.y).toBe(100);
  });

  it("uses mobile character box when viewport is narrow", () => {
    Object.defineProperty(window, "innerWidth", { value: 320, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 568, configurable: true });
    const draggable = ["penguin", "bear"] as const;
    const customIds: string[] = [];
    const result = clampAllCharacterPositions({ penguin: { x: 300, y: 0 }, bear: { x: 0, y: 600 } }, draggable, customIds);
    expect(result.penguin!.x).toBe(205);
    expect(result.bear!.y).toBe(453);
  });
});
