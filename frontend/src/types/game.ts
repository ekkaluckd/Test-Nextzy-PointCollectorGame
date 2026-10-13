export type CheckpointStatus = "LOCKED" | "CLAIMABLE" | "CLAIMED";

export interface Checkpoint {
  score: number;
  rewardName: string;
  status: CheckpointStatus;
}

export interface PlayerSummary {
  totalScore: number;
  maxScore: number;
  checkpoints: Checkpoint[];
}

export interface PlayHistoryItem {
  id: string;
  score: number;
  playedAt: string;
}

export interface RewardHistoryItem {
  id: string;
  rewardName: string;
  claimedAt: string;
}
