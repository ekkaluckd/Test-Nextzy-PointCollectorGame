interface TabPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function TabPill({ label, active, onClick }: TabPillProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`h-8 rounded-full border px-3 text-[13px] ${
        active ? "border-tab-active text-tab-active" : "border-gray text-gray"
      }`}
    >
      {label}
    </button>
  );
}
