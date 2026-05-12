import type { ReactNode } from "react";

export function LionBodyFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="part-body part-body--lion">
      <span className="part-body__belly" aria-hidden="true" />
      {children}
    </div>
  );
}
