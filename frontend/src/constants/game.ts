export const SCORE_OPTIONS = [300, 500, 1000, 3000] as const;

export const MAX_SCORE = 10000;

export const CHECKPOINTS = [
  { score: 5000, rewardName: "A" },
  { score: 7500, rewardName: "B" },
  { score: 10000, rewardName: "C" },
] as const;

/** Delay between eliminating each chip during the draw animation. */
export const ELIMINATION_STEP_MS = 500;
