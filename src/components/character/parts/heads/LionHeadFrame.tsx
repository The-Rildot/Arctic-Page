import type { ReactNode } from "react";

export function LionHeadFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="part-head part-head--lion">
      <span className="part-head__mane" />
      {children}
    </div>
  );
}
