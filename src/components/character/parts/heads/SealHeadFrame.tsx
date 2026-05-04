import type { ReactNode } from "react";

export function SealHeadFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="part-head part-head--seal">
      {children}
    </div>
  );
}
