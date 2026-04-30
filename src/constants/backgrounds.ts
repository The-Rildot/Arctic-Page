export const BACKGROUND_OPTIONS = [
  { className: "bg-theme-arctic", label: "Arctic Blue" },
  { className: "bg-theme-snow", label: "Snow White" },
  { className: "bg-theme-lavender", label: "Lavender" },
  { className: "bg-theme-aurora", label: "Aurora Mint" },
  { className: "bg-theme-sunset", label: "Sunset Peach" }
] as const;

export const DEFAULT_BACKGROUND_CLASS = BACKGROUND_OPTIONS[0].className;
