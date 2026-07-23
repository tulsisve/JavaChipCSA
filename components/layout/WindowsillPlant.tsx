/** A small potted plant silhouette — a plain café windowsill detail, and an easy way to bring real green into the palette instead of only browns/ambers. */
export function WindowsillPlant({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-20 w-16 ${className}`} aria-hidden="true">
      <span className="absolute bottom-0 left-1/2 h-9 w-11 -translate-x-1/2 rounded-t-sm rounded-b-md bg-burgundy-bright" />
      <span className="absolute bottom-7 left-1/2 h-14 w-3 -translate-x-1/2 rotate-[-8deg] rounded-full bg-sage-bright/85" />
      <span className="absolute bottom-8 left-[38%] h-11 w-3 -translate-x-1/2 rotate-[10deg] rounded-full bg-sage-bright" />
      <span className="absolute bottom-9 left-[62%] h-9 w-2.5 -translate-x-1/2 rotate-[-22deg] rounded-full bg-sage-bright/75" />
      <span className="absolute bottom-10 left-[48%] h-12 w-2.5 -translate-x-1/2 rotate-[3deg] rounded-full bg-sage-bright/95" />
    </div>
  );
}
