const CIRCLES = [
  { size: 90, top: "12%", left: "8%", driftX: 22, driftY: -16, duration: 9, delay: 0, opacity: 0.35 },
  { size: 140, top: "55%", left: "3%", driftX: -18, driftY: 20, duration: 12, delay: 1.2, opacity: 0.25 },
  { size: 70, top: "20%", left: "88%", driftX: -24, driftY: 14, duration: 8, delay: 0.6, opacity: 0.4 },
  { size: 160, top: "70%", left: "82%", driftX: 20, driftY: -22, duration: 14, delay: 2, opacity: 0.2 },
  { size: 50, top: "40%", left: "45%", driftX: 14, driftY: 18, duration: 10, delay: 0.9, opacity: 0.3 },
];

/** Decorative, aria-hidden drifting light circles — evokes blurred café/street lights through a rainy window. */
export function BokehLights() {
  return (
    <div className="bokeh-layer" aria-hidden="true">
      {CIRCLES.map((c, i) => (
        <span
          key={i}
          className="bokeh-circle"
          style={{
            width: c.size,
            height: c.size,
            top: c.top,
            left: c.left,
            opacity: c.opacity,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
            ["--drift-x" as string]: `${c.driftX}px`,
            ["--drift-y" as string]: `${c.driftY}px`,
          }}
        />
      ))}
    </div>
  );
}
