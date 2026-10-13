"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function Error({ error, retry }: { error: Error; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col justify-center">
      <ErrorState message="เกิดข้อผิดพลาดบางอย่าง" onRetry={retry} />
    </div>
  );
}
