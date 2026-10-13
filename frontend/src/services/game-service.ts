import type { PlayerSummary, PlayHistoryItem, RewardHistoryItem } from "@/types/game";
import { request } from "@/lib/api-client";
import { mockGameService } from "./mock-game-service";

export interface PlayResult {
  score: number;
  totalScore: number;
}

/** Everything the UI needs from the backend. Screens depend on this, not on fetch. */
export interface GameService {
  getSummary(): Promise<PlayerSummary>;
  getPlayHistory(): Promise<PlayHistoryItem[]>;
  getRewardHistory(): Promise<RewardHistoryItem[]>;
  play(): Promise<PlayResult>;
  claimReward(checkpointScore: number): Promise<RewardHistoryItem>;
  reset(): Promise<void>;
}

const httpGameService: GameService = {
  getSummary: () => request("/api/players/me/summary"),
  getPlayHistory: () => request("/api/players/me/plays"),
  getRewardHistory: () => request("/api/players/me/rewards"),
  play: () => request("/api/game/play", { method: "POST" }),
  claimReward: (score) => request(`/api/rewards/${score}/claim`, { method: "POST" }),
  reset: () => request("/api/players/me/reset", { method: "POST" }),
};

// Falls back to an in-browser mock until the API URL is configured.
export const gameService: GameService = process.env.NEXT_PUBLIC_API_URL
  ? httpGameService
  : mockGameService;
