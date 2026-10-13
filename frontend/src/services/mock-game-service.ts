import type { CheckpointStatus, PlayHistoryItem, RewardHistoryItem } from "@/types/game";
import { CHECKPOINTS, MAX_SCORE, SCORE_OPTIONS } from "@/constants/game";
import { ApiError } from "@/lib/api-client";
import type { GameService } from "./game-service";

/** Local stand-in for the Go API, persisted in localStorage so Home and Game share state. */
interface State {
  totalScore: number;
  plays: PlayHistoryItem[];
  rewards: (RewardHistoryItem & { checkpointScore: number })[];
}

const STORAGE_KEY = "nextzy-mock-state";
const emptyState = (): State => ({ totalScore: 0, plays: [], rewards: [] });
const delay = () => new Promise((r) => setTimeout(r, 300));

function load(): State {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "") as State;
  } catch {
    return emptyState();
  }
}

function save(state: State) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore: the mock still works for the current page.
  }
}

function statusOf(state: State, score: number): CheckpointStatus {
  if (state.rewards.some((r) => r.checkpointScore === score)) return "CLAIMED";
  return state.totalScore >= score ? "CLAIMABLE" : "LOCKED";
}

export const mockGameService: GameService = {
  async getSummary() {
    await delay();
    const state = load();
    return {
      totalScore: state.totalScore,
      maxScore: MAX_SCORE,
      checkpoints: CHECKPOINTS.map((cp) => ({ ...cp, status: statusOf(state, cp.score) })),
    };
  },

  async getPlayHistory() {
    await delay();
    return load().plays;
  },

  async getRewardHistory() {
    await delay();
    return load().rewards;
  },

  async play() {
    await delay();
    const state = load();
    if (state.totalScore >= MAX_SCORE) throw new ApiError("คะแนนสะสมเต็มแล้ว", 409);

    const score = SCORE_OPTIONS[Math.floor(Math.random() * SCORE_OPTIONS.length)];
    state.totalScore = Math.min(state.totalScore + score, MAX_SCORE);
    state.plays.unshift({ id: crypto.randomUUID(), score, playedAt: new Date().toISOString() });
    save(state);
    return { score, totalScore: state.totalScore };
  },

  async claimReward(checkpointScore) {
    await delay();
    const state = load();
    const checkpoint = CHECKPOINTS.find((cp) => cp.score === checkpointScore);
    if (!checkpoint) throw new ApiError("ไม่พบรางวัลนี้", 404);
    if (statusOf(state, checkpointScore) !== "CLAIMABLE") {
      throw new ApiError("ยังรับรางวัลนี้ไม่ได้", 409);
    }

    const reward = {
      id: crypto.randomUUID(),
      checkpointScore,
      rewardName: checkpoint.rewardName,
      claimedAt: new Date().toISOString(),
    };
    state.rewards.unshift(reward);
    save(state);
    return reward;
  },

  async reset() {
    await delay();
    save(emptyState());
  },
};
