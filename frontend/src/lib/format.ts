const numberFormatter = new Intl.NumberFormat("en-US");

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Formats an ISO date as "dd/MM/yy HH:mm น." to match the design. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}  ${pad(date.getHours())}:${pad(date.getMinutes())} น.`;
}
