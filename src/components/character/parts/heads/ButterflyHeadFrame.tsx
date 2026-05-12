import type { ReactNode } from "react";

export function ButterflyHeadFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="part-head part-head--butterfly">
      <span className="part-head__antenna part-head__antenna--left" aria-hidden="true">
        <span className="part-head__antenna-tip" />
      </span>
      <span className="part-head__antenna part-head__antenna--right" aria-hidden="true">
        <span className="part-head__antenna-tip" />
      </span>
      {children}
    </div>
  );
}
