import type { PlayerSummary, PlayHistoryItem, RewardHistoryItem } from "@/types/game";

// Temporary fixtures until the frontend is wired to the Go API.
export const mockSummary: PlayerSummary = {
  totalScore: 8500,
  maxScore: 10000,
  checkpoints: [
    { score: 5000, rewardName: "A", status: "CLAIMED" },
    { score: 7500, rewardName: "B", status: "CLAIMABLE" },
    { score: 10000, rewardName: "C", status: "LOCKED" },
  ],
};

export const mockPlayHistory: PlayHistoryItem[] = [
  { id: "p2", score: 1000, playedAt: "2025-02-15T20:00:00+07:00" },
  { id: "p1", score: 300, playedAt: "2025-02-14T19:30:00+07:00" },
];

export const mockRewardHistory: RewardHistoryItem[] = [
  { id: "r1", rewardName: "A", claimedAt: "2025-02-15T20:00:00+07:00" },
];
