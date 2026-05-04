import { describe, expect, it } from "vitest";
import { clamp } from "./motion";

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
