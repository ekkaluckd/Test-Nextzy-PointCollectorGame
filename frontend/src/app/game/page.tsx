import type { Metadata } from "next";
import { GameScreen } from "@/features/game/GameScreen";

export const metadata: Metadata = {
  title: "เล่นเกม | เกมสะสมคะแนน Nextzy",
};

export default function GamePage() {
  return (
    <main className="mx-auto flex w-full max-w-[500px] flex-1 flex-col">
      <GameScreen />
    </main>
  );
}
