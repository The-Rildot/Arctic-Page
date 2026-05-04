import type { ReactNode } from "react";

export function BearBodyFrame({ children }: { children?: ReactNode }) {
  return <div className="bear-body">{children}</div>;
}
