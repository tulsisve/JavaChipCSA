const BUILDINGS = [
  { w: 9, h: 38, lit: [20, 55] },
  { w: 6, h: 62, lit: [15, 40, 70] },
  { w: 11, h: 30, lit: [50] },
  { w: 7, h: 78, lit: [10, 35, 60, 85] },
  { w: 13, h: 45, lit: [25, 65] },
  { w: 5, h: 55, lit: [30] },
  { w: 10, h: 68, lit: [20, 50, 80] },
  { w: 8, h: 34, lit: [40] },
  { w: 12, h: 58, lit: [15, 45, 75] },
];

const DROPS = Array.from({ length: 26 }, (_, i) => ({
  left: `${(i * 37.5) % 100}%`,
  delay: `${(i % 9) * 0.35}s`,
  duration: `${1.1 + (i % 7) * 0.22}s`,
  height: 40 + ((i * 17) % 70),
  opacity: 0.18 + ((i * 11) % 35) / 100,
}));

const STREETLIGHTS = [
  { left: "8%", size: 46, delay: "0s" },
  { left: "28%", size: 30, delay: "1.4s" },
  { left: "52%", size: 58, delay: "0.6s" },
  { left: "74%", size: 34, delay: "2.1s" },
  { left: "90%", size: 42, delay: "0.9s" },
];

/**
 * A literal multi-pane café window at golden-hour dusk: warm amber-brown
 * sky (no blue — this stays in the coffee-shop palette), a distant lit
 * skyline, streetlight bokeh, and rain sliding down the glass — behind
 * visible wooden mullions. Built entirely in CSS (no image assets).
 */
export function CafeWindow({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* Wooden frame */}
      <div className="wood-surface pixel-corners-lg bg-cafe-wood p-2.5 shadow-2xl shadow-black/50 sm:p-3.5">
        <div className="pixel-corners relative overflow-hidden bg-gradient-to-b from-cafe-wood via-walnut to-dark-roast">
          {/* Sky + street scene (one continuous view behind the mullions) */}
          <div className="relative aspect-[6/5] w-full overflow-hidden">
            {/* streetlight bokeh */}
            {STREETLIGHTS.map((light, i) => (
              <span
                key={i}
                className="absolute rounded-full opacity-70 blur-[6px]"
                style={{
                  left: light.left,
                  bottom: "22%",
                  width: light.size,
                  height: light.size,
                  background: "radial-gradient(circle, var(--amber-glow), transparent 70%)",
                  animation: `bokeh-drift 7s ease-in-out infinite alternate`,
                  animationDelay: light.delay,
                }}
              />
            ))}

            {/* a warm moon / distant lamp glow high in the sky for depth */}
            <span
              className="absolute right-[12%] top-[10%] h-16 w-16 rounded-full opacity-50 blur-md"
              style={{ background: "radial-gradient(circle, var(--soft-gold), transparent 70%)" }}
            />

            {/* skyline silhouette */}
            <div className="absolute inset-x-0 bottom-0 flex h-[42%] items-end">
              {BUILDINGS.map((b, i) => (
                <div
                  key={i}
                  className="relative bg-espresso"
                  style={{ width: `${b.w}%`, height: `${b.h}%` }}
                >
                  {b.lit.map((top, j) => (
                    <span
                      key={j}
                      className="absolute h-[3px] w-[3px] bg-amber sm:h-[4px] sm:w-[4px]"
                      style={{ left: "35%", top: `${top}%`, opacity: 0.85 }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* rain sliding down the glass */}
            <div className="absolute inset-0">
              {DROPS.map((d, i) => (
                <span
                  key={i}
                  className="rain-drop"
                  style={{
                    left: d.left,
                    height: d.height,
                    opacity: d.opacity,
                    animationDelay: d.delay,
                    animationDuration: d.duration,
                  }}
                />
              ))}
            </div>

            {/* glass reflection sweep */}
            <div className="light-sweep" />

            {/* inner glass vignette so edges read as glass, not a flat image */}
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_18px_rgba(0,0,0,0.45)]" />
          </div>

          {/* Mullions — wooden dividers overlaid on the shared scene, 3x2 panes */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="border-cafe-wood/90 [border-width:3px] sm:[border-width:5px]" />
            ))}
          </div>
        </div>
      </div>

      {/* Condensation droplets clinging to the outer frame edge, for a touch
          of tactile realism. */}
      <span className="absolute -bottom-2 left-10 h-2 w-2 rounded-full bg-latte/60 blur-[1px]" />
      <span className="absolute -bottom-3 left-24 h-1.5 w-1.5 rounded-full bg-latte/50 blur-[1px]" />
    </div>
  );
}
