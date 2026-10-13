import type { ReactNode } from "react";

/** Bottom action bar fixed to the viewport, constrained to the app width. */
export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[500px] rounded-t-2xl bg-white px-4 pt-4 pb-6 shadow-footer">
      {children}
    </footer>
  );
}
