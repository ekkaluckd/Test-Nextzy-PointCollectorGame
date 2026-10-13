"use client";

import { useEffect } from "react";

const AUTO_HIDE_MS = 3000;

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

/** Short-lived error message for failed actions (claim, reset, play). */
export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-4 z-[60] mx-auto w-fit max-w-[calc(100%-2rem)] rounded-full bg-foreground px-5 py-2 text-sm text-white shadow-lg"
    >
      {message}
    </div>
  );
}
