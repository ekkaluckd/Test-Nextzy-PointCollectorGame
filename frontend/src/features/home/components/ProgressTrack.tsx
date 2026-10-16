import type { Checkpoint } from "@/types/game";
import { formatNumber } from "@/lib/format";
import { CheckIcon } from "@/components/icons";
import { CoinImage } from "@/components/CoinImage";
import { positionStyle } from "../utils";

interface ProgressTrackProps {
  totalScore: number;
  maxScore: number;
  checkpoints: Checkpoint[];
}

function CheckpointMarker({ checkpoint, isFinal }: { checkpoint: Checkpoint; isFinal: boolean }) {
  if (isFinal) return <CoinImage size={24} />;

  const reached = checkpoint.status !== "LOCKED";
  return (
    <span
      className={`flex size-5 items-center justify-center rounded-full text-white ${
        checkpoint.status === "CLAIMED" ? "bg-success" : reached ? "bg-gray" : "bg-track"
      }`}
    >
      {reached && <CheckIcon className="size-3" />}
    </span>
  );
}

export function ProgressTrack({ totalScore, maxScore, checkpoints }: ProgressTrackProps) {
  const percent = Math.min((totalScore / maxScore) * 100, 100);

  return (
    <div className="mt-3">
      <div className="relative h-5">
        {checkpoints.map((cp) => (
          <span
            key={cp.score}
            className="absolute text-[10px] text-caption"
            style={positionStyle((cp.score / maxScore) * 100)}
          >
            {formatNumber(cp.score)}
          </span>
        ))}
      </div>

      <div
        className="relative flex h-6 items-center"
        role="progressbar"
        aria-label="คะแนนสะสม"
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-valuenow={totalScore}
      >
        <div className="h-2 w-full rounded-full bg-track">
          <div
            className="h-full rounded-full bg-progress transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        {percent > 0 && percent < 100 && (
          <span
            className="absolute size-3.5 rounded-full bg-gradient-play"
            style={positionStyle(percent)}
          />
        )}

        {checkpoints.map((cp, i) => (
          <span key={cp.score} className="absolute" style={positionStyle((cp.score / maxScore) * 100)}>
            <CheckpointMarker checkpoint={cp} isFinal={i === checkpoints.length - 1} />
          </span>
        ))}
      </div>
    </div>
  );
}
