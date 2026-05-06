import type { ReactNode } from "react";

export function ButterflyBodyFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="part-body part-body--butterfly">
      <span className="part-body__wing part-body__wing--left" />
      <span className="part-body__wing part-body__wing--right" />
      {children}
    </div>
  );
}
