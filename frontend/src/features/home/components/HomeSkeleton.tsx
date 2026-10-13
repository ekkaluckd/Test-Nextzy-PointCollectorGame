import { Skeleton } from "@/components/ui/Skeleton";

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="กำลังโหลด">
      <div className="bg-hero p-4">
        <Skeleton className="h-[184px] rounded-2xl bg-white" />
      </div>
      <div className="flex justify-center py-6">
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <div className="flex gap-2 px-2.5 pb-4">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-5 border border-border px-6 py-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
