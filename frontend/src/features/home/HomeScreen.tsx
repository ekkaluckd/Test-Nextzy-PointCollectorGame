"use client";

import { useState } from "react";
import Link from "next/link";
import type { Checkpoint } from "@/types/game";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StickyFooter } from "@/components/ui/StickyFooter";
import { CoinIcon } from "@/components/icons";
import { mockPlayHistory, mockRewardHistory, mockSummary } from "@/mocks/player";
import { ScoreCard } from "./components/ScoreCard";
import { HistoryTabs } from "./components/HistoryTabs";

export function HomeScreen() {
  // TODO: replace mock state with API calls.
  const [summary, setSummary] = useState(mockSummary);
  const [rewards, setRewards] = useState(mockRewardHistory);
  const [plays, setPlays] = useState(mockPlayHistory);
  const [claimed, setClaimed] = useState<Checkpoint | null>(null);

  const handleClaim = (checkpoint: Checkpoint) => {
    setSummary((s) => ({
      ...s,
      checkpoints: s.checkpoints.map((cp) =>
        cp.score === checkpoint.score ? { ...cp, status: "CLAIMED" } : cp,
      ),
    }));
    setRewards((r) => [
      { id: crypto.randomUUID(), rewardName: checkpoint.rewardName, claimedAt: new Date().toISOString() },
      ...r,
    ]);
    setClaimed(checkpoint);
  };

  const handleReset = () => {
    setSummary({
      ...summary,
      totalScore: 0,
      checkpoints: summary.checkpoints.map((cp) => ({ ...cp, status: "LOCKED" })),
    });
    setPlays([]);
    setRewards([]);
  };

  return (
    <>
      <div className="bg-hero px-4 py-4">
        <ScoreCard
          totalScore={summary.totalScore}
          maxScore={summary.maxScore}
          checkpoints={summary.checkpoints}
          claimingScore={null}
          onClaim={handleClaim}
        />
      </div>

      <div className="flex justify-center py-6">
        <Button variant="reset" onClick={handleReset}>
          RESET
        </Button>
      </div>

      <div className="pb-28">
        <HistoryTabs plays={plays} rewards={rewards} />
      </div>

      <StickyFooter>
        <Link
          href="/game"
          className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-xl font-bold text-white"
        >
          ไปเล่นเกม
        </Link>
      </StickyFooter>

      <Modal
        open={claimed !== null}
        icon={<CoinIcon className="size-[78px]" />}
        title="ยินดีด้วย"
        description={`คุณได้รับรางวัล ${claimed?.rewardName ?? ""}`}
        onClose={() => setClaimed(null)}
      />
    </>
  );
}
