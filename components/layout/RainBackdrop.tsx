const DROP_COUNT = 55;

// Deterministic pseudo-random layout so server and client render identical
// markup (no hydration mismatch) without needing client-only randomness.
function seededDrops(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 137.5) % 100;
    return {
      left: `${seed}%`,
      delay: `${(i % 12) * 0.35}s`,
      duration: `${1.3 + (i % 6) * 0.28}s`,
      opacity: 0.12 + ((i * 7) % 30) / 100,
      height: 60 + ((i * 13) % 90),
      width: i % 5 === 0 ? 1.5 : 1,
    };
  });
}

const drops = seededDrops(DROP_COUNT);

/** Decorative rain + windowsill glow. Purely atmospheric — aria-hidden, and removed entirely under prefers-reduced-motion via CSS. */
export function RainBackdrop({ withPuddleGlow = true }: { withPuddleGlow?: boolean }) {
  return (
    <div className="rain-layer" aria-hidden="true">
      {drops.map((drop, i) => (
        <span
          key={i}
          className="rain-drop"
          style={{
            left: drop.left,
            height: drop.height,
            width: drop.width,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
            opacity: drop.opacity,
          }}
        />
      ))}
      {withPuddleGlow && <div className="rain-puddle-glow" />}
    </div>
  );
}
