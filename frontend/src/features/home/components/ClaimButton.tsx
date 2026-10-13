import type { Checkpoint } from "@/types/game";

interface ClaimButtonProps {
  checkpoint: Checkpoint;
  loading: boolean;
  onClaim: () => void;
}

const statusClasses = {
  CLAIMED: "bg-claimed",
  CLAIMABLE: "bg-brand",
  LOCKED: "bg-locked",
} as const;

export function ClaimButton({ checkpoint, loading, onClaim }: ClaimButtonProps) {
  const { status, rewardName } = checkpoint;
  const label =
    status === "CLAIMED" ? `ได้รางวัล ${rewardName} แล้ว` : `กดรับรางวัล ${rewardName}`;

  return (
    <button
      type="button"
      disabled={status !== "CLAIMABLE" || loading}
      onClick={onClaim}
      className={`h-5 whitespace-nowrap rounded-full px-2 text-[8px] font-bold text-white disabled:cursor-not-allowed ${statusClasses[status]} ${loading ? "opacity-60" : ""}`}
    >
      {loading ? "กำลังรับ..." : label}
    </button>
  );
}
