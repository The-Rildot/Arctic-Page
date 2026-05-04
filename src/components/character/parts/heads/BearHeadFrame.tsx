import type { ReactNode } from "react";

export function BearHeadFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="bear-head">
      <div className="bear_ear left">
        <div className="bear_ear_in left"></div>
      </div>
      <div className="bear_ear right">
        <div className="bear_ear_in right"></div>
      </div>
      {children}
    </div>
  );
}
