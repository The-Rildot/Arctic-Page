export function LionMouthPart() {
  return (
    <div className="part-mouth part-mouth--lion">
      <svg
        className="part-mouth__svg"
        viewBox="0 0 24 22"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {/* Triangular nose pointing down */}
        <polygon className="part-mouth__nose" points="6,2 18,2 12,9" />
        {/* Vertical stem from the nose tip to the Y junction */}
        <line className="part-mouth__stroke" x1="12" y1="9" x2="12" y2="14" />
        {/* Upside-down Y branches forming the lion's mouth */}
        <path className="part-mouth__stroke" d="M12 14 Q 8 18 4 20" />
        <path className="part-mouth__stroke" d="M12 14 Q 16 18 20 20" />
      </svg>
    </div>
  );
}
