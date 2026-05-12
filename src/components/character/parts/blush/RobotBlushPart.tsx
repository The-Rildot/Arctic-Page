export function RobotBlushPart() {
  return (
    <div className="part-blush part-blush--robot">
      <svg
        className="part-blush__zigzag part-blush__zigzag--left"
        viewBox="0 0 24 8"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <polyline points="0,4 4,1 8,7 12,1 16,7 20,1 24,4" />
      </svg>
      <svg
        className="part-blush__zigzag part-blush__zigzag--right"
        viewBox="0 0 24 8"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <polyline points="0,4 4,1 8,7 12,1 16,7 20,1 24,4" />
      </svg>
    </div>
  );
}
