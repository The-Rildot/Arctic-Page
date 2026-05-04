import type { ReactNode } from "react";

export function PenguinHeadFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="penguin-head">
      <div className="face left"></div>
      <div className="face right"></div>
      <div className="chin"></div>
      {children}
    </div>
  );
}
