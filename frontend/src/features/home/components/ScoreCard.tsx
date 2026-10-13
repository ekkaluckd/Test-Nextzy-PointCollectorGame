import type { Checkpoint } from "@/types/game";
import { formatNumber } from "@/lib/format";
import { ProgressTrack } from "./ProgressTrack";
import { ClaimButton } from "./ClaimButton";
import { positionStyle } from "../utils";

interface ScoreCardProps {
  totalScore: number;
  maxScore: number;
  checkpoints: Checkpoint[];
  claimingScore: number | null;
  onClaim: (checkpoint: Checkpoint) => void;
}

export function ScoreCard({ totalScore, maxScore, checkpoints, claimingScore, onClaim }: ScoreCardProps) {
  return (
    <section className="relative rounded-2xl border border-black bg-white px-4 pt-4 pb-5">
      <span className="absolute top-3 -left-px rounded-r-full bg-badge px-2 py-0.5 text-[10px] font-medium text-white">
        แชร์คะแนน
      </span>

      <div className="text-right text-heading">
        <h1 className="text-base font-semibold">สะสมคะแนน</h1>
        <p className="text-base font-semibold">
          คะแนนครบ {formatNumber(maxScore)} รับรางวัลใหญ่
        </p>
        <p className="text-2xl font-semibold text-brand">
          {formatNumber(totalScore)}/{formatNumber(maxScore)}
        </p>
      </div>

      <ProgressTrack totalScore={totalScore} maxScore={maxScore} checkpoints={checkpoints} />

      <div className="relative mt-2 h-5">
        {checkpoints.map((cp) => (
          <div key={cp.score} className="absolute" style={positionStyle((cp.score / maxScore) * 100)}>
            <ClaimButton
              checkpoint={cp}
              loading={claimingScore === cp.score}
              onClaim={() => onClaim(cp)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
