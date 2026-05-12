import type { ReactNode } from "react";

// 12-point starburst polygon (outer r=48, inner r=30, centered on 50,50)
// for the lion's spiky mane. Precomputed to keep render light.
const LION_MANE_POINTS =
  "50,2 57.76,21.02 74,8.43 71.21,28.79 91.57,26 78.98,42.24 98,50 " +
  "78.98,57.76 91.57,74 71.21,71.21 74,91.57 57.76,78.98 50,98 " +
  "42.24,78.98 26,91.57 28.79,71.21 8.43,74 21.02,57.76 2,50 " +
  "21.02,42.24 8.43,26 28.79,28.79 26,8.43 42.24,21.02";

export function LionHeadFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="part-head part-head--lion">
      <svg
        className="part-head__mane"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <polygon points={LION_MANE_POINTS} />
      </svg>
      {children}
    </div>
  );
}
