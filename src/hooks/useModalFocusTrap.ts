import { RefObject, useEffect, useRef } from "react";

const TAB_FOCUSABLE = [
  "button:not([disabled])",
  "[href]:not([tabindex='-1'])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

function visibleFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(TAB_FOCUSABLE)).filter((el) => {
    const style = globalThis.window.getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
}

/** Focus trap inside `container`, Escape to dismiss, restores focus when closed. */
export function useModalFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  onEscape: () => void
): void {
  const onEscapeRef = useRef(onEscape);
  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      return;
    }
    const container = containerRef.current;
    const prevActive =
      typeof document !== "undefined" ? (document.activeElement as HTMLElement | null) : null;

    let focusables = visibleFocusables(container);
    if (focusables.length === 0) {
      container.setAttribute("tabindex", "-1");
      container.focus({ preventScroll: true });
    } else {
      focusables[0]?.focus({ preventScroll: true });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onEscapeRef.current();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      focusables = visibleFocusables(container);
      if (focusables.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else if (active === last || !container.contains(active)) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      container.removeAttribute("tabindex");

      const stillInDom = typeof document !== "undefined" && prevActive && document.body.contains(prevActive);
      if (stillInDom) {
        prevActive.focus({ preventScroll: true });
      }
    };
  }, [isActive, containerRef]);
}
