import { afterEach, describe, expect, it, vi } from "vitest";
import { readPhoneLayout } from "./usePhoneLayout";

function mockMatchMedia(matches: boolean) {
  const mql = {
    matches,
    media: "(max-width: 480px)",
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null as ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null
  };
  window.matchMedia = vi.fn(() => mql) as unknown as typeof window.matchMedia;
}

describe("readPhoneLayout", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("returns true when the phone breakpoint media query matches", () => {
    mockMatchMedia(true);
    expect(readPhoneLayout()).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 480px)");
  });

  it("returns false when the phone breakpoint media query does not match", () => {
    mockMatchMedia(false);
    expect(readPhoneLayout()).toBe(false);
  });
});
