import type { ReactNode } from "react";

export function RobotBodyFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="part-body part-body--robot">
      <span className="part-body__screen" aria-hidden="true">
        <svg
          className="part-body__screen-line"
          viewBox="0 0 60 18"
          preserveAspectRatio="none"
          focusable="false"
        >
          <polyline points="0,9 8,9 12,3 18,15 24,7 30,11 36,5 42,12 50,9 60,9" />
        </svg>
      </span>
      {children}
    </div>
  );
}
