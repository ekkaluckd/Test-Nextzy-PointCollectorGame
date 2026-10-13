"use client";

import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";

interface ModalProps {
  open: boolean;
  title: string;
  description: string;
  icon?: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, description, icon, onClose }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative flex w-full max-w-[340px] flex-col items-center gap-8 rounded-[20px] bg-white px-4 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="ปิด"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray"
        >
          <CloseIcon className="size-8" />
        </button>

        <div className="flex flex-col items-center gap-6">
          {icon}
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 id="modal-title" className="text-2xl font-medium text-foreground">
              {title}
            </h2>
            <p className="text-base text-muted">{description}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="h-[35px] w-[177px] rounded-full bg-accent text-base font-semibold text-white"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
