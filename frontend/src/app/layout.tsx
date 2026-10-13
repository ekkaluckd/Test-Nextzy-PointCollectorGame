import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin", "thai"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "เกมสะสมคะแนน Nextzy",
  description: "สุ่มคะแนน สะสมแต้ม และปลดล็อกรางวัลตาม checkpoint",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${googleSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
