"use client";

import { useState } from "react";
import Link from "next/link";
import type { Checkpoint } from "@/types/game";
import { gameService } from "@/services/game-service";
import { useAsyncData } from "@/hooks/useAsyncData";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { ErrorState } from "@/components/ui/ErrorState";
import { StickyFooter } from "@/components/ui/StickyFooter";
import { CoinImage } from "@/components/CoinImage";
import { ScoreCard } from "./components/ScoreCard";
import { HistoryTabs } from "./components/HistoryTabs";
import { HomeSkeleton } from "./components/HomeSkeleton";

const loadHomeData = async () => {
  const [summary, plays, rewards] = await Promise.all([
    gameService.getSummary(),
    gameService.getPlayHistory(),
    gameService.getRewardHistory(),
  ]);
  return { summary, plays, rewards };
};

export function HomeScreen() {
  const { state, reload, refresh } = useAsyncData(loadHomeData);
  const [claimingScore, setClaimingScore] = useState<number | null>(null);
  const [resetting, setResetting] = useState(false);
  const [claimedReward, setClaimedReward] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const runAction = async (action: () => Promise<void>) => {
    try {
      await action();
      await refresh();
    } catch (e) {
      setToast(e instanceof Error ? e.message : "ทำรายการไม่สำเร็จ");
    }
  };

  const handleClaim = async (checkpoint: Checkpoint) => {
    setClaimingScore(checkpoint.score);
    await runAction(async () => {
      const reward = await gameService.claimReward(checkpoint.score);
      setClaimedReward(reward.rewardName);
    });
    setClaimingScore(null);
  };

  const handleReset = async () => {
    setResetting(true);
    await runAction(gameService.reset);
    setResetting(false);
  };

  return (
    <>
      {state.status === "loading" && <HomeSkeleton />}
      {state.status === "error" && <ErrorState message={state.error} onRetry={reload} />}
      {state.status === "success" && (
        <>
          <div className="bg-hero p-4">
            <ScoreCard {...state.data.summary} claimingScore={claimingScore} onClaim={handleClaim} />
          </div>

          <div className="flex justify-center py-6">
            <Button variant="reset" onClick={handleReset} disabled={resetting}>
              {resetting ? "กำลังรีเซต..." : "RESET"}
            </Button>
          </div>

          <div className="pb-28">
            <HistoryTabs plays={state.data.plays} rewards={state.data.rewards} />
          </div>
        </>
      )}

      <StickyFooter>
        <Link
          href="/game"
          className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-xl font-bold text-white"
        >
          ไปเล่นเกม
        </Link>
      </StickyFooter>

      <Modal
        open={claimedReward !== null}
        icon={<CoinImage size={78} className="-scale-x-100" />}
        title="ยินดีด้วย"
        description={`คุณได้รับรางวัล ${claimedReward ?? ""}`}
        onClose={() => setClaimedReward(null)}
      />
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
