// Placeholder JF monogram. Lee swaps for the real brand asset later.
export function JFMonogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Joner Football">
      <rect width="64" height="64" rx="12" fill="#CC0000" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontWeight="900"
        fontSize="32"
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
        fill="#ffffff"
        letterSpacing="-1"
      >
        JF
      </text>
    </svg>
  );
}
