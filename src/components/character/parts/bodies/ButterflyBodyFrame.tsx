import type { ReactNode } from "react";

export function ButterflyBodyFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="part-body part-body--butterfly">
      <span className="part-body__wing part-body__wing--upper part-body__wing--left" aria-hidden="true" />
      <span className="part-body__wing part-body__wing--upper part-body__wing--right" aria-hidden="true" />
      <span className="part-body__wing part-body__wing--lower part-body__wing--left" aria-hidden="true" />
      <span className="part-body__wing part-body__wing--lower part-body__wing--right" aria-hidden="true" />
      {children}
    </div>
  );
}
