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

export function HistoryTabs({ plays, rewards }: HistoryTabsProps) {
  const [tab, setTab] = useState<Tab>("play");

  const items =
    tab === "play"
      ? plays.map((p) => ({
          id: p.id,
          title: `เล่นได้ ${formatNumber(p.score)} คะแนน`,
          subtitle: `เล่นเมื่อ ${formatDateTime(p.playedAt)}`,
        }))
      : rewards.map((r) => ({
          id: r.id,
          title: `ได้รับรางวัล ${r.rewardName}`,
          subtitle: `ได้รับเมื่อ ${formatDateTime(r.claimedAt)}`,
        }));

  return (
    <section>
      <div role="tablist" className="flex gap-2 px-2.5 pb-4">
        <TabPill label="ประวัติการเล่น" active={tab === "play"} onClick={() => setTab("play")} />
        <TabPill label="ประวัติรางวัล" active={tab === "reward"} onClick={() => setTab("reward")} />
      </div>

      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-subtle">
          {tab === "play" ? "ยังไม่มีประวัติการเล่น" : "ยังไม่มีประวัติรางวัล"}
        </p>
      ) : (
        <ul>
          {items.map((item) => (
            <HistoryItem key={item.id} variant={tab} title={item.title} subtitle={item.subtitle} />
          ))}
        </ul>
      )}
    </section>
  );
}
