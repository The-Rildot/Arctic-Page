import type { ReactNode } from "react";

export function RobotHeadFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="part-head part-head--robot">
      <span className="part-head__antenna" aria-hidden="true">
        <span className="part-head__antenna-tip" />
      </span>
      {children}
    </div>
  );
}
