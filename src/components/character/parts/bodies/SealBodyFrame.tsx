import type { ReactNode } from "react";

export function SealBodyFrame({ children }: { children?: ReactNode }) {
  return <div className="part-body part-body--seal">{children}</div>;
}
