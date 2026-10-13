interface HistoryItemProps {
  title: string;
  subtitle: string;
  variant: "play" | "reward";
}

export function HistoryItem({ title, subtitle, variant }: HistoryItemProps) {
  return (
    <li className="flex items-center gap-5 border border-border bg-white px-6 py-4">
      <span
        className={`size-12 shrink-0 rounded-full ${
          variant === "play" ? "bg-gradient-play" : "bg-gradient-reward"
        }`}
      />
      <div className="min-w-0">
        <p className="truncate text-base font-bold text-foreground">{title}</p>
        <p className="truncate text-sm text-subtle">{subtitle}</p>
      </div>
    </li>
  );
}
