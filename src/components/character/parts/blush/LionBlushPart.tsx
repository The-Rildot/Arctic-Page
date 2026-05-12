export function LionBlushPart() {
  return (
    <div className="part-blush part-blush--lion">
      <svg
        className="part-blush__strokes part-blush__strokes--left"
        viewBox="0 0 20 10"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <line x1="0" y1="10" x2="5" y2="0" />
        <line x1="5" y1="10" x2="10" y2="0" />
        <line x1="10" y1="10" x2="15" y2="0" />
        <line x1="15" y1="10" x2="20" y2="0" />
      </svg>
      <svg
        className="part-blush__strokes part-blush__strokes--right"
        viewBox="0 0 20 10"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <line x1="0" y1="0" x2="5" y2="10" />
        <line x1="5" y1="0" x2="10" y2="10" />
        <line x1="10" y1="0" x2="15" y2="10" />
        <line x1="15" y1="0" x2="20" y2="10" />
      </svg>
    </div>
  );
}
