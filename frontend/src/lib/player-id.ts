const STORAGE_KEY = "nextzy-player-id";

/** Anonymous id per browser, so testers playing at the same time don't share data. */
export function getPlayerId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // Storage blocked (e.g. private mode): fall back to a per-session id.
    return (fallbackId ??= crypto.randomUUID());
  }
}

let fallbackId: string | undefined;
