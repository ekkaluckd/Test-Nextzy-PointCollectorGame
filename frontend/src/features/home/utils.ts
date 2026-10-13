import type { CSSProperties } from "react";

/** Positions an element along the progress bar; at 100% it is right-aligned so it never overflows. */
export function positionStyle(percent: number): CSSProperties {
  return percent >= 100 ? { right: 0 } : { left: `${percent}%`, transform: "translateX(-50%)" };
}
