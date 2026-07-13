import { Skeleton } from "@/components/ui/skeleton";

const StudentGradeCardSkeleton = () => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] dark:border dark:border-border dark:bg-card dark:shadow-none">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-5 sm:gap-8">
          <Skeleton className="h-2 w-20 rounded-full sm:w-28" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
      </div>
    </div>
  );
};

export default StudentGradeCardSkeleton;
