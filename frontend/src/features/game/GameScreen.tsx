"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StickyFooter } from "@/components/ui/StickyFooter";
import { SCORE_OPTIONS } from "@/constants/game";
import { formatNumber } from "@/lib/format";
import { mockSummary } from "@/mocks/player";
import { ScoreChip, type ChipState } from "./components/ScoreChip";
import { useEliminationDraw } from "./useEliminationDraw";

export function GameScreen() {
  // TODO: replace mock state with API calls.
  const [totalScore, setTotalScore] = useState(mockSummary.totalScore);
  const maxScore = mockSummary.maxScore;

  // Holds the new total from the draw until the animation reveals it.
  const pendingTotal = useRef<number | null>(null);

  const drawResult = useCallback(async () => {
    const score = SCORE_OPTIONS[Math.floor(Math.random() * SCORE_OPTIONS.length)];
    pendingTotal.current = Math.min(totalScore + score, maxScore);
    return score;
  }, [totalScore, maxScore]);

  const handleReveal = useCallback(() => {
    if (pendingTotal.current !== null) setTotalScore(pendingTotal.current);
  }, []);

  const { phase, eliminated, winner, error, start, reset } = useEliminationDraw(
    SCORE_OPTIONS,
    drawResult,
    handleReveal,
  );

  const chipState = (value: number): ChipState =>
    winner === value ? "winner" : eliminated.has(value) || winner !== null ? "eliminated" : "active";

  return (
    <div className="flex flex-1 flex-col bg-gradient-game pb-28">
      <h1 className="pt-12 text-center text-2xl font-semibold text-heading">
        คะแนนสะสม {formatNumber(totalScore)}/{formatNumber(maxScore)}
      </h1>

      <div className="grid grid-cols-4 gap-2 px-2 pt-40">
        {SCORE_OPTIONS.map((value) => (
          <ScoreChip key={value} value={value} state={chipState(value)} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 pt-16">
        <Button variant="danger" onClick={start} disabled={phase !== "idle"}>
          {phase === "drawing" ? "กำลังสุ่ม..." : "สุ่มคะแนน"}
        </Button>
        {error && (
          <p role="alert" className="text-sm text-brand">
            {error}
          </p>
        )}
      </div>

      <StickyFooter>
        <Link
          href="/"
          className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-xl font-bold text-white"
        >
          กลับหน้าหลัก
        </Link>
      </StickyFooter>

      <Modal
        open={phase === "finished" && winner !== null}
        title="ได้รับ"
        description={`${formatNumber(winner ?? 0)} คะแนน`}
        onClose={reset}
      />
    </div>
  );
}
