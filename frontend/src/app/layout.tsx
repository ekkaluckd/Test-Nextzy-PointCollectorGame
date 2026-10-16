import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { preconnect } from "react-dom";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "เกมสะสมคะแนน Nextzy",
  description: "สุ่มคะแนน สะสมแต้ม และปลดล็อกรางวัลตาม checkpoint",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Open the connection to the API early; the first data request is on the LCP path.
  if (process.env.NEXT_PUBLIC_API_URL) preconnect(process.env.NEXT_PUBLIC_API_URL, { crossOrigin: "anonymous" });

  return (
    <html lang="th" className={`${kanit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-surface">
        <main className="mx-auto flex w-full max-w-app flex-1 flex-col bg-background">{children}</main>
      </body>
    </html>
  );
}
