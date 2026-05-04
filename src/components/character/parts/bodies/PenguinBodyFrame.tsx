import type { ReactNode } from "react";

export function PenguinBodyFrame({ children }: { children?: ReactNode }) {
  return <div className="penguin-body">{children}</div>;
}
