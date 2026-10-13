"use client";

import { useState } from "react";
import type { PlayHistoryItem, RewardHistoryItem } from "@/types/game";
import { TabPill } from "@/components/ui/TabPill";
import { formatDateTime, formatNumber } from "@/lib/format";
import { HistoryItem } from "./HistoryItem";

type Tab = "play" | "reward";

interface HistoryTabsProps {
  plays: PlayHistoryItem[];
  rewards: RewardHistoryItem[];
}

function EmptyState({ text }: { text: string }) {
  return <p className="py-10 text-center text-sm text-subtle">{text}</p>;
}

export function HistoryTabs({ plays, rewards }: HistoryTabsProps) {
  const [tab, setTab] = useState<Tab>("play");

  return (
    <section>
      <div role="tablist" className="flex gap-2 px-2.5 pb-4">
        <TabPill label="ประวัติการเล่น" active={tab === "play"} onClick={() => setTab("play")} />
        <TabPill label="ประวัติรางวัล" active={tab === "reward"} onClick={() => setTab("reward")} />
      </div>

      {tab === "play" ? (
        plays.length === 0 ? (
          <EmptyState text="ยังไม่มีประวัติการเล่น" />
        ) : (
          <ul>
            {plays.map((p) => (
              <HistoryItem
                key={p.id}
                variant="play"
                title={`เล่นได้ ${formatNumber(p.score)} คะแนน`}
                subtitle={`เล่นเมื่อ ${formatDateTime(p.playedAt)}`}
              />
            ))}
          </ul>
        )
      ) : rewards.length === 0 ? (
        <EmptyState text="ยังไม่มีประวัติรางวัล" />
      ) : (
        <ul>
          {rewards.map((r) => (
            <HistoryItem
              key={r.id}
              variant="reward"
              title={`ได้รับรางวัล ${r.rewardName}`}
              subtitle={`ได้รับเมื่อ ${formatDateTime(r.claimedAt)}`}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
