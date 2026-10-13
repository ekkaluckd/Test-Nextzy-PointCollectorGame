import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold text-heading">ไม่พบหน้านี้</h1>
      <Link href="/" className="rounded-full bg-accent px-6 py-2 font-bold text-white">
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
