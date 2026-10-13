import { formatNumber } from "@/lib/format";

export type ChipState = "active" | "eliminated" | "winner";

const stateClasses: Record<ChipState, string> = {
  active: "bg-chip text-chip-text",
  eliminated: "bg-transparent text-chip-faded",
  winner: "bg-chip-win text-chip-text",
};

export function ScoreChip({ value, state }: { value: number; state: ChipState }) {
  return (
    <span
      className={`flex h-[38px] items-center justify-center rounded-[12.5px] text-2xl font-semibold transition-colors duration-300 ${stateClasses[state]}`}
    >
      {formatNumber(value)}
    </span>
  );
}
