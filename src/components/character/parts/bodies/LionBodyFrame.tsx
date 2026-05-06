import type { ReactNode } from "react";

export function LionBodyFrame({ children }: { children?: ReactNode }) {
  return <div className="part-body part-body--lion">{children}</div>;
}
