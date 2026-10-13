interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-10 text-center">
      <p className="text-sm text-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="h-9 rounded-full border border-brand px-5 text-sm text-brand"
      >
        ลองใหม่
      </button>
    </div>
  );
}
