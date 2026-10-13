import Image from "next/image";

/** Gold crown coin from the Figma design, used for the final checkpoint and reward modal. */
export function CoinImage({ size, className = "" }: { size: number; className?: string }) {
  return <Image src="/images/coin.png" alt="" width={size} height={size} className={className} />;
}
