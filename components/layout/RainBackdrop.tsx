const DROP_COUNT = 40;

// Deterministic pseudo-random layout so server and client render identical
// markup (no hydration mismatch) without needing client-only randomness.
function seededDrops(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 137.5) % 100;
    return {
      left: `${seed}%`,
      delay: `${(i % 10) * 0.4}s`,
      duration: `${1.6 + (i % 5) * 0.3}s`,
      opacity: 0.15 + ((i * 7) % 30) / 100,
    };
  });
}

const drops = seededDrops(DROP_COUNT);

/** Decorative rain layer. Purely atmospheric — aria-hidden, and removed entirely under prefers-reduced-motion via CSS. */
export function RainBackdrop() {
  return (
    <div className="rain-layer" aria-hidden="true">
      {drops.map((drop, i) => (
        <span
          key={i}
          className="rain-drop"
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
            opacity: drop.opacity,
          }}
        />
      ))}
    </div>
  );
}
