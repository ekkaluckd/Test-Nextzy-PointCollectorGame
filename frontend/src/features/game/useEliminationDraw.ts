"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ELIMINATION_STEP_MS } from "@/constants/game";

export type DrawPhase = "idle" | "drawing" | "finished";

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Drives the "eliminate one option at a time" animation.
 * The winning value is decided by `drawResult` (the server) before the animation starts,
 * so the animation is purely visual and cannot influence the outcome.
 */
export function useEliminationDraw(
  options: readonly number[],
  drawResult: () => Promise<number>,
  onReveal?: (value: number) => void,
) {
  const [phase, setPhase] = useState<DrawPhase>("idle");
  const [eliminated, setEliminated] = useState<Set<number>>(new Set());
  const [winner, setWinner] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setEliminated(new Set());
    setWinner(null);
    setPhase("drawing");

    let result: number;
    try {
      result = await drawResult();
    } catch (e) {
      if (!mounted.current) return;
      setError(e instanceof Error ? e.message : "สุ่มคะแนนไม่สำเร็จ กรุณาลองใหม่");
      setPhase("idle");
      return;
    }

    for (const value of shuffle(options.filter((o) => o !== result))) {
      await wait(ELIMINATION_STEP_MS);
      if (!mounted.current) return;
      setEliminated((prev) => new Set(prev).add(value));
    }

    await wait(ELIMINATION_STEP_MS);
    if (!mounted.current) return;
    setWinner(result);
    setPhase("finished");
    onReveal?.(result);
  }, [options, drawResult, onReveal]);

  const reset = useCallback(() => {
    setPhase("idle");
    setEliminated(new Set());
    setWinner(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { phase, eliminated, winner, error, start, reset, clearError };
}
