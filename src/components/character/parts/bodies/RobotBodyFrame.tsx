import type { ReactNode } from "react";

export function RobotBodyFrame({ children }: { children?: ReactNode }) {
  return <div className="part-body part-body--robot">{children}</div>;
}
