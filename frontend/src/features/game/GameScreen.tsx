"use client";

import { useCallback, useRef, useState } from "react";
import { gameService } from "@/services/game-service";
import { useAsyncData } from "@/hooks/useAsyncData";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { FooterLink } from "@/components/ui/FooterLink";
import { SCORE_OPTIONS } from "@/constants/game";
import { formatNumber } from "@/lib/format";
import { ScoreChip, type ChipState } from "./components/ScoreChip";
import { useEliminationDraw } from "./useEliminationDraw";

export function GameScreen() {
  const { state, reload } = useAsyncData(gameService.getSummary);
  // Total revealed after a draw; overrides the loaded summary until the next visit.
  const [revealedTotal, setRevealedTotal] = useState<number | null>(null);
  const pendingTotal = useRef<number | null>(null);

  const drawResult = useCallback(async () => {
    const result = await gameService.play();
    pendingTotal.current = result.totalScore;
    return result.score;
  }, []);

  const handleReveal = useCallback(() => setRevealedTotal(pendingTotal.current), []);

  const { phase, eliminated, winner, error, start, reset, clearError } = useEliminationDraw(
    SCORE_OPTIONS,
    drawResult,
    handleReveal,
  );

  if (state.status === "error") {
    return <ErrorState message={state.error} onRetry={reload} />;
  }

  const summary = state.status === "success" ? state.data : null;
  const totalScore = revealedTotal ?? summary?.totalScore ?? 0;
  const isFull = summary !== null && totalScore >= summary.maxScore;

  const chipState = (value: number): ChipState =>
    winner === value ? "winner" : eliminated.has(value) || winner !== null ? "eliminated" : "active";

  return (
    <div className="flex flex-1 flex-col bg-gradient-game pb-28">
      <div className="flex h-[84px] items-end justify-center">
        {summary ? (
          <h1 className="text-center text-2xl font-semibold text-heading">
            คะแนนสะสม {formatNumber(totalScore)}/{formatNumber(summary.maxScore)}
          </h1>
        ) : (
          <Skeleton className="h-8 w-60 rounded-md" />
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 px-2 pt-40">
        {SCORE_OPTIONS.map((value) => (
          <ScoreChip key={value} value={value} state={chipState(value)} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 pt-16">
        <Button variant="danger" onClick={start} disabled={!summary || isFull || phase !== "idle"}>
          {phase === "drawing" ? "กำลังสุ่ม..." : "สุ่มคะแนน"}
        </Button>
        {isFull && phase === "idle" && (
          <p className="text-sm text-muted">คะแนนสะสมเต็มแล้ว กลับไปรับรางวัลที่หน้าหลักได้เลย</p>
        )}
      </div>

      <FooterLink href="/" label="กลับหน้าหลัก" />

      <Modal
        open={phase === "finished" && winner !== null}
        title="ได้รับ"
        description={`${formatNumber(winner ?? 0)} คะแนน`}
        onClose={reset}
      />
      <Toast message={error} onDismiss={clearError} />
    </div>
  );
}
