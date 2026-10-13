import type { Metadata } from "next";
import { GameScreen } from "@/features/game/GameScreen";

export const metadata: Metadata = {
  title: "เล่นเกม | เกมสะสมคะแนน Nextzy",
};

export default function GamePage() {
  return <GameScreen />;
}
