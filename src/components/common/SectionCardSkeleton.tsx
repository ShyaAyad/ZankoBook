import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/userStore";

interface SectionCardSkeletonProps {
  itemRows?: number;
}

const SectionCardSkeleton = ({ itemRows = 2 }: SectionCardSkeletonProps) => {
  const user = useUserStore((state) => state.user);
  const isLecturer = user?.roles[0].name === "lecturer";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* section header */}
      <div className="w-full flex items-center justify-between p-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-3.5 w-20 rounded" />
        </div>

        <div className="flex items-center gap-2">
          {isLecturer && (
            <>
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </>
          )}
          <Skeleton className="w-4 h-4 rounded" />
        </div>
      </div>

      {/* section items */}
      <div className="px-5">
        <div className="border-t border-gray-100" />
        <div className="divide-y divide-gray-100">
          {Array.from({ length: itemRows }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-xl" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isLecturer && (
                  <>
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                  </>
                )}
                <Skeleton className="w-16 h-9 rounded-lg" />
              </div>
            </div>
          ))}

          {isLecturer && (
            <div className="flex gap-3 py-4">
              <Skeleton className="flex-1 h-11 rounded-xl" />
              <Skeleton className="flex-1 h-11 rounded-xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionCardSkeleton;
