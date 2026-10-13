import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Gold coin with a crown, used for the final reward. */
export function CoinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <circle cx="32" cy="32" r="31" fill="#f5a300" />
      <circle cx="32" cy="32" r="25" fill="#ffc124" stroke="#e08a00" strokeWidth="2" />
      <path d="M19 40h26l3-16-9 7-7-11-7 11-9-7 3 16Z" fill="#e08a00" />
      <rect x="19" y="42" width="26" height="4" rx="1.5" fill="#e08a00" />
    </svg>
  );
}
