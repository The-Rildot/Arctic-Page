import { beforeEach, describe, expect, it } from "vitest";
import { storage } from "./storage";

/** Mirrors keys in storage.ts (tests integration with real module). */
const KEYS = {
  selectedScene: "arctic:selectedScene",
  selectedBackground: "arctic:selectedBackground"
} as const;

describe("storage.getSelectedScene", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns arctic when storage is empty", () => {
    expect(storage.getSelectedScene()).toBe("arctic");
  });

  it("returns persisted scene id when valid", () => {
    localStorage.setItem(KEYS.selectedScene, "ocean");
    expect(storage.getSelectedScene()).toBe("ocean");
  });

  it("falls back when stored scene id is invalid", () => {
    localStorage.setItem(KEYS.selectedScene, "volcano");
    expect(storage.getSelectedScene()).toBe("arctic");
  });

  it("migrates legacy sunset theme to desert", () => {
    localStorage.setItem(KEYS.selectedBackground, "bg-theme-sunset");
    expect(storage.getSelectedScene()).toBe("desert");
  });

  it("migrates legacy aurora theme to ocean", () => {
    localStorage.setItem(KEYS.selectedBackground, "bg-theme-aurora");
    expect(storage.getSelectedScene()).toBe("ocean");
  });

  it("migrates generic bg-theme-* to arctic when no hint", () => {
    localStorage.setItem(KEYS.selectedBackground, "bg-theme-mystery");
    expect(storage.getSelectedScene()).toBe("arctic");
  });

  it("prefers explicit selectedScene over legacy background", () => {
    localStorage.setItem(KEYS.selectedScene, "forest");
    localStorage.setItem(KEYS.selectedBackground, "bg-theme-sunset");
    expect(storage.getSelectedScene()).toBe("forest");
  });
});

describe("storage.setSelectedScene", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists scene id", () => {
    storage.setSelectedScene("city");
    expect(localStorage.getItem(KEYS.selectedScene)).toBe("city");
  });
});
