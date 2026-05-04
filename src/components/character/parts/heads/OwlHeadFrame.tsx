import type { ReactNode } from "react";

export function OwlHeadFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="part-head part-head--owl">
      {children}
    </div>
  );
}
