import { useEffect, useState } from "react";
import { MOBILE_BREAKPOINT_PX } from "../constants/motion";

const phoneMediaQuery = `(max-width: ${MOBILE_BREAKPOINT_PX}px)`;

export function readPhoneLayout(): boolean {
  if (typeof globalThis.window === "undefined") {
    return false;
  }
  return globalThis.window.matchMedia(phoneMediaQuery).matches;
}

/** True when the layout viewport matches the app’s phone breakpoint (≤480px). */
export function usePhoneLayout(): boolean {
  const [isPhoneLayout, setIsPhoneLayout] = useState(readPhoneLayout);

  useEffect(() => {
    const mq = globalThis.window.matchMedia(phoneMediaQuery);
    const sync = () => setIsPhoneLayout(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isPhoneLayout;
}
