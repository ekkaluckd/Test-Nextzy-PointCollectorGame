import Link from "next/link";

/** Primary navigation button pinned to the bottom of the screen. */
export function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-app rounded-t-2xl bg-white px-4 pt-4 pb-6 shadow-footer">
      <Link
        href={href}
        className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-xl font-bold text-white"
      >
        {label}
      </Link>
    </footer>
  );
}
