"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function Error({ error, retry }: { error: Error; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-[500px] flex-1 flex-col justify-center bg-background">
      <ErrorState message="เกิดข้อผิดพลาดบางอย่าง" onRetry={retry} />
    </main>
  );
}
