import { useEffect, useState } from "react";
import { getPlaygroundCharacterSize } from "../constants/motion";

/** Keeps drag hit boxes and `CharacterView` in sync when the viewport crosses the mobile breakpoint or resizes. */
export function usePlaygroundCharacterSize() {
  const [size, setSize] = useState(getPlaygroundCharacterSize);

  useEffect(() => {
    const onResize = () => setSize(getPlaygroundCharacterSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
}
